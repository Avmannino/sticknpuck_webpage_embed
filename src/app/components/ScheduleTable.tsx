import { useState, useEffect } from "react";
import { fetchCalendarEvents, CalendarEvent } from "@/services/googleCalendar";

type ScheduleItem = {
  day: string;
  date: string;
  start: string;
  end: string;
};

function getOrdinalSuffix(day: number) {
  const mod100 = day % 100;
  if (mod100 >= 11 && mod100 <= 13) return "th";

  const mod10 = day % 10;
  if (mod10 === 1) return "st";
  if (mod10 === 2) return "nd";
  if (mod10 === 3) return "rd";
  return "th";
}

function parseDateStringToDate(value: string): Date | null {
  if (!value) return null;

  const s = value.trim();

  // Handles "MM/DD/YYYY"
  const mmddyyyy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const m = s.match(mmddyyyy);
  if (m) {
    const month = Number(m[1]);
    const day = Number(m[2]);
    const year = Number(m[3]);

    // Use local time to avoid timezone shifting
    const d = new Date(year, month - 1, day);
    if (!Number.isNaN(d.getTime())) return d;
  }

  // Handles ISO strings like "2026-02-18" or "2026-02-18T10:00:00Z"
  const d2 = new Date(s);
  if (!Number.isNaN(d2.getTime())) return d2;

  return null;
}

function formatLongOrdinalDate(value: string) {
  const d = parseDateStringToDate(value);
  if (!d) return value; // fallback to original if parsing fails

  const dayNum = d.getDate();
  const suffix = getOrdinalSuffix(dayNum);

  const monthName = d.toLocaleString("en-US", { month: "long" });
  const year = d.getFullYear();

  return `${monthName} ${dayNum}${suffix}, ${year}`;
}

export function ScheduleTable() {
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);

        // ✅ googleCalendar.ts already returns formatted events:
        // { day, date, start, end, summary? }
        const events: CalendarEvent[] = await fetchCalendarEvents();

        // Only keep the fields you want displayed
        const mapped: ScheduleItem[] = events.map((e) => ({
          day: e.day,
          date: e.date,
          start: e.start,
          end: e.end,
        }));

        setScheduleData(mapped);
        setError(null);
      } catch (err) {
        console.error("Failed to load calendar events:", err);
        setError("Failed to load schedule.");
        setScheduleData([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-300">Loading schedule...</div>
      </div>
    );
  }

  return (
    <div>
      {error ? (
        <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700">
              <th className="text-left p-2 sm:p-3 text-xs sm:text-sm text-gray-200 border-b border-gray-600">
                Day
              </th>
              <th className="text-left p-2 sm:p-3 text-xs sm:text-sm text-gray-200 border-b border-gray-600">
                Date
              </th>
              <th className="text-left p-2 sm:p-3 text-xs sm:text-sm text-gray-200 border-b border-gray-600">
                Start
              </th>
              <th className="text-left p-2 sm:p-3 text-xs sm:text-sm text-gray-200 border-b border-gray-600">
                End
              </th>
            </tr>
          </thead>

          <tbody>
            {scheduleData.length > 0 ? (
              scheduleData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-700 hover:bg-gray-700"
                >
                  <td className="p-2 sm:p-3 text-xs sm:text-sm text-white">
                    {item.day}
                  </td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-300">
                    {formatLongOrdinalDate(item.date)}
                  </td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-300">
                    {item.start}
                  </td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-300">
                    {item.end}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-400">
                  No events scheduled
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
