type ActivityCubeProps = {
  /** Activity intensity level (0 = no activity, 1-4 = increasing intensity) */
  intensity: number;
};

/**
 * Displays a single cube in the activity grid with GitHub-style contribution colors.
 * 
 * @param intensity - Activity level:
 *   - 0: No activity (dark gray)
 *   - 1: Low activity (darkest green)
 *   - 2: Medium activity (dark green)
 *   - 3: High activity (medium green)
 *   - 4+: Very high activity (bright green)
 */
export function ActivityCube({ intensity }: ActivityCubeProps) {
  /**
   * Maps intensity level to GitHub-style green colors
   */
  const getColor = (intensity: number): string => {
    if (intensity === 0) return "#2d333b";
    if (intensity === 1) return "#0e4429";
    if (intensity === 2) return "#006d32";
    if (intensity === 3) return "#26a641";
    return "#39d353";
  };

  return (
    <text fg={getColor(intensity)}>
      ■
    </text>
  );
}
