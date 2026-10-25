import Link from "next/link";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { toggleLike } from "@/app/lib/actions/drinks";

const buttonClass = "rounded-md border p-2 hover:bg-gray-100";

export function LikeDrink({
  drinkId,
  liked,
  signedIn,
}: {
  drinkId: string;
  liked: boolean;
  signedIn: boolean;
}) {
  if (!signedIn) {
    return (
      <Link href="/login" className={buttonClass}>
        <span className="sr-only">Log in to like this drink</span>
        <HeartIcon className="w-5" />
      </Link>
    );
  }

  const toggleLikeWithId = toggleLike.bind(null, drinkId);

  return (
    <form action={toggleLikeWithId}>
      <button className={buttonClass}>
        <span className="sr-only">{liked ? "Unlike" : "Like"}</span>
        {liked ? (
          <HeartIconSolid className="w-5 text-red-500" />
        ) : (
          <HeartIcon className="w-5" />
        )}
      </button>
    </form>
  );
}
