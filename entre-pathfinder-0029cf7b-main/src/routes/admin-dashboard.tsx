import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, Users, ShieldCheck, Inbox, FolderTree, BookCopy, FileText, Flag, BarChart3, Bell, Settings, Activity, CheckCircle2, XCircle, Trash2, Plus, Search, Send, ExternalLink, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell, StatCard, SectionHeader } from "@/components/dashboard-shell";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { contentStore, mentorStore, useStore, type ContentType, type ResourceKind } from "@/lib/shared-store";

export const Route = createFileRoute("/admin-dashboard")({
  component: AdminDashboard,
});

const nav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "mentors", label: "Mentors", icon: ShieldCheck },
  { id: "verification", label: "Verification Requests", icon: Inbox },
  { id: "resources", label: "Resources", icon: FolderTree },
  { id: "roadmaps", label: "Roadmaps", icon: BookCopy },
  { id: "content", label: "Content", icon: FileText },
  { id: "reports", label: "Reports", icon: Flag },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

interface UserRow { id: string; name: string; email?: string; role: string; bio?: string; avatar_url?: string; created_at?: string; blocked: boolean; }
interface Verification { id: string; name: string; expertise: string; status: "pending" | "approved" | "rejected"; }
interface Roadmap { id: string; title: string; category: string; steps: number; }
interface Report { id: string; subject: string; reporter: string; status: "open" | "resolved"; }

const SKILL_OPTIONS = [
  "tailoring","embroidery","handicrafts","jewelry","mehendi",
  "cooking","baking","pickles","tiffin",
  "design","video","web","social","photo",
  "tutoring","garden","beauty","yoga","electronics","carpentry","general",
];

function AdminDashboard() {
  const { fullName } = useAuth();
  const [section, setSection] = useState("dashboard");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");
  const [viewUser, setViewUser] = useState<UserRow | null>(null);
  const [contentDialogType, setContentDialogType] = useState<ContentType | null>(null);

  const content = useStore(() => contentStore.list());
  const mentors = useStore(() => mentorStore.list());

  const [verifications, setVerifications] = useState<Verification[]>([
    { id: "v1", name: "Arun Kumar", expertise: "Tailoring & Boutique", status: "pending" },
    { id: "v2", name: "Priya Shah", expertise: "Food & Catering", status: "pending" },
  ]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([
    { id: "rd1", title: "Boutique launch", category: "Tailoring", steps: 6 },
    { id: "rd2", title: "Cloud kitchen", category: "Food", steps: 7 },
  ]);
  const [reports, setReports] = useState<Report[]>([
    { id: "rp1", subject: "Spam resource", reporter: "Revathi M.", status: "open" },
  ]);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    (async () => {
      const [{ data: rolesData }, { data: profs }] = await Promise.all([
        supabase.from("user_roles").select("user_id, role, created_at"),
        supabase.from("profiles").select("id, full_name, bio, avatar_url, created_at"),
      ]);
      const profMap = new Map((profs ?? []).map((p: any) => [p.id, p]));
      const rows: UserRow[] = (rolesData ?? []).map((r: any) => {
        const p: any = profMap.get(r.user_id) ?? {};
        return {
          id: r.user_id,
          name: p.full_name ?? "User",
          role: r.role,
          bio: p.bio,
          avatar_url: p.avatar_url,
          created_at: p.created_at ?? r.created_at,
          blocked: false,
        };
      });
      setUsers(rows);
    })();
  }, []);

  const totalUsers = users.length;
  const mentorUsers = users.filter(u => u.role === "mentor").length;
  const entrepreneurs = users.filter(u => u.role === "entrepreneur").length;
  const admins = users.filter(u => u.role === "admin").length;
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.role.includes(search.toLowerCase()));

  const toggleBlock = (id: string) => { setUsers(users.map(u => u.id === id ? { ...u, blocked: !u.blocked } : u)); toast.success("Updated"); };
  const removeUser = (id: string) => { setUsers(users.filter(u => u.id !== id)); toast.success("User removed (local)"); };

  const handleVerify = (id: string, status: "approved" | "rejected") => {
    setVerifications(verifications.map(v => v.id === id ? { ...v, status } : v));
    toast.success(`Mentor ${status}`);
  };

  const [rmTitle, setRmTitle] = useState("");
  const [rmCat, setRmCat] = useState("");
  const addRoadmap = () => {
    if (!rmTitle.trim()) { toast.error("Title required"); return; }
    setRoadmaps([{ id: crypto.randomUUID(), title: rmTitle, category: rmCat || "General", steps: 6 }, ...roadmaps]);
    setRmTitle(""); setRmCat("");
    toast.success("Roadmap added");
  };

  // Add mentor form
  const [mName, setMName] = useState("");
  const [mExp, setMExp] = useState("");
  const [mSkills, setMSkills] = useState("");
  const [mRating, setMRating] = useState("4.8");
  const [mYears, setMYears] = useState("10");
  const [mBio, setMBio] = useState("");
  const [mEmail, setMEmail] = useState("");
  const addMentor = () => {
    if (!mName.trim() || !mExp.trim()) { toast.error("Name and expertise required"); return; }
    mentorStore.add({
      name: mName, expertise: mExp,
      skills: mSkills.split(",").map(s => s.trim()).filter(Boolean),
      rating: parseFloat(mRating) || 4.5,
      years: parseInt(mYears) || 10,
      bio: mBio, email: mEmail,
    });
    setMName(""); setMExp(""); setMSkills(""); setMBio(""); setMEmail(""); setMYears("10");
    toast.success("Mentor added — visible to entrepreneurs");
  };

  return (
    <DashboardShell nav={nav} requireRole="admin" roleLabel="Administrator" activeId={section} onSelect={setSection}>
      {section === "dashboard" && (
        <div className="space-y-8">
          <SectionHeader title={`Admin overview, ${fullName?.split(" ")[0] ?? "admin"}`} subtitle="Platform-wide health and activity." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total users" value={totalUsers} icon={Users} />
            <StatCard label="Entrepreneurs" value={entrepreneurs} icon={Activity} />
            <StatCard label="Mentors" value={mentors.length} icon={ShieldCheck} />
            <StatCard label="Resources" value={content.length} icon={FolderTree} />
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-semibold">Pending verifications</h2>
              <div className="text-3xl font-bold mt-2">{verifications.filter(v => v.status === "pending").length}</div>
              <Button size="sm" className="btn-gradient border-0 mt-3" onClick={() => setSection("verification")}>Review</Button>
            </div>
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-semibold">Open reports</h2>
              <div className="text-3xl font-bold mt-2">{reports.filter(r => r.status === "open").length}</div>
              <Button size="sm" variant="outline" className="bg-transparent mt-3" onClick={() => setSection("reports")}>Handle</Button>
            </div>
          </div>
        </div>
      )}

      {section === "users" && (
        <div className="space-y-4">
          <SectionHeader title="User management" subtitle={`${totalUsers} users on the platform`} />
          <div className="glass rounded-2xl p-4 flex items-center gap-2">
            <Search className="size-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or role…" className="border-0 bg-transparent focus-visible:ring-0" />
          </div>
          <div className="glass rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground border-b border-border/40">
                <tr><th className="p-4">Name</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="border-b border-border/20 last:border-0">
                    <td className="p-4 font-medium">{u.name}</td>
                    <td className="p-4 capitalize text-emerald">{u.role}</td>
                    <td className="p-4">{u.blocked ? <span className="text-destructive">Blocked</span> : <span>Active</span>}</td>
                    <td className="p-4 text-right space-x-2">
                      <Button size="sm" variant="outline" className="bg-transparent" onClick={() => setViewUser(u)}>View</Button>
                      <Button size="sm" variant="outline" className="bg-transparent" onClick={() => toggleBlock(u.id)}>{u.blocked ? "Unblock" : "Block"}</Button>
                      <Button size="sm" variant="ghost" onClick={() => removeUser(u.id)}><Trash2 className="size-4" /></Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No users.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {section === "mentors" && (
        <div className="space-y-6">
          <SectionHeader title="Mentors" subtitle={`${mentors.length} mentors visible to entrepreneurs`} />

          <div className="glass rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 font-semibold"><UserPlus className="size-4" /> Add a mentor</div>
            <div className="grid sm:grid-cols-2 gap-2">
              <Input placeholder="Full name" value={mName} onChange={e => setMName(e.target.value)} />
              <Input placeholder="Expertise (e.g. Tailoring & Boutique)" value={mExp} onChange={e => setMExp(e.target.value)} />
              <Input placeholder="Years of experience (e.g. 12)" value={mYears} onChange={e => setMYears(e.target.value)} />
              <Input placeholder="Skill IDs comma-separated (tailoring, baking…)" value={mSkills} onChange={e => setMSkills(e.target.value)} />
              <Input placeholder="Rating (e.g. 4.8)" value={mRating} onChange={e => setMRating(e.target.value)} />
              <Input placeholder="Email" value={mEmail} onChange={e => setMEmail(e.target.value)} />
              <Input placeholder="Short bio" value={mBio} onChange={e => setMBio(e.target.value)} />
            </div>
            <div className="text-xs text-muted-foreground">Skill IDs: {SKILL_OPTIONS.join(", ")}</div>
            <Button onClick={addMentor} className="btn-gradient border-0"><Plus className="size-4 mr-1" /> Add mentor</Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mentors.map(m => (
              <div key={m.id} className="glass rounded-2xl p-5">
                <div className="size-10 rounded-full btn-gradient grid place-items-center text-sm font-semibold">{m.name.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}</div>
                <div className="font-medium mt-3">{m.name}</div>
                <div className="text-xs text-emerald">{m.expertise} • ⭐ {m.rating}</div>
                {m.bio && <div className="text-xs text-muted-foreground mt-2">{m.bio}</div>}
                <div className="flex flex-wrap gap-1 mt-2">{m.skills.map(s => <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-accent/40">{s}</span>)}</div>
                <Button size="sm" variant="ghost" className="mt-3 text-destructive" onClick={() => { mentorStore.remove(m.id); toast.success("Mentor removed"); }}><Trash2 className="size-4 mr-1" /> Remove</Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {section === "verification" && (
        <div className="space-y-4">
          <SectionHeader title="Mentor verification requests" />
          {verifications.map(v => (
            <div key={v.id} className="glass rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-medium">{v.name}</div>
                <div className="text-sm text-muted-foreground">{v.expertise}</div>
                <div className="text-xs text-emerald capitalize mt-1">{v.status}</div>
              </div>
              {v.status === "pending" && (
                <div className="flex gap-2">
                  <Button size="sm" className="btn-gradient border-0" onClick={() => handleVerify(v.id, "approved")}><CheckCircle2 className="size-4 mr-1" /> Approve</Button>
                  <Button size="sm" variant="outline" className="bg-transparent" onClick={() => handleVerify(v.id, "rejected")}><XCircle className="size-4 mr-1" /> Reject</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {section === "resources" && (
        <div className="space-y-4">
          <SectionHeader title="All resources" subtitle="Everything visible to entrepreneurs in the Learning Center." />
          {content.map(r => (
            <div key={r.id} className="glass rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs text-emerald uppercase">{r.type} • {r.kind} • {r.skill}</div>
                <div className="font-medium truncate">{r.title}</div>
                <a href={r.url} target="_blank" rel="noreferrer" className="text-xs text-primary inline-flex items-center gap-1 truncate"><ExternalLink className="size-3" /> {r.url}</a>
              </div>
              <Button size="sm" variant="ghost" onClick={() => { contentStore.remove(r.id); toast.success("Removed"); }}><Trash2 className="size-4" /></Button>
            </div>
          ))}
        </div>
      )}

      {section === "roadmaps" && (
        <div className="space-y-6">
          <SectionHeader title="Roadmaps" subtitle="Manage startup roadmaps and categories." />
          <div className="glass rounded-2xl p-6 grid sm:grid-cols-3 gap-2">
            <Input placeholder="Title" value={rmTitle} onChange={e => setRmTitle(e.target.value)} />
            <Input placeholder="Category" value={rmCat} onChange={e => setRmCat(e.target.value)} />
            <Button onClick={addRoadmap} className="btn-gradient border-0"><Plus className="size-4 mr-1" /> Add</Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roadmaps.map(r => (
              <div key={r.id} className="glass rounded-2xl p-5">
                <div className="text-xs text-emerald uppercase">{r.category}</div>
                <div className="font-medium mt-1">{r.title}</div>
                <div className="text-xs text-muted-foreground">{r.steps} steps</div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="ghost" onClick={() => { setRoadmaps(roadmaps.filter(x => x.id !== r.id)); toast.success("Deleted"); }}><Trash2 className="size-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {section === "content" && (
        <div className="space-y-6">
          <SectionHeader title="Content management" subtitle="Add real tutorial links — they appear in the user's Learning Center." />
          <div className="grid sm:grid-cols-2 gap-4">
            {(["Tutorial", "Learning module", "Featured", "Category"] as ContentType[]).map(c => {
              const count = content.filter(x => x.type === c).length;
              return (
                <div key={c} className="glass rounded-2xl p-6">
                  <div className="font-medium">{c}s</div>
                  <div className="text-xs text-muted-foreground mt-1">{count} item{count === 1 ? "" : "s"}</div>
                  <Button size="sm" variant="outline" className="bg-transparent mt-3" onClick={() => setContentDialogType(c)}>Manage</Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {section === "reports" && (
        <div className="space-y-4">
          <SectionHeader title="Reports & feedback" />
          {reports.map(r => (
            <div key={r.id} className="glass rounded-2xl p-5 flex justify-between items-center">
              <div>
                <div className="font-medium">{r.subject}</div>
                <div className="text-sm text-muted-foreground">Reported by {r.reporter}</div>
                <div className="text-xs text-emerald capitalize mt-1">{r.status}</div>
              </div>
              {r.status === "open" && <Button size="sm" className="btn-gradient border-0" onClick={() => { setReports(reports.map(x => x.id === r.id ? { ...x, status: "resolved" } : x)); toast.success("Resolved"); }}>Resolve</Button>}
            </div>
          ))}
        </div>
      )}

      {section === "analytics" && (
        <div className="space-y-6">
          <SectionHeader title="Analytics" />
          <div className="grid sm:grid-cols-4 gap-4">
            <StatCard label="Users" value={totalUsers} icon={Users} />
            <StatCard label="Mentors" value={mentors.length} icon={ShieldCheck} />
            <StatCard label="Resources" value={content.length} icon={FolderTree} />
            <StatCard label="Roadmaps" value={roadmaps.length} icon={BookCopy} />
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Role breakdown</h3>
            <div className="space-y-3">
              {[
                { l: "Entrepreneurs", v: entrepreneurs },
                { l: "Mentors", v: mentorUsers },
                { l: "Admins", v: admins },
              ].map(b => {
                const pct = totalUsers ? Math.round((b.v / totalUsers) * 100) : 0;
                return (
                  <div key={b.l}>
                    <div className="flex justify-between text-sm mb-1"><span>{b.l}</span><span>{b.v} ({pct}%)</span></div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full btn-gradient" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {section === "notifications" && (
        <div className="space-y-6">
          <SectionHeader title="Send announcement" subtitle="Broadcast to all users." />
          <div className="glass rounded-2xl p-6 space-y-3 max-w-2xl">
            <Textarea placeholder="Write your announcement…" value={announcement} onChange={e => setAnnouncement(e.target.value)} />
            <Button className="btn-gradient border-0" onClick={() => { if (!announcement.trim()) return toast.error("Empty"); toast.success("Announcement sent"); setAnnouncement(""); }}><Send className="size-4 mr-1" /> Send</Button>
          </div>
        </div>
      )}

      {section === "settings" && (
        <div className="space-y-6">
          <SectionHeader title="Platform settings" />
          <div className="glass rounded-2xl p-6 space-y-4 max-w-xl">
            <div><label className="text-sm">Platform name</label><Input defaultValue="EntreSkill Hub" /></div>
            <div><label className="text-sm">Support email</label><Input defaultValue="support@entreskillhub.com" /></div>
            <Button className="btn-gradient border-0" onClick={() => toast.success("Settings saved")}>Save</Button>
          </div>
        </div>
      )}

      {/* User detail dialog */}
      <Dialog open={!!viewUser} onOpenChange={(o) => !o && setViewUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User profile</DialogTitle>
            <DialogDescription>Account details from the platform.</DialogDescription>
          </DialogHeader>
          {viewUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-14 rounded-full btn-gradient grid place-items-center font-semibold">{viewUser.name.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}</div>
                <div>
                  <div className="font-semibold text-lg">{viewUser.name}</div>
                  <div className="text-xs text-emerald capitalize">{viewUser.role}</div>
                </div>
              </div>
              <dl className="text-sm space-y-2">
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">User ID</dt><dd className="font-mono text-xs truncate">{viewUser.id}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Status</dt><dd>{viewUser.blocked ? "Blocked" : "Active"}</dd></div>
                {viewUser.created_at && <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Joined</dt><dd>{new Date(viewUser.created_at).toLocaleDateString()}</dd></div>}
                {viewUser.bio && <div><dt className="text-muted-foreground">Bio</dt><dd className="mt-1">{viewUser.bio}</dd></div>}
              </dl>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" className="bg-transparent" onClick={() => setViewUser(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content management dialog */}
      <ContentDialog type={contentDialogType} onClose={() => setContentDialogType(null)} items={content} />
    </DashboardShell>
  );
}

function ContentDialog({ type, onClose, items }: { type: ContentType | null; onClose: () => void; items: ReturnType<typeof contentStore.list> }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [skill, setSkill] = useState("general");
  const [kind, setKind] = useState<ResourceKind>("Video");

  if (!type) return null;
  const filtered = items.filter(i => i.type === type);

  const save = () => {
    if (!title.trim() || !url.trim()) { toast.error("Title and link required"); return; }
    contentStore.add({ type, title, url, kind, skill });
    setTitle(""); setUrl("");
    toast.success("Saved — visible to users");
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage {type}s</DialogTitle>
          <DialogDescription>Add real links — they reflect on the user's Learning Center filtered by their skills.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 border-b border-border/40 pb-4">
          <Input placeholder="Title (e.g. Beginner Tailoring Course)" value={title} onChange={e => setTitle(e.target.value)} />
          <Input placeholder="https://… (YouTube, article, PDF)" value={url} onChange={e => setUrl(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <select value={skill} onChange={e => setSkill(e.target.value)} className="flex h-9 rounded-md border border-input bg-transparent px-3 text-sm">
              {SKILL_OPTIONS.map(s => <option key={s} className="bg-background">{s}</option>)}
            </select>
            <select value={kind} onChange={e => setKind(e.target.value as ResourceKind)} className="flex h-9 rounded-md border border-input bg-transparent px-3 text-sm">
              {(["Video", "Article", "PDF", "Checklist"] as ResourceKind[]).map(k => <option key={k} className="bg-background">{k}</option>)}
            </select>
          </div>
          <Button onClick={save} className="btn-gradient border-0 w-full"><Plus className="size-4 mr-1" /> Save & publish</Button>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Existing {type}s ({filtered.length})</div>
          {filtered.length === 0 && <div className="text-sm text-muted-foreground">None yet.</div>}
          {filtered.map(i => (
            <div key={i.id} className="rounded-lg border border-border/40 p-3 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs text-emerald uppercase">{i.kind} • {i.skill}</div>
                <div className="font-medium text-sm truncate">{i.title}</div>
                <a href={i.url} target="_blank" rel="noreferrer" className="text-xs text-primary inline-flex items-center gap-1 truncate"><ExternalLink className="size-3" /> {i.url}</a>
              </div>
              <Button size="sm" variant="ghost" onClick={() => { contentStore.remove(i.id); toast.success("Removed"); }}><Trash2 className="size-4" /></Button>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" className="bg-transparent" onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
