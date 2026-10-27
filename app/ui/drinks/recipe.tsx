import type { RecipeLine } from "@/app/lib/drinks";

// Units that read as an instruction rather than a measure.
const instructionUnits: Record<string, string> = {
  "top up": "Top up with",
  "fill up": "Fill up with",
};

const plurals: Record<string, string> = {
  dash: "dashes",
  splash: "splashes",
  pinch: "pinches",
  shot: "shots",
  "bar spoon": "bar spoons",
  teaspoon: "teaspoons",
  tablespoon: "tablespoons",
};

function formatLine({ name, amount, unit }: RecipeLine) {
  if (instructionUnits[unit]) {
    return `${instructionUnits[unit]} ${name}`;
  }
  // "piece" reads better without the unit: "1 Lime", "6 Mint".
  const isOne = amount === "1" || amount === "1/2" || amount === "1/4";
  const unitText =
    unit === "piece" ? "" : isOne ? unit : (plurals[unit] ?? unit);
  return [amount, unitText, name].filter(Boolean).join(" ");
}

export default function Recipe({ lines }: { lines: RecipeLine[] }) {
  if (lines.length === 0) return null;

  return (
    <ul className="mb-3 space-y-0.5 text-sm text-gray-800">
      {lines.map((line, index) => (
        <li key={index}>
          {formatLine(line)}
          {line.optional && <span className="text-gray-500"> (optional)</span>}
        </li>
      ))}
    </ul>
  );
}
