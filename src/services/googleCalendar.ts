// src/services/googleCalendar.ts

const ENV_CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID as
  | string
  | undefined;

const API_KEY = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY as
  | string
  | undefined;

// Fallback to your Public Skate calendar if env is missing
const FALLBACK_CALENDAR_ID =
  "8cdb8282e8d925234951e11b5002f474b68c876106fe54d8f8ec04c273566bab@group.calendar.google.com";

const CALENDAR_ID = (ENV_CALENDAR_ID || FALLBACK_CALENDAR_ID).trim();

const TZ = "America/New_York";

/**
 * ✅ Only show Public Skate events.
 * Add/remove keywords as needed to match your naming in Google Calendar.
 */
const PUBLIC_SKATE_KEYWORDS = [
  "public skate",
  "public skating",
  "public skates",
];

export interface CalendarEvent {
  day: string;
  date: string;
  start: string;
  end: string;
  summary?: string;
}

type GoogleCalendarItem = {
  status?: string;
  summary?: string;
  start?: { dateTime?: string; date?: string; timeZone?: string };
  end?: { dateTime?: string; date?: string; timeZone?: string };
};

function isAllDay(item: GoogleCalendarItem): boolean {
  return !!item.start?.date && !item.start?.dateTime;
}

/**
 * If Google gives a date-only string (YYYY-MM-DD), creating Date(date) can shift the day
 * depending on timezone. To stabilize weekday/date display, interpret date-only as midday.
 */
function normalizeForDisplay(dateString: string): string {
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  return isDateOnly ? `${dateString}T12:00:00` : dateString;
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: TZ,
  });
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    timeZone: TZ,
  });
}

function getDayOfWeek(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: TZ,
  });
}

function matchesPublicSkate(summary?: string): boolean {
  const s = (summary ?? "").toLowerCase().trim();
  if (!s) return false;
  return PUBLIC_SKATE_KEYWORDS.some((k) => s.includes(k));
}

export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  if (!API_KEY) {
    console.error(
      "[Calendar] Missing env var: VITE_GOOGLE_CALENDAR_API_KEY."
    );
    return [];
  }

  if (!CALENDAR_ID) {
    console.error("[Calendar] Missing calendar id.");
    return [];
  }

  try {
    const now = new Date();
    const daysFromNow = new Date(now);
    daysFromNow.setDate(now.getDate() + 30);

    const timeMin = now.toISOString();
    const timeMax = daysFromNow.toISOString();

    const params = new URLSearchParams({
      key: API_KEY,
      timeMin,
      timeMax,
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: "100",
      timeZone: TZ,
      fields: "items(status,summary,start(dateTime,date),end(dateTime,date))",
    });

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      CALENDAR_ID
    )}/events?${params.toString()}`;

    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      const text = await response.text();
      let message = text;

      try {
        const json = JSON.parse(text);
        message = json?.error?.message || text;
      } catch {
        // ignore
      }

      console.error("[Calendar] Google Calendar API failed:", {
        status: response.status,
        statusText: response.statusText,
        message,
        calendarId: CALENDAR_ID,
      });

      return [];
    }

    const data: { items?: GoogleCalendarItem[] } = await response.json();
    const items = Array.isArray(data.items) ? data.items : [];
    if (items.length === 0) return [];

    const events: CalendarEvent[] = items
      .filter((item) => item.status !== "cancelled")
      // ✅ FILTER OUT NON–PUBLIC SKATE EVENTS
      .filter((item) => matchesPublicSkate(item.summary))
      .map((item) => {
        const allDay = isAllDay(item);

        const rawStart = item.start?.dateTime || item.start?.date;
        const rawEnd = item.end?.dateTime || item.end?.date;
        if (!rawStart || !rawEnd) return null;

        const startForDisplay = normalizeForDisplay(rawStart);
        const endForDisplay = normalizeForDisplay(rawEnd);

        return {
          day: getDayOfWeek(startForDisplay),
          date: formatDate(startForDisplay),
          start: allDay ? "All Day" : formatTime(startForDisplay),
          end: allDay ? "" : formatTime(endForDisplay),
          summary: item.summary,
        } as CalendarEvent;
      })
      .filter(Boolean) as CalendarEvent[];

    return events;
  } catch (error) {
    console.error("[Calendar] Error fetching calendar events:", error);
    return [];
  }
}
