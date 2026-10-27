"use client";

import { useOptimistic, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { toggleLike } from "@/app/lib/actions";

export function LikeDrink({
  drinkId,
  liked,
  signedIn,
  showLabel = false,
}: {
  drinkId: string;
  liked: boolean;
  signedIn: boolean;
  // Show "Like" / "Liked" next to the heart instead of only the icon.
  showLabel?: boolean;
}) {
  // Flips immediately and settles on the server's value once the page
  // revalidates (or reverts if saving failed).
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(liked);
  const [error, setError] = useState<string>();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Return here after logging in, keeping the search or "back" target.
  const here = searchParams.size ? `${pathname}?${searchParams}` : pathname;

  const buttonClass = clsx(
    "inline-flex items-center gap-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-100",
    showLabel ? "px-3 py-2" : "p-2",
  );
  const text = (label: string) =>
    showLabel ? <span>{label}</span> : <span className="sr-only">{label}</span>;

  if (!signedIn) {
    return (
      <Link
        href={`/login?callbackUrl=${encodeURIComponent(here)}`}
        className={buttonClass}
      >
        <HeartIcon className="w-5" />
        {text(showLabel ? "Log in to like" : "Log in to like this drink")}
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
      <button className={buttonClass} aria-pressed={optimisticLiked}>
        {optimisticLiked ? (
          <HeartIconSolid className="w-5 text-red-500" />
        ) : (
          <HeartIcon className="w-5" />
        )}
        {showLabel ? text(optimisticLiked ? "Liked" : "Like") : text("Like")}
      </button>
      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
