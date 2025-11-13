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
    ? Array.from(reviewsByDay.values()).reduce(
        (sum, count) => sum + count,
        0,
      )
    : 0;

  return (
    <box flexDirection="column" style={{ padding: 2 }}>
      <text attributes={1} style={{ marginTop: 2 }}>
        ESC: Back to Menu
      </text>
      <text style={{ marginTop: 1 }}>
        {`Total days with activity: ${totalDays}`}
      </text>
      <text style={{ marginTop: 1 }}>
        {`Total reviews: ${totalReviews}`}
      </text>
      
      <box flexDirection="row" style={{ marginTop: 2, gap: 1 }}>
        <text>Test cubes:</text>
        <ActivityCube intensity={0} />
        <ActivityCube intensity={1} />
        <ActivityCube intensity={2} />
        <ActivityCube intensity={3} />
        <ActivityCube intensity={4} />
      </box>
    </box>
  );
}
