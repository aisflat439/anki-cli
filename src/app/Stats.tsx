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

  // Build one week of data (last 7 days)
  const today = new Date();
  const oneWeekData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayKey = date.toISOString().split("T")[0]!;
    const count = reviewsByDay?.get(dayKey) || 0;
    oneWeekData.push({ date: dayKey, count });
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

      {/* Activity grid will go here */}
      <box flexDirection="column" style={{ marginTop: 2 }}>
        <text>Activity grid (coming soon)</text>
      </box>
    </scrollbox>
  );
}
