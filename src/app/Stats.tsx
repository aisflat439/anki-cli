import { useQuery } from "@tanstack/react-query";
import { getReviewActivityByDayLastYear, getReviewStats } from "../db/domain/reviews";
import { ActivityCube } from "../components/ActivityCube";
import { Frame } from "./Frame";

export function Stats() {
  const { data: reviewsByDay, isLoading } = useQuery({
    queryKey: ["reviewActivityLastYear"],
    queryFn: getReviewActivityByDayLastYear,
  });
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["reviewStats"],
    queryFn: getReviewStats,
  });

  if (isLoading || statsLoading) {
    return (
      <box>
        <text style={{ marginTop: 2 }}>Loading...</text>
      </box>
    );
  }

  const { totalReviews = 0, longestStreak = 0, longestHotStreak = 0 } = stats || {};

  // Build grid data structure: array of weeks, each week has 7 days
  // Always show last 52 weeks (1 year)
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (52 * 7)); // Go back 52 weeks
  
  // Start from the first Sunday before our start date
  const firstDay = new Date(startDate);
  firstDay.setDate(startDate.getDate() - startDate.getDay());
  
  // Build weeks
  const weeks: Array<Array<{ date: string; count: number }>> = [];
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
    <Frame title="Stats">
      <scrollbox focused flexGrow={1}>

      <box style={{ marginTop: 1 }}>
        <text>{`Total reviews: ${totalReviews}`}</text>
      </box>

      <box style={{ marginTop: 1 }}>
        <text>{`Longest streak: ${longestStreak} days`}</text>
      </box>

      <box style={{ marginTop: 1 }}>
        <text>{`Longest hot streak: ${longestHotStreak} days`}</text>
      </box>

      {/* Activity grid - all weeks */}
      <box flexDirection="column" style={{ marginTop: 2 }}>
        
        {/* Month labels - render as single continuous string */}
        <box flexDirection="row" style={{ marginTop: 1 }}>
          <box style={{ marginRight: 1 }}><text>   </text></box>
          <box>
            <text>
              {(() => {
                let output = '';
                let lastShownMonth = -1;
                let skipNext = 0;
                
                for (let i = 0; i < weeks.length; i++) {
                  if (skipNext > 0) {
                    skipNext--;
                    if (i < weeks.length - 1) output += ' ';
                    continue;
                  }
                  
                  const week = weeks[i]!;
                  const firstDayOfWeek = new Date(week[0]!.date);
                  const monthName = firstDayOfWeek.toLocaleDateString('en-US', { month: 'short' });
                  const currentMonth = firstDayOfWeek.getMonth();
                  
                  const isFirstWeekOfMonth = firstDayOfWeek.getDate() <= 7;
                  const shouldShowLabel = isFirstWeekOfMonth && currentMonth !== lastShownMonth;
                  
                  if (shouldShowLabel) {
                    output += monthName;
                    lastShownMonth = currentMonth;
                    // Skip the next 2 weeks (since month name is 3 chars, and we already used 1 position)
                    skipNext = 2;
                  } else {
                    output += ' ';
                  }
                  
                  // Add gap after each week except the last
                  if (i < weeks.length - 1) {
                    output += ' ';
                  }
                }
                return output;
              })()}
            </text>
          </box>
        </box>
        
        <box flexDirection="row">
          {/* Day labels */}
          <box flexDirection="column" style={{ marginRight: 1 }}>
            <box><text> </text></box>
            <box><text>Mon</text></box>
            <box><text> </text></box>
            <box><text>Wed</text></box>
            <box><text> </text></box>
            <box><text>Fri</text></box>
            <box><text> </text></box>
          </box>
          
          {/* Grid */}
          <box flexDirection="row" style={{ gap: 1 }}>
            {weeks.map((week, weekIndex) => (
              <box key={weekIndex} flexDirection="column">
                {week.map((day, dayIndex) => (
                  <ActivityCube key={dayIndex} intensity={Math.min(day.count, 4)} />
                ))}
              </box>
            ))}
          </box>
        </box>
      </box>
      </scrollbox>
    </Frame>
  );
}
