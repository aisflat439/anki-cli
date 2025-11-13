import { useQuery } from "@tanstack/react-query";
import { getReviewActivityByDay } from "../db/domain/reviews";

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

  return (
    <box>
      <text attributes={1} style={{ marginTop: 2 }}>
        ESC: Back to Menu
      </text>
      <text style={{ marginTop: 1 }}>
        Total days with activity: {reviewsByDay?.size ?? 0}
      </text>
      <text style={{ marginTop: 1 }}>
        Total reviews:{" "}
        {reviewsByDay
          ? Array.from(reviewsByDay.values()).reduce(
              (sum, count) => sum + count,
              0,
            )
          : 0}
      </text>
    </box>
  );
}
