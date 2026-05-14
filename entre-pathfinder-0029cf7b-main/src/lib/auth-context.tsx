import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "entrepreneur" | "mentor" | "admin";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  role: AppRole | null;
  fullName: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function fetchRoleAndProfile(userId: string): Promise<{ role: AppRole | null; fullName: string | null }> {
  const [{ data: roleRow }, { data: profile }] = await Promise.all([
    supabase.rpc("get_primary_role", { _user_id: userId }),
    supabase.from("profiles").select("full_name").eq("id", userId).maybeSingle(),
  ]);
  return {
    role: (roleRow as AppRole | null) ?? "entrepreneur",
    fullName: profile?.full_name ?? null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Set up listener FIRST
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        // Defer to avoid deadlock
        setTimeout(() => {
          if (!mounted) return;
          fetchRoleAndProfile(newSession.user.id).then(({ role, fullName }) => {
            if (!mounted) return;
            setRole(role);
            setFullName(fullName);
          });
        }, 0);
      } else {
        setRole(null);
        setFullName(null);
      }
    });

    // THEN check existing session
    supabase.auth.getSession().then(async ({ data: { session: existing } }) => {
      if (!mounted) return;
      setSession(existing);
      setUser(existing?.user ?? null);
      if (existing?.user) {
        const info = await fetchRoleAndProfile(existing.user.id);
        if (!mounted) return;
        setRole(info.role);
        setFullName(info.fullName);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (!user) return;
    const info = await fetchRoleAndProfile(user.id);
    setRole(info.role);
    setFullName(info.fullName);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setRole(null);
    setFullName(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, role, fullName, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function dashboardPathForRole(role: AppRole | null): string {
  switch (role) {
    case "admin": return "/admin-dashboard";
    case "mentor": return "/mentor-dashboard";
    default: return "/entrepreneur-dashboard";
  }
}
