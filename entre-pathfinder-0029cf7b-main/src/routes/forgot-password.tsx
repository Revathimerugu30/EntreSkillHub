import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    if (error) toast.error(error.message);
    else toast.success("Check your email for the reset link.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="size-9 rounded-lg btn-gradient grid place-items-center"><Rocket className="size-4" /></div>
          <span className="font-bold text-xl">EntreSkill <span className="gradient-text">Hub</span></span>
        </Link>
        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-bold">Forgot password</h1>
          <p className="text-sm text-muted-foreground mt-1">We'll send you a reset link.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button disabled={submitting} className="w-full btn-gradient border-0 h-11">
              {submitting ? <><Loader2 className="size-4 mr-2 animate-spin" /> Sending…</> : "Send reset link"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <Link to="/login" className="text-muted-foreground hover:text-foreground">Back to sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
