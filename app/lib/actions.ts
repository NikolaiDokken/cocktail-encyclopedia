"use server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { likes } from "@/app/lib/db/schema";

// Returns an error message for the button to show, or nothing on success.
export async function toggleLike(
  drinkId: string,
): Promise<{ error: string } | undefined> {
  if (!z.string().uuid().safeParse(drinkId).success) {
    return { error: "Unknown drink." };
  }

  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const userId = session.user.id;

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
    return { error: "Couldn't save. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/profile");
}
