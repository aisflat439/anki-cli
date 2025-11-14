import { useQuery } from "@tanstack/react-query";
import { getReviewActivityByDay } from "../db/domain/reviews";
import { ActivityCube } from "../components/ActivityCube";

export function Stats() {
  const { data: reviewsByDay, isLoading } = useQuery({
    queryKey: ["reviewActivity"],
    queryFn: getReviewActivityByDay,
  });

  if (isLoading) {
    return (
      <box>
        <text style={{ marginTop: 2 }}>Loading...</text>
      </box>
    );
  }

  const totalDays = reviewsByDay?.size ?? 0;
  const totalReviews = reviewsByDay
    ? Array.from(reviewsByDay.values()).reduce((sum, count) => sum + count, 0)
    : 0;

  // Build grid data structure: array of weeks, each week has 7 days
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 90); // Go back 90 days
  
  // Start from the first Sunday before our start date
  const firstDay = new Date(startDate);
  firstDay.setDate(startDate.getDate() - startDate.getDay());
  
  // Build weeks
  const weeks = [];
  let currentDate = new Date(firstDay);
  
  while (currentDate <= today) {
    const week = [];
    for (let day = 0; day < 7; day++) {
      const dayKey = currentDate.toISOString().split("T")[0]!;
      const count = reviewsByDay?.get(dayKey) || 0;
      week.push({ date: dayKey, count });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(week);
  }

  return (
    <scrollbox focused flexGrow={1}>
      <box>
        <text attributes={1}>ESC: Back to Menu</text>
      </box>

      <box style={{ marginTop: 1 }}>
        <text>{`Total days with activity: ${totalDays}`}</text>
      </box>

      <box style={{ marginTop: 1 }}>
        <text>{`Total reviews: ${totalReviews}`}</text>
      </box>

      {/* Activity grid - all weeks */}
      <box flexDirection="column" style={{ marginTop: 2 }}>
        <text>{`Total weeks: ${weeks.length}`}</text>
        <box flexDirection="row" style={{ marginTop: 1, gap: 1 }}>
          {weeks.map((week, weekIndex) => (
            <box key={weekIndex} flexDirection="column">
              {week.map((day, dayIndex) => (
                <ActivityCube key={dayIndex} intensity={Math.min(day.count, 4)} />
              ))}
            </box>
          ))}
        </box>
      </box>
    </scrollbox>
  );
}
