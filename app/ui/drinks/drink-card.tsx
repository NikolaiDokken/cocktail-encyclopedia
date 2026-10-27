import Image from "next/image";
import type { Drink } from "@/app/lib/drinks";
import { LikeDrink } from "@/app/ui/drinks/buttons";
import Recipe from "@/app/ui/drinks/recipe";

export default function DrinkCard({
  drink,
  signedIn,
}: {
  drink: Drink;
  signedIn: boolean;
}) {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-sm border border-gray-200 lg:flex-row">
      {drink.imageUrl && (
        <Image
          src={drink.imageUrl}
          alt={drink.name}
          height={100}
          width={150}
          className="h-48 w-full flex-none object-cover lg:h-auto lg:w-[150px]"
        />
      )}
      <div className="flex flex-1 flex-col justify-between bg-white p-4 leading-normal">
        <div className="mb-4">
          <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-xl font-bold text-gray-900">
              {drink.name}
            </span>
            {drink.category && (
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-800">
                {drink.category}
              </span>
            )}
          </div>
          <Recipe lines={drink.recipe} />
          <p className="text-base text-gray-700">{drink.instructions}</p>
          {drink.garnish && (
            <p className="mt-2 text-sm text-gray-500">
              Garnish: {drink.garnish}
            </p>
          )}
        </div>
        <div className="flex items-center">
          <LikeDrink
            drinkId={drink.id}
            liked={drink.liked}
            signedIn={signedIn}
          />
        </div>
      </div>
    </div>
  );
}
