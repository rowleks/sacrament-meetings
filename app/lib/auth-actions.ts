"use server";

import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn, signOut } from "./auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
} | null;

export async function loginAction(
  _prevState: LoginState,
  payload: FormData,
): Promise<LoginState> {
  const email = (payload.get("email") as string) ?? "";
  const password = (payload.get("password") as string) ?? "";
  const callbackUrl = (payload.get("callbackUrl") as string) ?? "/meetings";

  const validated = loginSchema.safeParse({ email, password });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { message: "Invalid email or password." };
      }
      return { message: "Something went wrong. Please try again." };
    }
    throw error;
  }

  return null;
}

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}
