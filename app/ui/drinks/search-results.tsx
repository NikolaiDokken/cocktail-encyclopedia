import { fetchFilteredDrinks } from "@/app/lib/data/drinks";
import DrinksList from "@/app/ui/drinks/drinks-list";

export default async function SearchResults({
  query,
  currentPage,
  userId,
}: {
  query: string;
  currentPage: number;
  userId: string | null;
}) {
  const drinks = await fetchFilteredDrinks(query, currentPage, userId);

  return (
    <DrinksList
      drinks={drinks}
      signedIn={userId !== null}
      emptyMessage={`No drinks match "${query}".`}
    />
  );
}
