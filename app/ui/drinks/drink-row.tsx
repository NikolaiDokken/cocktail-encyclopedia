import Link from "next/link";
import type { Drink } from "@/app/lib/drinks";
import { LikeDrink } from "@/app/ui/drinks/buttons";
import DrinkImage from "@/app/ui/drinks/drink-image";
import { ingredientSummary } from "@/app/ui/drinks/recipe";
import { lusitana } from "@/app/ui/fonts";

// One entry in a list of drinks: what you scan for when choosing. The whole
// row opens the drink; the like button sits above that link.
export default function DrinkRow({
  drink,
  signedIn,
  returnTo,
}: {
  // `missing`: required ingredients the visitor's bar doesn't have.
  drink: Drink & { missing?: string[] };
  signedIn: boolean;
  returnTo: string;
}) {
  const href = `/drinks/${drink.id}?from=${encodeURIComponent(returnTo)}`;

  return (
    <li className="relative flex items-center gap-4 px-3 py-4 hover:bg-gray-50 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-blue-500">
      <DrinkImage src={drink.imageUrl} sizes="56px" className="size-14" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-x-4 gap-y-0.5 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className={`${lusitana.className} text-xl text-gray-900`}>
            <Link
              href={href}
              className="after:absolute after:inset-0 focus-visible:outline-none"
            >
              {drink.name}
            </Link>
          </h2>
          {drink.category && (
            <span className="text-sm text-gray-500">{drink.category}</span>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-gray-600">
          {ingredientSummary(drink.recipe)}
        </p>
        {drink.missing && drink.missing.length > 0 && (
          <p className="mt-1 text-sm text-amber-700">
            Missing: {drink.missing.join(", ")}
          </p>
        )}
      </div>
      <div className="relative z-10">
        <LikeDrink drinkId={drink.id} liked={drink.liked} signedIn={signedIn} />
      </div>
    </li>
  );
}
