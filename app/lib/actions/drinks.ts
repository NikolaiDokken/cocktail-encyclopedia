"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { sql } from "@/app/lib/db";

export async function toggleLike(drinkId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/login");
  }

  try {
    const removed = await sql`
      DELETE FROM likes
      WHERE drink_id = ${drinkId} AND user_id = ${userId}
      RETURNING drink_id;
    `;
    if (removed.length === 0) {
      await sql`INSERT INTO likes (drink_id, user_id) VALUES (${drinkId}, ${userId});`;
    }
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to save like.");
  }

  revalidatePath("/");
  revalidatePath("/profile");
}
