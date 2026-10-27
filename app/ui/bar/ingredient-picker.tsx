"use client";

import { useOptimistic, useState, useTransition } from "react";
import clsx from "clsx";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { clearBar, toggleBarIngredient } from "@/app/lib/actions";
import type { BarIngredient } from "@/app/lib/drinks";

type Family = { name: string; members: BarIngredient[] };

// Ingredients with sub-types become a family (Gin: Gin, London Dry Gin, Old
// Tom Gin), listed depth-first so kinds stay together (Whiskey: American
// Whiskey, Bourbon, Rye Whiskey, Irish Whiskey, ...). The rest stand alone.
function groupIngredients(ingredients: BarIngredient[]) {
  const sorted = [...ingredients].sort((a, b) => a.name.localeCompare(b.name));
  const children = new Map<string | null, BarIngredient[]>();
  for (const ingredient of sorted) {
    const siblings = children.get(ingredient.parentId) ?? [];
    children.set(ingredient.parentId, [...siblings, ingredient]);
  }
  const descendants = (id: string): BarIngredient[] =>
    (children.get(id) ?? []).flatMap((child) => [
      child,
      ...descendants(child.id),
    ]);

  const families: Family[] = [];
  const singles: BarIngredient[] = [];
  for (const ingredient of children.get(null) ?? []) {
    const kinds = descendants(ingredient.id);
    if (kinds.length === 0) {
      singles.push(ingredient);
    } else {
      families.push({
        name: ingredient.name,
        members: [ingredient, ...kinds].filter((member) => member.selectable),
      });
    }
  }
  return {
    families,
    singles,
    selectable: sorted.filter((ingredient) => ingredient.selectable),
  };
}

// Ignores case and accents, like search ("creme" finds Crème de Cassis).
function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

type Change = { type: "toggle"; id: string } | { type: "clear" };

export default function IngredientPicker({
  ingredients,
  selected,
}: {
  ingredients: BarIngredient[];
  selected: string[];
}) {
  // Chips flip immediately and settle on the cookie's value once the page
  // re-renders (or revert if saving failed).
  const [bar, change] = useOptimistic(
    new Set(selected),
    (current, action: Change) => {
      if (action.type === "clear") return new Set<string>();
      const next = new Set(current);
      if (!next.delete(action.id)) next.add(action.id);
      return next;
    },
  );
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const [filter, setFilter] = useState("");

  const { families, singles, selectable } = groupIngredients(ingredients);
  const term = normalize(filter.trim());
  // Brand names the filter found the ingredient by, if not by its own name
  // ("disaronno" shows Amaretto).
  const matchedAliases = (ingredient: BarIngredient) =>
    term && !normalize(ingredient.name).includes(term)
      ? ingredient.aliases.filter((alias) => normalize(alias).includes(term))
      : [];
  const matches = (ingredient: BarIngredient) =>
    normalize(ingredient.name).includes(term) ||
    matchedAliases(ingredient).length > 0;
  const visibleFamilies = families
    .map((family) => ({
      ...family,
      // Searching a family's name ("rum") shows all of its kinds.
      members: normalize(family.name).includes(term)
        ? family.members
        : family.members.filter(matches),
    }))
    .filter((family) => family.members.length > 0);
  const visibleSingles = singles.filter(
    (ingredient) => ingredient.selectable && matches(ingredient),
  );
  const count = selectable.filter((ingredient) =>
    bar.has(ingredient.id),
  ).length;

  function toggle(id: string) {
    startTransition(async () => {
      change({ type: "toggle", id });
      const result = await toggleBarIngredient(id);
      setError(result?.error);
    });
  }

  function clear() {
    startTransition(async () => {
      change({ type: "clear" });
      await clearBar();
      setError(undefined);
    });
  }

  const chip = (ingredient: BarIngredient) => {
    const inBar = bar.has(ingredient.id);
    const aliases = matchedAliases(ingredient);
    return (
      <li key={ingredient.id}>
        <button
          type="button"
          aria-pressed={inBar}
          onClick={() => toggle(ingredient.id)}
          className={clsx(
            "rounded-full border px-3 py-1 text-sm",
            inBar
              ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-500"
              : "border-gray-200 text-gray-700 hover:bg-gray-100",
          )}
        >
          {ingredient.name}
          {aliases.length > 0 && (
            <span className={inBar ? "text-blue-100" : "text-gray-500"}>
              {" "}
              · {aliases.join(", ")}
            </span>
          )}
        </button>
      </li>
    );
  };

  return (
    <section aria-labelledby="bar-ingredients">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="bar-ingredients" className="text-sm text-gray-600">
          <span aria-live="polite">
            {count === 0
              ? "Nothing selected yet"
              : `${count} ${count === 1 ? "ingredient" : "ingredients"} selected`}
          </span>
        </h2>
        {count > 0 && (
          <button
            type="button"
            onClick={clear}
            className="text-sm text-gray-600 underline hover:text-gray-900"
          >
            Clear all
          </button>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      <div className="relative mt-3">
        <label htmlFor="ingredient-filter" className="sr-only">
          Filter ingredients
        </label>
        <input
          id="ingredient-filter"
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by ingredient or brand..."
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500"
        />
        <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Pick the most specific kind you have: London Dry Gin also counts for
        recipes that just say Gin. Water is assumed.
      </p>

      <div className="mt-5 space-y-4">
        {visibleFamilies.map((family) => (
          <div key={family.name}>
            <h3 className="mb-1.5 text-xs font-medium tracking-wide text-gray-500 uppercase">
              {family.name}
            </h3>
            <ul className="flex flex-wrap gap-1.5">
              {family.members.map(chip)}
            </ul>
          </div>
        ))}
        {visibleSingles.length > 0 && (
          <div>
            {visibleFamilies.length > 0 && (
              <h3 className="mb-1.5 text-xs font-medium tracking-wide text-gray-500 uppercase">
                Everything else
              </h3>
            )}
            <ul className="flex flex-wrap gap-1.5">
              {visibleSingles.map(chip)}
            </ul>
          </div>
        )}
        {visibleFamilies.length === 0 && visibleSingles.length === 0 && (
          <p className="text-sm text-gray-500">
            No ingredients match &quot;{filter.trim()}&quot;.
          </p>
        )}
      </div>
    </section>
  );
}
