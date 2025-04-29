import {DrinksTableType} from "@/app/lib/definitions";
import {LikeDrink} from "@/app/ui/drinks/buttons";
import Image from 'next/image'

export default function DrinkCard({drink}:{drink: DrinksTableType}) {
    return (
        <div className="max-w-sm w-full lg:max-w-full lg:flex border border-gray-200 rounded">
            {drink.image_url ?
            <Image
                src={drink.image_url}
                alt="Picture of the author"
                height={100}
                width={150}
                objectFit="fill"
            />
                :<div></div>}
            <div
                className="bg-white rounded-b lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                <div className="mb-8">
                    <div className="text-gray-900 font-bold text-xl mb-2">{drink.name}</div>
                    <p className="text-gray-700 text-base">{drink.instructions}</p>
                </div>
                <div className="flex items-center">
                    <LikeDrink drinkId={drink.id} />
                </div>
            </div>
        </div>);
}