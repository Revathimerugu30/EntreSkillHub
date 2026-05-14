import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Rocket, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { dashboardPathForRole, type AppRole } from "@/lib/auth-context";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AppRole>("entrepreneur");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim(), role },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created — welcome!");
    navigate({ to: dashboardPathForRole(role) });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="size-9 rounded-lg btn-gradient grid place-items-center"><Rocket className="size-4" /></div>
          <span className="font-bold text-xl">EntreSkill <span className="gradient-text">Hub</span></span>
        </Link>
        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">Start building your micro-business today.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>I am a…</Label>
              <RadioGroup value={role} onValueChange={(v) => setRole(v as AppRole)} className="grid grid-cols-3 gap-2">
                <label className="glass rounded-lg p-3 flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="entrepreneur" /> Entrepreneur
                </label>
                <label className="glass rounded-lg p-3 flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="mentor" /> Mentor
                </label>
                <label className="glass rounded-lg p-3 flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="admin" /> Admin
                </label>
              </RadioGroup>
            </div>

            <Button type="submit" disabled={submitting} className="w-full btn-gradient border-0 h-11">
              {submitting ? <><Loader2 className="size-4 mr-2 animate-spin" /> Creating…</> : "Create account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-foreground font-medium hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
