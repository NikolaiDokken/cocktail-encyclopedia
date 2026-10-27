import { fetchFilteredDrinks } from "@/app/lib/drinks";
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
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  if (currentPage > 1) params.set("page", String(currentPage));
  const returnTo = params.size ? `/?${params}` : "/";

  return (
    <DrinksList
      drinks={drinks}
      signedIn={userId !== null}
      returnTo={returnTo}
      emptyMessage={`No drinks match "${query}".`}
    />
  );
}
