import { Suspense } from "react";
import { getSession } from "@/app/lib/auth";
import { fetchDrinksPages } from "@/app/lib/data/drinks";
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import Pagination from "@/app/ui/pagination";
import SearchResults from "@/app/ui/drinks/search-results";
import DrinksListSkeleton from "@/app/ui/drinks/skeleton";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = (searchParams?.query ?? "").trim().slice(0, 100);
  const currentPage = Math.max(1, Math.trunc(Number(searchParams?.page)) || 1);

  const [totalPages, session] = await Promise.all([
    fetchDrinksPages(query),
    getSession(),
  ]);
  const userId = session?.user?.id ?? null;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Drinks</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search by drink or ingredient..." />
      </div>
      <Suspense key={query + currentPage} fallback={<DrinksListSkeleton />}>
        <SearchResults
          query={query}
          currentPage={currentPage}
          userId={userId}
        />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        {totalPages > 1 && <Pagination totalPages={totalPages} />}
      </div>
    </div>
  );
}
