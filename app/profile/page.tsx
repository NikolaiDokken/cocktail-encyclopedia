import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { fetchLikedDrinks } from "@/app/lib/data/drinks";
import { lusitana } from "@/app/ui/fonts";
import DrinksList from "@/app/ui/drinks/drinks-list";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/login");
  }

  const drinks = await fetchLikedDrinks(userId);

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} text-2xl`}>
        {session.user?.name ? `${session.user.name}'s drinks` : "My drinks"}
      </h1>
      <DrinksList
        drinks={drinks}
        signedIn
        emptyMessage="You haven't liked any drinks yet."
      />
    </div>
  );
}
