import type { RecipeLine } from "@/app/lib/drinks";

// Units that read as an instruction rather than a measure.
const instructionUnits: Record<string, string> = {
  "top up": "Top up",
  "fill up": "Fill up",
  "to taste": "To taste",
  rim: "Rim",
};

const plurals: Record<string, string> = {
  dash: "dashes",
  splash: "splashes",
  pinch: "pinches",
  shot: "shots",
  "bar spoon": "bar spoons",
  teaspoon: "teaspoons",
  tablespoon: "tablespoons",
  part: "parts",
  cup: "cups",
  slice: "slices",
  wedge: "wedges",
  sprig: "sprigs",
  drop: "drops",
  chunk: "chunks",
  cube: "cubes",
  scoop: "scoops",
  can: "cans",
  leaf: "leaves",
  squeeze: "squeezes",
  glass: "glasses",
};

// "30 ml", "2 dashes", "Top up", or just "1" for pieces ("1 Lime").
export function formatMeasure({ amount, unit }: RecipeLine) {
  if (instructionUnits[unit]) {
    return instructionUnits[unit];
  }
  if (unit === "piece") {
    return amount;
  }
  // One or a fraction of one: "1 dash", "3/4 glass".
  const isOne = /^(1|\d+\/\d+)$/.test(amount);
  return `${amount} ${isOne ? unit : (plurals[unit] ?? unit)}`;
}

// Required ingredients by name, for scanning a list of drinks.
export function ingredientSummary(lines: RecipeLine[]) {
  return lines
    .filter((line) => !line.optional)
    .map((line) => line.name)
    .join(", ");
}

// A bartender's spec: measures right-aligned in their own column.
export default function Recipe({ lines }: { lines: RecipeLine[] }) {
  if (lines.length === 0) return null;

  return (
    <ul className="divide-y divide-gray-200 border-y border-gray-200">
      {lines.map((line, index) => (
        <li
          key={index}
          className="grid grid-cols-[5.5rem_1fr] items-baseline gap-4 py-2.5 sm:grid-cols-[6.5rem_1fr]"
        >
          <span className="text-right text-sm text-gray-500 tabular-nums">
            {formatMeasure(line)}
          </span>
          <span className="text-gray-900">
            {line.name}
            {line.optional && (
              <span className="text-sm text-gray-500"> (optional)</span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
