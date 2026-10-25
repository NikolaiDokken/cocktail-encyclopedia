import type { Drink } from "@/app/lib/definitions";
import DrinkCard from "@/app/ui/drinks/drink-card";

export default function DrinksList({
  drinks,
  signedIn,
  emptyMessage = "No drinks found.",
}: {
  drinks: Drink[];
  signedIn: boolean;
  emptyMessage?: string;
}) {
  if (drinks.length === 0) {
    return <p className="mt-6 text-sm text-gray-500">{emptyMessage}</p>;
  }

  return (
    <div className="mt-6 space-y-4">
      {drinks.map((drink) => (
        <DrinkCard key={drink.id} drink={drink} signedIn={signedIn} />
      ))}
    </div>
  );
}
