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
    <box flexDirection="column" flexGrow={1} style={{ padding: 2 }}>
      <text attributes={1}>ESC: Back to Menu</text>

      {/*
      <box style={{ marginTop: 1 }}>
        <text>{`Total days with activity: ${totalDays}`}</text>
      </box>

      <box style={{ marginTop: 1 }}>
        <text>{`Total reviews: ${totalReviews}`}</text>
      </box>

      <box flexDirection="row" style={{ marginTop: 2, gap: 1 }}>
        <text>Test cubes:</text>
        <ActivityCube intensity={0} />
        <ActivityCube intensity={1} />
        <ActivityCube intensity={2} />
        <ActivityCube intensity={3} />
        <ActivityCube intensity={4} />
      </box>*/}

      <box flexDirection="column" style={{ marginTop: 2 }}>
        <ActivityCube intensity={0} />
        <ActivityCube intensity={1} />
        <ActivityCube intensity={2} />
        <ActivityCube intensity={3} />
        <ActivityCube intensity={4} />
        <ActivityCube intensity={2} />
        <ActivityCube intensity={1} />
      </box>
    </box>
  );
}
