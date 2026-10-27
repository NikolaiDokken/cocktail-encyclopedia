import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getSession } from "@/app/lib/auth";
import { fetchDrink } from "@/app/lib/drinks";
import { safePath } from "@/app/lib/safe-path";
import { LikeDrink } from "@/app/ui/drinks/buttons";
import DrinkImage from "@/app/ui/drinks/drink-image";
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

function backLabel(back: string) {
  if (back.startsWith("/profile")) return "My drinks";
  if (back.startsWith("/bar")) return "My bar";
  return "Drinks";
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
    <article className="max-w-5xl">
      <Link
        href={back}
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeftIcon className="w-4" />
        {backLabel(back)}
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
        {/* On phones, keep the recipe near the top: smaller picture, and
            no empty placeholder. */}
        <figure
          className={
            drink.imageUrl ? "w-full max-w-56 lg:max-w-none" : "hidden lg:block"
          }
        >
          <DrinkImage
            src={drink.imageUrl}
            alt={drink.name}
            sizes="(min-width: 1024px) 272px, 224px"
            priority
            className="w-full"
          />
          {drink.imageSourceUrl && (
            <figcaption className="mt-2 text-xs text-gray-500">
              Photo:{" "}
              <a
                href={drink.imageSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-700"
              >
                {new URL(drink.imageSourceUrl).hostname.replace(/^www\./, "")}
              </a>
            </figcaption>
          )}
        </figure>

        <div className="min-w-0">
          <header className="flex flex-wrap items-start justify-between gap-4">
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
            <LikeDrink
              drinkId={drink.id}
              liked={drink.liked}
              signedIn={session !== null}
              showLabel
            />
          </header>

          <div className="mt-8 grid gap-10 xl:grid-cols-2 xl:gap-12">
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
                  <p className="leading-relaxed text-gray-800">
                    {drink.garnish}
                  </p>
                </>
              )}
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}
