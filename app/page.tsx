import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default async function Home(props: { searchParams: Promise<Message> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect('/dashboard');
  }
  const searchParams = await props.searchParams;
  return (
    <>
      <main className="flex flex-1 min-h-[80vh] items-center justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle>Sign in with Magic Link</CardTitle>
            <CardDescription>
              Enter your email and we'll send you a magic link to sign in to the Finance Dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input name="email" type="email" placeholder="you@example.com" required />
              </div>
              <SubmitButton pendingText="Sending Magic Link..." formAction={signInAction}>
                Send Magic Link
              </SubmitButton>
              <FormMessage message={searchParams} />
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
