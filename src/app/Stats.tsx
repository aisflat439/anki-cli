import { useEffect, useState } from "react";
import { db } from "../db/db";
import { reviews } from "../db/schema";
import { sql } from "drizzle-orm";
import { useLog } from "./LogProvider";
import { green, brightGreen, dim, t } from "@opentui/core";

interface DayActivity {
  date: string;
  count: number;
}

export function Stats() {
  const [activityData, setActivityData] = useState<Map<string, number>>(
    new Map(),
  );
  const { log } = useLog();

  useEffect(() => {
    // Get review counts for the last 365 days
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const oneYearAgoTimestamp = Math.floor(oneYearAgo.getTime() / 1000);

    log("Querying reviews from (seconds):", oneYearAgoTimestamp);

    const result = db
      .select({
        date: sql<string>`date(reviewed_at, 'unixepoch')`,
        count: sql<number>`count(*)`,
      })
      .from(reviews)
      .where(sql`reviewed_at >= ${oneYearAgoTimestamp}`)
      .groupBy(sql`date(reviewed_at, 'unixepoch')`)
      .all();

    // log("Raw query result:", JSON.stringify(result.slice(0, 5)));
    // log("Total days with reviews:", result.length);

    const dataMap = new Map<string, number>();
    result.forEach((row) => {
      dataMap.set(row.date, row.count);
    });

    // log("Sample dates in map:", Array.from(dataMap.entries()).slice(0, 5));
    setActivityData(dataMap);
  }, []);

  // Build the contribution grid (7 rows x ~52 columns)
  const buildGrid = () => {
    const grid: { date: Date; count: number }[][] = [];
    const today = new Date();

    // Start from 365 days ago
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);

    // Find the previous Sunday to align the grid
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    let currentWeek: { date: Date; count: number }[] = [];
    const currentDate = new Date(startDate);

    // Build grid for ~53 weeks (to cover full year + alignment)
    for (let i = 0; i < 371; i++) {
      const dateStr = currentDate.toISOString().split("T")[0] || "";
      const count = activityData.get(dateStr) || 0;

      currentWeek.push({ date: new Date(currentDate), count });

      if (currentWeek.length === 7) {
        grid.push(currentWeek);
        currentWeek = [];
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return grid;
  };

  const grid = buildGrid();

  // Get color/intensity for a count
  const getIntensity = (count: number): number => {
    if (count === 0) return 0;
    if (count <= 5) return 1;
    if (count <= 10) return 2;
    if (count <= 20) return 3;
    return 4;
  };

  const getStyledChar = (intensity: number) => {
    switch (intensity) {
      case 0:
        return dim("·"); // no activity
      case 1:
        return green("▪"); // low
      case 2:
        return green("◼"); // medium
      case 3:
        return brightGreen("◼"); // high
      case 4:
        return brightGreen("█"); // very high
      default:
        return dim("·");
    }
  };

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get month labels - show first letter at the start of each month
  const getMonthLabels = () => {
    const labels = new Map<number, string>();
    const currentMonth = new Date().getMonth();
    let lastMonth = -1;
    
    grid.forEach((week, weekIndex) => {
      const firstDay = week[0];
      if (!firstDay) return;
      
      const month = firstDay.date.getMonth();
      // Only show if it's a new month AND not at the very beginning if it's the same as current month
      if (month !== lastMonth) {
        if (weekIndex === 0 && month === currentMonth) {
          // Skip - this is partial current month at the beginning
          lastMonth = month;
          return;
        }
        const monthName = firstDay.date.toLocaleDateString('en-US', { month: 'short' });
        labels.set(weekIndex, monthName.charAt(0));
        lastMonth = month;
      }
    });
    
    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <box flexDirection="column" flexGrow={1} style={{ padding: 2 }}>
      {/* Month labels */}
      <box flexDirection="row" style={{ marginBottom: 0 }}>
        <text style={{ width: 4 }}></text>
        {grid.map((week, weekIndex) => (
          <text key={weekIndex}>{monthLabels.get(weekIndex) || " "}</text>
        ))}
      </box>

      {/* Contribution Grid */}
      <box flexDirection="column" style={{ marginBottom: 1 }}>
        {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
          <box key={dayIndex} flexDirection="row">
            <text style={{ width: 4 }}>
              {dayIndex === 1 || dayIndex === 3 || dayIndex === 5
                ? (dayLabels[dayIndex] || "").slice(0, 3)
                : "   "}
            </text>
            {grid.map((week, weekIndex) => {
              const day = week?.[dayIndex];
              if (!day) return null;
              const intensity = getIntensity(day.count);
              return (
                <text
                  key={weekIndex}
                  content={t`${getStyledChar(intensity)}`}
                />
              );
            })}
          </box>
        ))}
      </box>

      <text
        style={{ marginTop: 1 }}
        content={t`Less ${getStyledChar(0)} ${getStyledChar(1)} ${getStyledChar(2)} ${getStyledChar(3)} ${getStyledChar(4)} More`}
      />

      <text attributes={1} style={{ marginTop: 2 }}>
        ESC: Back to Menu
      </text>
    </box>
  );
}
