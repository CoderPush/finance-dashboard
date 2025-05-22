"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const signInAction = async (formData: FormData) => {
  const allowedEmails = [
    "long@coderpush.com",
    "harley@coderpush.com",
    "anh@coderpush.com",
    "diep@coderpush.com",
    "chau@coderpush.com",
  ];

  const email = (formData.get("email") as string)?.toLowerCase();
  const supabase = await createClient();

  if (!email) {
    return encodedRedirect("error", "/", "Email is required");
  }

  if (!allowedEmails.includes(email)) {
    return encodedRedirect("error", "/", "This email is not allowed to sign in.");
  }

  const { error } = await supabase.auth.signInWithOtp({ email });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return encodedRedirect(
    "success",
    "/",
    "Check your email for a magic link to sign in."
  );
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
