import Image from "next/image";
import type { Drink } from "@/app/lib/definitions";
import { LikeDrink } from "@/app/ui/drinks/buttons";

export default function DrinkCard({
  drink,
  signedIn,
}: {
  drink: Drink;
  signedIn: boolean;
}) {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded border border-gray-200 lg:flex-row">
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
          <div className="mb-2 text-xl font-bold text-gray-900">
            {drink.name}
          </div>
          <p className="text-base text-gray-700">{drink.instructions}</p>
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
