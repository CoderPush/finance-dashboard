import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const hash = requestUrl.searchParams.get("token_hash");
  const origin = requestUrl.origin;

  const supabase = await createClient();

  if (!hash) {
    return NextResponse.redirect(`${origin}/?error=${encodeURIComponent("Missing magic link hash.")}`);
  }

  const { error } = await supabase.auth.verifyOtp({
    token_hash: hash,
    type: "email",
  });
  if (error) {
    return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(error.message)}`);
  }


  return NextResponse.redirect(`${origin}`);
}
