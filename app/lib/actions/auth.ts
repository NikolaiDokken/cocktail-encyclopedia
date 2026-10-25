"use server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { db } from "@/app/lib/db";
import { users } from "@/app/lib/db/schema";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export type SignUpState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

const SignUpSchema = z.object({
  name: z.string().trim().min(1, "Please enter a name."),
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export async function signUp(
  prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const parsed = SignUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Please fix the errors above.",
    };
  }

  const { name, email, password } = parsed.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert(users).values({ name, email, password: hashedPassword });
  } catch (error) {
    // PostgreSQL unique violation (Drizzle wraps the driver error in `cause`)
    const code = (error as { cause?: { code?: string } }).cause?.code;
    if (code === "23505") {
      return { message: "Email already exists. Please log in instead." };
    }

    console.error("Error signing up:", error);
    return {
      message:
        "An error occurred while creating your account. Please try again later.",
    };
  }

  await signIn("credentials", { email, password, redirectTo: "/" });
}
