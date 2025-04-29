"use server"
import {sql} from "@vercel/postgres";
import {revalidatePath} from "next/cache";

export async function likeDrink(drinkId: string) {
    try {
        await sql`INSERT INTO likes (drink_id, user_id) VALUES (${drinkId}, ${"b2fea8c8-0154-43ac-8fe7-fa43a581717c"});`;
        revalidatePath("/");
        return { message: "Liked drink" };
    } catch(error) {
        console.log("error", error);
        return { message: "Database Error: Failed to save like" };
    }
}