import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { LogOut, Rocket, Menu, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, dashboardPathForRole, type AppRole } from "@/lib/auth-context";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface Props {
  children: ReactNode;
  nav: NavItem[];
  requireRole: AppRole;
  roleLabel: string;
  activeId: string;
  onSelect: (id: string) => void;
}

export function DashboardShell({ children, nav, requireRole, roleLabel, activeId, onSelect }: Props) {
  const navigate = useNavigate();
  const { user, role, fullName, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (role && role !== requireRole) {
      navigate({ to: dashboardPathForRole(role) });
    }
  }, [loading, user, role, requireRole, navigate]);

  if (loading || !user || role !== requireRole) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground">
        <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const initials = (fullName ?? user.email ?? "U").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  const activeLabel = nav.find((n) => n.id === activeId)?.label ?? "";

  const SidebarContent = (
    <>
      <div className="h-16 flex items-center gap-2 px-6 border-b border-border/40">
        <div className="size-8 rounded-lg btn-gradient grid place-items-center"><Rocket className="size-4" /></div>
        <span className="font-bold">EntreSkill <span className="gradient-text">Hub</span></span>
      </div>
      <div className="px-4 py-5 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full btn-gradient grid place-items-center text-sm font-semibold">{initials}</div>
          <div className="min-w-0">
            <div className="font-medium truncate">{fullName ?? user.email}</div>
            <div className="text-xs text-emerald">{roleLabel}</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {nav.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => { onSelect(item.id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition text-left ${
                active
                  ? "bg-accent text-foreground ring-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <item.icon className="size-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border/40">
        <Button variant="ghost" className="w-full justify-start" onClick={async () => { await signOut(); navigate({ to: "/login" }); }}>
          <LogOut className="size-4 mr-2" /> Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-64 flex-col border-r border-border/40 bg-sidebar/80 backdrop-blur-xl">
        {SidebarContent}
      </aside>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex flex-col bg-sidebar border-r border-border/40">{SidebarContent}</div>
          <div className="flex-1 bg-black/60" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <main className="flex-1 min-w-0">
        <header className="h-16 border-b border-border/40 px-4 md:px-6 flex items-center justify-between backdrop-blur-xl bg-background/40 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-md hover:bg-accent" onClick={() => setMobileOpen(true)}><Menu className="size-5" /></button>
            <Link to="/" className="md:hidden font-semibold text-sm">EntreSkill <span className="gradient-text">Hub</span></Link>
            <div className="hidden md:block text-sm text-muted-foreground">{activeLabel}</div>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <div className="size-8 rounded-full btn-gradient grid place-items-center text-xs font-semibold">{initials}</div>
          </div>
        </header>
        <motion.div key={activeId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="p-4 md:p-8">
          {children}
        </motion.div>
      </main>
    </div>
  );
}

export function StatCard({ label, value, hint, icon: Icon }: { label: string; value: string | number; hint?: string; icon: LucideIcon }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="size-4 text-emerald" />
      </div>
      <div className="text-3xl font-bold mt-3">{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
