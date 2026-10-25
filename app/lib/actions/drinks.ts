"use server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/app/lib/db";
import { likes } from "@/app/lib/db/schema";

export async function toggleLike(drinkId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/login");
  }

  try {
    const removed = await db
      .delete(likes)
      .where(and(eq(likes.drinkId, drinkId), eq(likes.userId, userId)))
      .returning({ drinkId: likes.drinkId });
    if (removed.length === 0) {
      await db.insert(likes).values({ drinkId, userId });
    }
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to save like.");
  }

  revalidatePath("/");
  revalidatePath("/profile");
}
