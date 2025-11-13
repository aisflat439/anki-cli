type ActivityCubeProps = {
  intensity: number; // 0 = no activity, 1-4 = increasing intensity
};

export function ActivityCube({ intensity }: ActivityCubeProps) {
  // Map intensity to green colors
  // 0 = light gray (no activity)
  // 1 = light green
  // 2 = medium green
  // 3 = bright green
  // 4+ = very bright green
  
  const getColor = (intensity: number): string => {
    if (intensity === 0) return "#2d333b"; // dark gray
    if (intensity === 1) return "#0e4429"; // darkest green
    if (intensity === 2) return "#006d32"; // dark green
    if (intensity === 3) return "#26a641"; // medium green
    return "#39d353"; // bright green for 4+
  };

  return (
    <text fg={getColor(intensity)}>
      ■
    </text>
  );
}
