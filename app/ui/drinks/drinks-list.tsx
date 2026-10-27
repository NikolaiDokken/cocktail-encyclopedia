import type { Drink } from "@/app/lib/drinks";
import DrinkRow from "@/app/ui/drinks/drink-row";

export default function DrinksList({
  drinks,
  signedIn,
  returnTo,
  emptyMessage = "No drinks found.",
}: {
  drinks: Drink[];
  signedIn: boolean;
  // Where "back" on a drink's page should lead, e.g. the current search.
  returnTo: string;
  emptyMessage?: string;
}) {
  if (drinks.length === 0) {
    return <p className="mt-6 text-sm text-gray-500">{emptyMessage}</p>;
  }

  return (
    <ul className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
      {drinks.map((drink) => (
        <DrinkRow
          key={drink.id}
          drink={drink}
          signedIn={signedIn}
          returnTo={returnTo}
        />
      ))}
    </ul>
  );
}
