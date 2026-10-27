import type { Metadata } from "next";
import { getSession } from "@/app/lib/auth";
import { getBar } from "@/app/lib/bar";
import { fetchBarDrinks, fetchBarIngredients } from "@/app/lib/drinks";
import IngredientPicker from "@/app/ui/bar/ingredient-picker";
import DrinksList from "@/app/ui/drinks/drinks-list";
import { lusitana } from "@/app/ui/fonts";

export const metadata: Metadata = {
  title: "My bar | Cocktail Encyclopedia",
};

export default async function Page() {
  const [bar, session] = await Promise.all([getBar(), getSession()]);
  const userId = session?.user.id ?? null;
  const [ingredients, { canMake, oneAway }] = await Promise.all([
    fetchBarIngredients(),
    fetchBarDrinks(bar, userId),
  ]);
  const heading = `${lusitana.className} text-xl text-gray-900`;

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} text-2xl`}>My bar</h1>
      <p className="mt-2 text-sm text-gray-600">
        Pick the ingredients you have to see which drinks you can make.{" "}
        {/* The results sit below the picker until the columns fit. */}
        {bar.length > 0 && (
          <a href="#bar-results" className="underline xl:hidden">
            {canMake.length === 1
              ? "See the 1 drink you can make"
              : `See the ${canMake.length} drinks you can make`}
          </a>
        )}
      </p>

      <div className="mt-6 grid gap-10 xl:grid-cols-2 xl:gap-12">
        <IngredientPicker ingredients={ingredients} selected={bar} />

        <div id="bar-results" className="min-w-0 scroll-mt-6 space-y-10">
          {bar.length === 0 ? (
            <p className="text-sm text-gray-500">
              The drinks you can make will show up here.
            </p>
          ) : (
            <>
              <section>
                <h2 className={heading}>You can make ({canMake.length})</h2>
                <DrinksList
                  drinks={canMake}
                  signedIn={userId !== null}
                  returnTo="/bar"
                  emptyMessage={
                    oneAway.length > 0
                      ? "Nothing yet, but the drinks below are one ingredient away."
                      : "Nothing yet. Add a few more ingredients."
                  }
                />
              </section>
              {oneAway.length > 0 && (
                <section>
                  <h2 className={heading}>
                    One ingredient away ({oneAway.length})
                  </h2>
                  <DrinksList
                    drinks={oneAway}
                    signedIn={userId !== null}
                    returnTo="/bar"
                  />
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
