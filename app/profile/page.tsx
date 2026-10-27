import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/auth";
import { fetchLikedDrinks } from "@/app/lib/drinks";
import { lusitana } from "@/app/ui/fonts";
import DrinksList from "@/app/ui/drinks/drinks-list";

export default async function Page() {
  const session = await getSession();
  if (!session) {
    redirect("/login?callbackUrl=/profile");
  }

  const drinks = await fetchLikedDrinks(session.user.id);

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} text-2xl`}>
        {session.user.name ? `${session.user.name}'s drinks` : "My drinks"}
      </h1>
      <DrinksList
        drinks={drinks}
        signedIn
        returnTo="/profile"
        emptyMessage="You haven't liked any drinks yet."
      />
    </div>
  );
}
