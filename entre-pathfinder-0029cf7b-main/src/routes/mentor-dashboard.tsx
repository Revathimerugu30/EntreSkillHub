import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, Users, Inbox, Calendar, FolderUp, MessageSquare, BarChart3, Bell, Settings, GraduationCap, Upload, Plus, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell, StatCard, SectionHeader } from "@/components/dashboard-shell";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/mentor-dashboard")({
  component: MentorDashboard,
});

const nav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "students", label: "My Students", icon: GraduationCap },
  { id: "requests", label: "Requests", icon: Inbox },
  { id: "sessions", label: "Sessions", icon: Calendar },
  { id: "resources", label: "Resources", icon: FolderUp },
  { id: "upload", label: "Upload Content", icon: Upload },
  { id: "qa", label: "Q&A", icon: MessageSquare },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

interface Resource { id: string; title: string; type: string; url: string; views: number; }
interface Session { id: string; title: string; date: string; link: string; }
interface Request { id: string; name: string; topic: string; status: "pending" | "accepted" | "rejected"; }
interface Question { id: string; from: string; q: string; reply?: string; }

function MentorDashboard() {
  const { fullName } = useAuth();
  const [section, setSection] = useState("dashboard");
  const [students, setStudents] = useState<{ id: string; name: string; progress: number }[]>([]);
  const [requests, setRequests] = useState<Request[]>([
    { id: "r1", name: "Revathi Merugu", topic: "Tailoring boutique launch", status: "pending" },
    { id: "r2", name: "Karthik Rao", topic: "Cloud kitchen pricing", status: "pending" },
  ]);
  const [resources, setResources] = useState<Resource[]>([
    { id: "res1", title: "Pricing your service", type: "PDF", url: "#", views: 124 },
  ]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [questions, setQuestions] = useState<Question[]>([
    { id: "q1", from: "Revathi M.", q: "How do I price custom tailoring?" },
  ]);

  // Load real entrepreneurs from DB as "students"
  useEffect(() => {
    (async () => {
      const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "entrepreneur");
      if (!roles?.length) return;
      const ids = roles.map((r: any) => r.user_id);
      const { data: profs } = await supabase.from("profiles").select("id, full_name").in("id", ids);
      setStudents((profs ?? []).map((p: any) => ({ id: p.id, name: p.full_name ?? "Entrepreneur", progress: Math.floor(Math.random() * 80) + 10 })));
    })();
  }, []);

  // Upload form state
  const [resTitle, setResTitle] = useState("");
  const [resType, setResType] = useState("Article");
  const [resUrl, setResUrl] = useState("");

  const addResource = () => {
    if (!resTitle.trim()) { toast.error("Title required"); return; }
    setResources([{ id: crypto.randomUUID(), title: resTitle, type: resType, url: resUrl || "#", views: 0 }, ...resources]);
    setResTitle(""); setResUrl("");
    toast.success("Resource uploaded");
  };

  const [sessTitle, setSessTitle] = useState("");
  const [sessDate, setSessDate] = useState("");
  const [sessLink, setSessLink] = useState("");
  const addSession = () => {
    if (!sessTitle.trim() || !sessDate) { toast.error("Title and date required"); return; }
    setSessions([{ id: crypto.randomUUID(), title: sessTitle, date: sessDate, link: sessLink }, ...sessions]);
    setSessTitle(""); setSessDate(""); setSessLink("");
    toast.success("Session created");
  };

  const handleRequest = (id: string, status: "accepted" | "rejected") => {
    setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
    toast.success(`Request ${status}`);
  };

  const pending = requests.filter(r => r.status === "pending").length;
  const totalViews = resources.reduce((s, r) => s + r.views, 0);

  return (
    <DashboardShell nav={nav} requireRole="mentor" roleLabel="Mentor" activeId={section} onSelect={setSection}>
      {section === "dashboard" && (
        <div className="space-y-8">
          <SectionHeader title={`Hi ${fullName?.split(" ")[0] ?? "mentor"} — your impact starts here`} subtitle="Manage students, requests, and resources from one place." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Active students" value={students.length} icon={Users} />
            <StatCard label="Pending requests" value={pending} icon={Inbox} />
            <StatCard label="Upcoming sessions" value={sessions.length} icon={Calendar} />
            <StatCard label="Resources shared" value={resources.length} icon={FolderUp} />
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-semibold">Recent requests</h2>
              {requests.slice(0, 3).map(r => (
                <div key={r.id} className="flex justify-between items-center mt-3 text-sm">
                  <span>{r.name} — {r.topic}</span>
                  <span className="text-xs text-emerald capitalize">{r.status}</span>
                </div>
              ))}
              <Button size="sm" variant="outline" className="bg-transparent mt-4" onClick={() => setSection("requests")}>View all</Button>
            </div>
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-semibold">Quick actions</h2>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button onClick={() => setSection("upload")} className="btn-gradient border-0"><Upload className="size-4 mr-2" /> Upload</Button>
                <Button onClick={() => setSection("sessions")} variant="outline" className="bg-transparent"><Calendar className="size-4 mr-2" /> Schedule</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {section === "students" && (
        <div className="space-y-6">
          <SectionHeader title="My Students" subtitle={`${students.length} entrepreneurs on the platform`} />
          {students.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center text-muted-foreground">No students yet.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map(s => (
                <div key={s.id} className="glass rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full btn-gradient grid place-items-center text-sm font-semibold">{s.name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase()}</div>
                    <div className="font-medium">{s.name}</div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1"><span>Progress</span><span>{s.progress}%</span></div>
                    <Progress value={s.progress} />
                  </div>
                  <Button size="sm" variant="outline" className="bg-transparent mt-4 w-full" onClick={() => toast.success(`Opening ${s.name}'s profile`)}>View</Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {section === "requests" && (
        <div className="space-y-4">
          <SectionHeader title="Mentorship requests" />
          {requests.map(r => (
            <div key={r.id} className="glass rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-medium">{r.name}</div>
                <div className="text-sm text-muted-foreground">{r.topic}</div>
                <div className="text-xs text-emerald capitalize mt-1">{r.status}</div>
              </div>
              {r.status === "pending" && (
                <div className="flex gap-2">
                  <Button size="sm" className="btn-gradient border-0" onClick={() => handleRequest(r.id, "accepted")}><CheckCircle2 className="size-4 mr-1" /> Accept</Button>
                  <Button size="sm" variant="outline" className="bg-transparent" onClick={() => handleRequest(r.id, "rejected")}><XCircle className="size-4 mr-1" /> Reject</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {section === "sessions" && (
        <div className="space-y-6">
          <SectionHeader title="Sessions" subtitle="Schedule mentorship calls." />
          <div className="glass rounded-2xl p-6 grid sm:grid-cols-4 gap-2">
            <Input placeholder="Title" value={sessTitle} onChange={e => setSessTitle(e.target.value)} />
            <Input type="datetime-local" value={sessDate} onChange={e => setSessDate(e.target.value)} />
            <Input placeholder="Meeting link" value={sessLink} onChange={e => setSessLink(e.target.value)} />
            <Button onClick={addSession} className="btn-gradient border-0"><Plus className="size-4 mr-1" /> Add</Button>
          </div>
          {sessions.length === 0 ? <div className="glass rounded-2xl p-8 text-center text-muted-foreground">No sessions scheduled.</div> : (
            <div className="space-y-2">
              {sessions.map(s => (
                <div key={s.id} className="glass rounded-xl p-4 flex justify-between items-center">
                  <div><div className="font-medium">{s.title}</div><div className="text-xs text-muted-foreground">{new Date(s.date).toLocaleString()}</div></div>
                  <Button size="sm" variant="ghost" onClick={() => { setSessions(sessions.filter(x => x.id !== s.id)); toast.success("Deleted"); }}><Trash2 className="size-4" /></Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {section === "resources" && (
        <div className="space-y-6">
          <SectionHeader title="Resources" subtitle="Content you've shared." action={<Button className="btn-gradient border-0" onClick={() => setSection("upload")}><Plus className="size-4 mr-1" /> Add</Button>} />
          <div className="grid sm:grid-cols-2 gap-4">
            {resources.map(r => (
              <div key={r.id} className="glass rounded-2xl p-5">
                <div className="text-xs text-emerald uppercase">{r.type}</div>
                <div className="font-medium mt-1">{r.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{r.views} views</div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="bg-transparent" onClick={() => toast.success("Edit form opened")}>Edit</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setResources(resources.filter(x => x.id !== r.id)); toast.success("Deleted"); }}><Trash2 className="size-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {section === "upload" && (
        <div className="space-y-6">
          <SectionHeader title="Upload content" subtitle="PDFs, videos, articles, websites, startup guides." />
          <div className="glass rounded-2xl p-6 space-y-4 max-w-2xl">
            <div><label className="text-sm">Title</label><Input value={resTitle} onChange={e => setResTitle(e.target.value)} /></div>
            <div><label className="text-sm">Type</label>
              <select value={resType} onChange={e => setResType(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
                {["Article", "Video", "PDF", "Website", "Startup guide"].map(t => <option key={t} className="bg-background">{t}</option>)}
              </select>
            </div>
            <div><label className="text-sm">URL or content</label><Input value={resUrl} onChange={e => setResUrl(e.target.value)} placeholder="https://…" /></div>
            <Button onClick={addResource} className="btn-gradient border-0"><Upload className="size-4 mr-1" /> Publish</Button>
          </div>
        </div>
      )}

      {section === "qa" && (
        <div className="space-y-4">
          <SectionHeader title="Q&A Support" />
          {questions.map(q => (
            <div key={q.id} className="glass rounded-2xl p-5">
              <div className="font-medium">{q.from}</div>
              <div className="text-sm text-muted-foreground mt-1">{q.q}</div>
              <Textarea className="mt-3" placeholder="Type your reply…" value={q.reply ?? ""} onChange={e => setQuestions(questions.map(x => x.id === q.id ? { ...x, reply: e.target.value } : x))} />
              <Button size="sm" className="btn-gradient border-0 mt-3" onClick={() => toast.success("Reply sent")}>Send reply</Button>
            </div>
          ))}
        </div>
      )}

      {section === "analytics" && (
        <div className="space-y-6">
          <SectionHeader title="Analytics" />
          <div className="grid sm:grid-cols-3 gap-4">
            <StatCard label="Resource views" value={totalViews} icon={BarChart3} />
            <StatCard label="Engagement" value="78%" icon={Users} />
            <StatCard label="Attendance" value="92%" icon={Calendar} />
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Top resources</h3>
            <div className="space-y-3">
              {resources.map(r => (
                <div key={r.id}>
                  <div className="flex justify-between text-sm mb-1"><span>{r.title}</span><span>{r.views}</span></div>
                  <Progress value={Math.min(100, r.views)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section === "notifications" && (
        <div className="space-y-3">
          <SectionHeader title="Notifications" />
          {[`${pending} pending requests`, "Session reminder: tomorrow 4 PM", "Admin: new policy update"].map((n, i) => (
            <div key={i} className="glass rounded-xl p-4 text-sm">{n}</div>
          ))}
        </div>
      )}

      {section === "settings" && (
        <div className="space-y-6">
          <SectionHeader title="Settings" />
          <div className="glass rounded-2xl p-6 space-y-4 max-w-xl">
            <div><label className="text-sm">Display name</label><Input defaultValue={fullName ?? ""} /></div>
            <div><label className="text-sm">Bio</label><Textarea placeholder="Tell entrepreneurs about your expertise" /></div>
            <Button className="btn-gradient border-0" onClick={() => toast.success("Profile saved")}>Save changes</Button>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
