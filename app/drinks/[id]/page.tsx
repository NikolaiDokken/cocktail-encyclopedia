import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getSession } from "@/app/lib/auth";
import { fetchDrink } from "@/app/lib/drinks";
import { safePath } from "@/app/lib/safe-path";
import { LikeDrink } from "@/app/ui/drinks/buttons";
import Recipe from "@/app/ui/drinks/recipe";
import { lusitana } from "@/app/ui/fonts";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const drink = await fetchDrink(id, null);
  return drink ? { title: `${drink.name} | Cocktail Encyclopedia` } : {};
}

export default async function DrinkPage({ params, searchParams }: Props) {
  const [{ id }, { from }, session] = await Promise.all([
    params,
    searchParams,
    getSession(),
  ]);
  const drink = await fetchDrink(id, session?.user.id ?? null);
  if (!drink) {
    notFound();
  }

  const back = safePath(from);
  // Variations are stored as "Note: ..." at the end of the instructions.
  const [method, ...notes] = (drink.instructions ?? "").split(/\s*note:\s*/i);
  const heading = `${lusitana.className} text-lg text-gray-900`;

  return (
    <article className="max-w-4xl">
      <Link
        href={back}
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeftIcon className="w-4" />
        {back.startsWith("/profile") ? "My drinks" : "Drinks"}
      </Link>

      <header className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-5">
          {drink.imageUrl && (
            <Image
              src={drink.imageUrl}
              alt=""
              width={96}
              height={96}
              className="size-24 rounded-md object-cover"
            />
          )}
          <div>
            <h1
              className={`${lusitana.className} text-4xl leading-tight text-gray-900`}
            >
              {drink.name}
            </h1>
            {drink.category && (
              <p className="mt-1 text-gray-500">{drink.category}</p>
            )}
          </div>
        </div>
        <LikeDrink
          drinkId={drink.id}
          liked={drink.liked}
          signedIn={session !== null}
          showLabel
        />
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <section>
          <h2 className={`${heading} mb-3`}>Ingredients</h2>
          <Recipe lines={drink.recipe} />
        </section>

        <section className="max-w-prose">
          {method && (
            <>
              <h2 className={`${heading} mb-3`}>Method</h2>
              <p className="leading-relaxed text-gray-800">{method}</p>
            </>
          )}
          {notes.map((note) => (
            <p
              key={note}
              className="mt-4 text-sm leading-relaxed text-gray-500"
            >
              Note: {note}
            </p>
          ))}
          {drink.garnish && (
            <>
              <h2 className={`${heading} mt-8 mb-2`}>Garnish</h2>
              <p className="leading-relaxed text-gray-800">{drink.garnish}</p>
            </>
          )}
        </section>
      </div>
    </article>
  );
}
