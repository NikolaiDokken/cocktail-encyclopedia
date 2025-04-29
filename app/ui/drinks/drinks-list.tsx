import { fetchFilteredDrinks } from "@/app/lib/data/drinks";
import DrinkCard from "@/app/ui/drinks/drink-card";

export default async function DrinksList({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const drinks = await fetchFilteredDrinks(query, currentPage);

  return (
    <div className="mt-6 space-y-4">
      {drinks.map((drink) => (
          <DrinkCard key={drink.id} drink={drink} />
      ))}
    </div>
  );
}
