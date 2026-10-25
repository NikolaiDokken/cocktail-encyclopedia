"use client";

import { useOptimistic, useState } from "react";
import Link from "next/link";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { toggleLike } from "@/app/lib/actions";

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
  // Flips immediately and settles on the server's value once the page
  // revalidates (or reverts if saving failed).
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(liked);
  const [error, setError] = useState<string>();

  if (!signedIn) {
    return (
      <Link href="/login" className={buttonClass}>
        <span className="sr-only">Log in to like this drink</span>
        <HeartIcon className="w-5" />
      </Link>
    );
  }

  async function action() {
    setOptimisticLiked(!optimisticLiked);
    const result = await toggleLike(drinkId);
    setError(result?.error);
  }

  return (
    <form action={action} className="flex items-center gap-2">
      <button className={buttonClass}>
        <span className="sr-only">{optimisticLiked ? "Unlike" : "Like"}</span>
        {optimisticLiked ? (
          <HeartIconSolid className="w-5 text-red-500" />
        ) : (
          <HeartIcon className="w-5" />
        )}
      </button>
      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
