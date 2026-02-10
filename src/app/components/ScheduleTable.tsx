import { useState, useEffect } from "react";
import { fetchCalendarEvents, CalendarEvent } from "@/services/googleCalendar";

type ScheduleItem = {
  day: string;
  date: string;
  start: string;
  end: string;
};

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
                    {item.date}
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
