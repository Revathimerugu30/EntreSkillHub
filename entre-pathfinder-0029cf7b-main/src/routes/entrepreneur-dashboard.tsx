import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Sparkles, BookOpen, Users, Bookmark, BarChart3, Bell, Settings,
  Compass, Lightbulb, ArrowLeft, ArrowRight, Star, CheckCircle2, Circle, Clock, Wallet, TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardShell, StatCard, SectionHeader } from "@/components/dashboard-shell";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { contentStore, mentorStore, useStore } from "@/lib/shared-store";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/entrepreneur-dashboard")({
  component: EntrepreneurDashboard,
});

const nav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "ideas", label: "Business Ideas", icon: Lightbulb },
  { id: "roadmaps", label: "Roadmaps", icon: Compass },
  { id: "learning", label: "Learning Center", icon: BookOpen },
  { id: "mentors", label: "Mentors", icon: Users },
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
  { id: "progress", label: "Progress", icon: BarChart3 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

// ---------- Skills catalog ----------
type Skill = { id: string; label: string; emoji: string };
type SkillGroup = { title: string; skills: Skill[] };

const SKILL_GROUPS: SkillGroup[] = [
  { title: "Crafts & Making", skills: [
    { id: "tailoring", label: "Tailoring & Stitching", emoji: "🧵" },
    { id: "embroidery", label: "Embroidery", emoji: "🪡" },
    { id: "handicrafts", label: "Handicrafts", emoji: "🎨" },
    { id: "jewelry", label: "Jewelry Making", emoji: "💍" },
    { id: "mehendi", label: "Mehendi Art", emoji: "🌿" },
  ]},
  { title: "Food & Cooking", skills: [
    { id: "cooking", label: "Cooking", emoji: "🍲" },
    { id: "baking", label: "Baking", emoji: "🧁" },
    { id: "pickles", label: "Pickles & Preserves", emoji: "🥫" },
    { id: "tiffin", label: "Tiffin Service", emoji: "🍱" },
  ]},
  { title: "Digital & Tech", skills: [
    { id: "design", label: "Graphic Design", emoji: "🎨" },
    { id: "video", label: "Video Editing", emoji: "🎬" },
    { id: "web", label: "Web Development", emoji: "💻" },
    { id: "social", label: "Social Media", emoji: "📱" },
    { id: "photo", label: "Photography", emoji: "📷" },
  ]},
  { title: "Services & Education", skills: [
    { id: "tutoring", label: "Tutoring", emoji: "📚" },
    { id: "garden", label: "Gardening & Plants", emoji: "🌱" },
  ]},
  { title: "Wellness & Beauty", skills: [
    { id: "beauty", label: "Beauty & Salon", emoji: "💄" },
    { id: "yoga", label: "Yoga & Fitness", emoji: "🧘" },
  ]},
  { title: "Trades & Repair", skills: [
    { id: "electronics", label: "Electronics Repair", emoji: "🔧" },
    { id: "carpentry", label: "Carpentry", emoji: "🪚" },
  ]},
];

const SKILL_BY_ID: Record<string, Skill> = Object.fromEntries(
  SKILL_GROUPS.flatMap((g) => g.skills).map((s) => [s.id, s])
);

// ---------- Business ideas ----------
type Idea = {
  id: string;
  emoji: string;
  title: string;
  tagline: string;
  about: string;
  customers: string;
  skills: string[];
  investment: string;
  monthly: string;
  time: string;
  difficulty: 1 | 2 | 3;
  tools: string[];
};

const IDEAS: Idea[] = [
  { id: "boutique", emoji: "👗", title: "Home Boutique", tagline: "Custom stitching & designer wear from home",
    about: "Offer custom-stitched ethnic and casual wear from your home. Build a loyal local clientele through Instagram and word of mouth.",
    customers: "Working women, college students, bridal parties",
    skills: ["tailoring", "embroidery"], investment: "₹15,000 – ₹40,000", monthly: "₹20,000 – ₹60,000",
    time: "2–4 weeks", difficulty: 1,
    tools: ["Sewing machine", "Measuring tape & scissors", "Fabrics & threads"] },
  { id: "carpentry", emoji: "🪑", title: "Custom Furniture Workshop", tagline: "Made-to-order wooden pieces",
    about: "Build bespoke furniture for homes and offices. Differentiate with quality finishes and custom sizing.",
    customers: "Homeowners, interior designers, cafes",
    skills: ["carpentry", "handicrafts"], investment: "₹1,00,000 – ₹3,00,000", monthly: "₹50,000 – ₹2,00,000",
    time: "8–12 weeks", difficulty: 3,
    tools: ["Power tools (saw, drill, sander)", "Workshop space", "Wood & hardware stock"] },
  { id: "nursery", emoji: "🪴", title: "Plant Nursery & Decor", tagline: "Sell indoor plants & planters",
    about: "Sell indoor plants, succulents and decorative planters through Instagram and weekend markets.",
    customers: "Urban homeowners, offices",
    skills: ["garden", "handicrafts"], investment: "₹20,000 – ₹60,000", monthly: "₹15,000 – ₹50,000",
    time: "3–5 weeks", difficulty: 1,
    tools: ["Pots & planters", "Soil, fertilizer, seeds", "Watering & pruning tools"] },
  { id: "tiffin", emoji: "🍱", title: "Home Tiffin Service", tagline: "Daily home-cooked meals",
    about: "Deliver fresh home-cooked tiffins to working professionals and students in your locality.",
    customers: "Bachelors, working professionals, students",
    skills: ["cooking", "tiffin"], investment: "₹10,000 – ₹30,000", monthly: "₹25,000 – ₹80,000",
    time: "2–3 weeks", difficulty: 1,
    tools: ["Kitchen upgrade", "Tiffin boxes", "Delivery setup"] },
  { id: "bakery", emoji: "🧁", title: "Cloud Bakery", tagline: "Custom cakes & desserts on order",
    about: "Take online orders for birthday cakes, cupcakes and desserts. Run from a home kitchen.",
    customers: "Families, corporate offices, event planners",
    skills: ["baking", "cooking"], investment: "₹25,000 – ₹70,000", monthly: "₹20,000 – ₹70,000",
    time: "3–5 weeks", difficulty: 2,
    tools: ["OTG / convection oven", "Baking moulds & tools", "Packaging supplies"] },
  { id: "freelance-design", emoji: "🎨", title: "Freelance Design Studio", tagline: "Logos, brands & social creatives",
    about: "Sell design services to small businesses, creators and startups. Scale with productized packages.",
    customers: "Small businesses, creators, startups",
    skills: ["design", "social"], investment: "₹5,000 – ₹20,000", monthly: "₹30,000 – ₹1,50,000",
    time: "1–2 weeks", difficulty: 2,
    tools: ["Laptop", "Canva / Figma", "Portfolio website"] },
  { id: "video-edit", emoji: "🎬", title: "Reels & YouTube Editing", tagline: "Edit short & long-form video",
    about: "Edit Reels, Shorts and long-form videos for creators and brands on monthly retainers.",
    customers: "Creators, coaches, agencies",
    skills: ["video", "social"], investment: "₹10,000 – ₹30,000", monthly: "₹25,000 – ₹1,20,000",
    time: "1–2 weeks", difficulty: 2,
    tools: ["Laptop with editing software", "External SSD", "Headphones"] },
  { id: "tutoring", emoji: "📚", title: "Online Tutoring", tagline: "1:1 and small-group classes",
    about: "Teach school subjects, languages or test prep online. Run cohorts on weekends.",
    customers: "School students, parents, working pros",
    skills: ["tutoring"], investment: "₹3,000 – ₹15,000", monthly: "₹15,000 – ₹60,000",
    time: "1 week", difficulty: 1,
    tools: ["Laptop & webcam", "Zoom / Google Meet", "Digital writing pad"] },
  { id: "salon", emoji: "💄", title: "At-home Beauty Service", tagline: "Salon services at the customer's home",
    about: "Provide makeup, facials, mehendi and grooming at the customer's home. Premium pricing on weekends.",
    customers: "Brides, working women, parties",
    skills: ["beauty", "mehendi"], investment: "₹15,000 – ₹40,000", monthly: "₹20,000 – ₹80,000",
    time: "2–3 weeks", difficulty: 2,
    tools: ["Beauty kit", "Travel-friendly station", "Sanitization supplies"] },
  { id: "yoga", emoji: "🧘", title: "Yoga & Wellness Studio", tagline: "Live and recorded classes",
    about: "Run morning yoga batches in your locality and online. Add meal plans and wellness products.",
    customers: "Working professionals, seniors",
    skills: ["yoga"], investment: "₹10,000 – ₹30,000", monthly: "₹15,000 – ₹60,000",
    time: "2–3 weeks", difficulty: 1,
    tools: ["Yoga mats", "Studio space / Zoom", "Sound system"] },
  { id: "repair", emoji: "🔧", title: "Electronics Repair Hub", tagline: "Phones, laptops & appliances",
    about: "Repair phones, laptops and home appliances locally. Pickup-and-drop service drives volume.",
    customers: "Households, small offices",
    skills: ["electronics"], investment: "₹30,000 – ₹80,000", monthly: "₹25,000 – ₹1,00,000",
    time: "3–6 weeks", difficulty: 2,
    tools: ["Repair tool kit", "Spare parts inventory", "Workbench & lighting"] },
  { id: "jewelry", emoji: "💍", title: "Handmade Jewelry Brand", tagline: "Sell on Instagram & Meesho",
    about: "Design and sell trendy handmade jewelry. Build an Instagram brand and ship pan-India.",
    customers: "Gen Z, college students, gifting",
    skills: ["jewelry", "handicrafts"], investment: "₹10,000 – ₹30,000", monthly: "₹15,000 – ₹50,000",
    time: "2–4 weeks", difficulty: 1,
    tools: ["Beads & findings", "Pliers & tools", "Packaging"] },
];

// ---------- Roadmap (shared 7-step template, customized per idea) ----------
type Step = { title: string; when: string; goal: string; tasks: string[] };

const buildRoadmap = (idea: Idea): Step[] => [
  { title: "Validate the idea", when: "Week 1",
    goal: "Talk to 10 potential customers and confirm there's real demand before spending money.",
    tasks: [
      `Speak to 10 people in your target audience: ${idea.customers}`,
      "Ask what they currently use & what frustrates them",
      "Note down their willingness-to-pay range",
      "Identify 3 nearby competitors and study their pricing",
    ] },
  { title: "Setup essentials", when: "Week 2",
    goal: "Get the basic tools, space and supplies needed to deliver your first order.",
    tasks: [
      "List all required tools and materials",
      `Estimated investment: ${idea.investment}`,
      "Buy from local wholesale markets or IndiaMart",
      "Set up a clean workspace at home",
    ] },
  { title: "Register your business", when: "Week 2–3",
    goal: "Get the basic legal paperwork done so you can invoice and open a current account.",
    tasks: [
      "Register on Udyam (free MSME registration)",
      "Open a current account in your business name",
      "Apply for GST if revenue likely > ₹20 lakh/year",
      "Get FSSAI license (if food business)",
    ] },
  { title: "Build your brand", when: "Week 3",
    goal: "Create a simple identity so customers trust and remember you.",
    tasks: [
      "Pick a brand name (check Instagram & domain availability)",
      "Design a logo on Canva (free)",
      "Create Instagram and WhatsApp Business profiles",
      "Click 10 high-quality photos of your product/service",
    ] },
  { title: "Launch & get first 10 customers", when: "Week 4",
    goal: "Soft-launch with friends, family and locality first to gather reviews.",
    tasks: [
      "Announce on personal WhatsApp status & Instagram",
      "Offer a launch discount for first 10 customers",
      "Collect reviews and photos",
      "Set up Google Business Profile",
    ] },
  { title: "Marketing & growth", when: "Month 2 onwards",
    goal: "Move from word-of-mouth to repeatable marketing channels.",
    tasks: [
      "Post on Instagram 4× a week",
      "Run ₹500/day Meta Ads to your locality",
      "List on relevant platforms (Swiggy, Meesho, JustDial, Urban Company)",
      "Ask happy customers for video testimonials",
    ] },
  { title: "Scale & systemize", when: "Month 3+",
    goal: "Hire help, raise prices and expand to new areas.",
    tasks: [
      "Hire 1 helper or freelancer for repetitive work",
      "Raise prices by 10–15% after 50 happy customers",
      "Add a second product/service line",
      `Target monthly revenue: ${idea.monthly}`,
    ] },
];

// ---------- Component ----------
function EntrepreneurDashboard() {
  const { fullName } = useAuth();
  const [section, setSection] = useState("dashboard");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillStep, setSkillStep] = useState<1 | 2>(1);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [openIdeaId, setOpenIdeaId] = useState<string | null>(null);
  const [doneTasks, setDoneTasks] = useState<Record<string, Set<string>>>({});

  const allContent = useStore(() => contentStore.list());
  const mentorList = useStore(() => mentorStore.list());

  const learningResources = useMemo(() => {
    if (skills.length === 0) return allContent.filter(c => c.skill === "general");
    return allContent.filter(c => skills.includes(c.skill) || c.skill === "general");
  }, [allContent, skills]);

  const matchedMentors = useMemo(() => {
    if (skills.length === 0) return mentorList;
    return mentorList
      .map(m => ({ ...m, match: m.skills.filter(s => skills.includes(s)).length }))
      .sort((a, b) => b.match - a.match);
  }, [mentorList, skills]);

  const matchedIdeas = useMemo(() => {
    if (skills.length === 0) return [];
    return IDEAS
      .map((i) => ({ ...i, matchCount: i.skills.filter((s) => skills.includes(s)).length }))
      .filter((i) => i.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);
  }, [skills]);

  const toggleSkill = (id: string) =>
    setSkills((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const toggleBookmark = (id: string) =>
    setBookmarks((b) => (b.includes(id) ? b.filter((x) => x !== id) : [...b, id]));

  const openRoadmap = (ideaId: string) => {
    setOpenIdeaId(ideaId);
    setSection("roadmaps");
  };

  const taskKey = (stepIdx: number, taskIdx: number) => `${stepIdx}:${taskIdx}`;
  const toggleTask = (ideaId: string, stepIdx: number, taskIdx: number) => {
    setDoneTasks((prev) => {
      const set = new Set(prev[ideaId] ?? []);
      const k = taskKey(stepIdx, taskIdx);
      if (set.has(k)) set.delete(k); else set.add(k);
      return { ...prev, [ideaId]: set };
    });
  };

  const openIdea = openIdeaId ? IDEAS.find((i) => i.id === openIdeaId) ?? null : null;
  const overallProgress = (() => {
    if (matchedIdeas.length === 0) return 0;
    const totals = matchedIdeas.map((i) => {
      const steps = buildRoadmap(i);
      const total = steps.reduce((a, s) => a + s.tasks.length, 0);
      const done = doneTasks[i.id]?.size ?? 0;
      return total ? done / total : 0;
    });
    return Math.round((totals.reduce((a, b) => a + b, 0) / totals.length) * 100);
  })();

  return (
    <DashboardShell nav={nav} requireRole="entrepreneur" roleLabel="Entrepreneur" activeId={section} onSelect={(id) => { setSection(id); if (id !== "roadmaps") setOpenIdeaId(null); }}>
      {/* DASHBOARD */}
      {section === "dashboard" && (
        <div className="space-y-8">
          <SectionHeader title={`Welcome back, ${fullName?.split(" ")[0] ?? "founder"}`} subtitle="Here's a snapshot of your startup journey." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Skills selected" value={skills.length} icon={Sparkles} />
            <StatCard label="Ideas matched" value={matchedIdeas.length} icon={Lightbulb} />
            <StatCard label="Roadmap progress" value={`${overallProgress}%`} icon={Compass} />
            <StatCard label="Bookmarks" value={bookmarks.length} icon={Star} />
          </div>
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold">Recommended next step</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {skills.length === 0 ? "Pick a few skills so we can match you with the right businesses." : "Open business ideas matched to your skills."}
            </p>
            <Button className="btn-gradient border-0 mt-4" onClick={() => setSection(skills.length === 0 ? "skills" : "ideas")}>
              {skills.length === 0 ? "Choose your skills" : "See business ideas"}
            </Button>
          </div>
        </div>
      )}

      {/* SKILLS PICKER */}
      {section === "skills" && (
        <div className="space-y-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Step {skillStep} of 2</div>
          <SectionHeader
            title="What can you already do?"
            subtitle="Tick everything you're good at — even hobbies count. We'll match these skills with the right business ideas, roadmaps and mentors."
          />

          <div className="space-y-6">
            {SKILL_GROUPS.map((g) => (
              <div key={g.title} className="glass rounded-2xl p-5">
                <div className="font-semibold mb-3">{g.title}</div>
                <div className="flex flex-wrap gap-2">
                  {g.skills.map((s) => {
                    const active = skills.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        onClick={() => toggleSkill(s.id)}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm transition border ${
                          active
                            ? "btn-gradient border-transparent text-foreground ring-glow"
                            : "border-border/60 hover:bg-accent/40"
                        }`}
                      >
                        <span>{s.emoji}</span>
                        <span>{s.label}</span>
                        {active && <CheckCircle2 className="size-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="sticky bottom-4 z-20">
            <div className="glass rounded-2xl p-4 flex items-center justify-between">
              <div className="text-sm"><span className="font-semibold">{skills.length}</span> skills selected</div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setSkills([])}>Clear</Button>
                <Button
                  className="btn-gradient border-0"
                  disabled={skills.length === 0}
                  onClick={() => { setSkillStep(2); setSection("ideas"); }}
                >
                  See my business ideas <ArrowRight className="size-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IDEAS LIST */}
      {section === "ideas" && (
        <div className="space-y-6">
          <SectionHeader
            title={matchedIdeas.length ? `${matchedIdeas.length} business ideas for you` : "Business ideas"}
            subtitle={
              skills.length === 0
                ? "Pick your skills first to see matched ideas."
                : `Based on your skills: ${skills.map((id) => SKILL_BY_ID[id]?.label).join(", ")}.`
            }
            action={
              <Button variant="outline" className="bg-transparent" onClick={() => setSection("skills")}>
                <ArrowLeft className="size-4 mr-1" /> Edit skills
              </Button>
            }
          />

          {skills.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center text-muted-foreground">
              No skills selected yet. <button className="text-primary underline" onClick={() => setSection("skills")}>Pick skills</button>
            </div>
          ) : matchedIdeas.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center text-muted-foreground">No matches yet — try adding a few more skills.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {matchedIdeas.map((i) => <IdeaCard key={i.id} idea={i} bookmarked={bookmarks.includes(i.id)} onBookmark={() => toggleBookmark(i.id)} onOpen={() => openRoadmap(i.id)} />)}
            </div>
          )}
        </div>
      )}

      {/* ROADMAPS */}
      {section === "roadmaps" && (
        openIdea ? (
          <RoadmapView
            idea={openIdea}
            done={doneTasks[openIdea.id] ?? new Set()}
            onToggleTask={(s, t) => toggleTask(openIdea.id, s, t)}
            bookmarked={bookmarks.includes(openIdea.id)}
            onBookmark={() => toggleBookmark(openIdea.id)}
            onBack={() => setOpenIdeaId(null)}
          />
        ) : (
          <div className="space-y-6">
            <SectionHeader title="Your roadmaps" subtitle="Open any matched idea to see its 7-step launch plan." />
            {matchedIdeas.length === 0 ? (
              <div className="glass rounded-2xl p-8 text-center text-muted-foreground">
                Pick skills to unlock roadmaps. <button className="text-primary underline" onClick={() => setSection("skills")}>Pick skills</button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {matchedIdeas.map((i) => {
                  const steps = buildRoadmap(i);
                  const total = steps.reduce((a, s) => a + s.tasks.length, 0);
                  const done = doneTasks[i.id]?.size ?? 0;
                  const pct = total ? Math.round((done / total) * 100) : 0;
                  return (
                    <button key={i.id} onClick={() => setOpenIdeaId(i.id)} className="glass rounded-2xl p-5 text-left hover:ring-glow transition">
                      <div className="text-3xl">{i.emoji}</div>
                      <div className="font-semibold mt-2">{i.title}</div>
                      <div className="text-xs text-muted-foreground">{i.tagline}</div>
                      <div className="mt-4"><Progress value={pct} /></div>
                      <div className="text-xs text-muted-foreground mt-2">{pct}% • {done}/{total} tasks</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )
      )}

      {/* LEARNING */}
      {section === "learning" && (
        <div className="space-y-6">
          <SectionHeader
            title="Learning Center"
            subtitle={skills.length === 0 ? "Pick skills to unlock tutorials matched to your interests." : `Curated tutorials for: ${skills.map(id => SKILL_BY_ID[id]?.label).filter(Boolean).join(", ")}.`}
          />
          {learningResources.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center text-muted-foreground">
              No tutorials yet. <button className="text-primary underline" onClick={() => setSection("skills")}>Pick skills</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {learningResources.map(r => (
                <div key={r.id} className="glass rounded-2xl p-5 flex flex-col">
                  <div className="text-xs text-emerald uppercase tracking-wider">{r.kind} • {SKILL_BY_ID[r.skill]?.label ?? r.skill}</div>
                  <div className="font-medium mt-2">{r.title}</div>
                  <a href={r.url} target="_blank" rel="noreferrer" className="mt-auto pt-3">
                    <Button size="sm" variant="outline" className="bg-transparent w-full"><ExternalLink className="size-3.5 mr-1" /> Open tutorial</Button>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MENTORS */}
      {section === "mentors" && (
        <div className="space-y-6">
          <SectionHeader title="Mentors" subtitle={skills.length === 0 ? "Connect with builders who've done it." : "Best matched to your skills first."} />
          {matchedMentors.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center text-muted-foreground">No mentors available yet.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchedMentors.map(m => (
                <div key={m.id} className="glass rounded-2xl p-5">
                  <div className="size-12 rounded-full btn-gradient grid place-items-center font-semibold">{m.name.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}</div>
                  <div className="font-medium mt-3">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.expertise} • ⭐ {m.rating}</div>
                  {m.bio && <div className="text-xs text-muted-foreground mt-2">{m.bio}</div>}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {m.skills.map(s => <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-accent/40">{SKILL_BY_ID[s]?.emoji ?? ""} {SKILL_BY_ID[s]?.label ?? s}</span>)}
                  </div>
                  <Button size="sm" className="btn-gradient border-0 mt-3 w-full" onClick={() => toast.success(`Request sent to ${m.name}${m.email ? ` (${m.email})` : ""}`)}>Request mentorship</Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BOOKMARKS */}
      {section === "bookmarks" && (
        <div className="space-y-6">
          <SectionHeader title="Bookmarks" />
          {bookmarks.length === 0 ? <div className="glass rounded-2xl p-8 text-center text-muted-foreground">No bookmarks yet.</div> : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarks.map((id) => {
                const i = IDEAS.find((x) => x.id === id);
                if (!i) return null;
                return <IdeaCard key={i.id} idea={{ ...i, matchCount: 0 }} bookmarked onBookmark={() => toggleBookmark(i.id)} onOpen={() => openRoadmap(i.id)} hideMatchBadge />;
              })}
            </div>
          )}
        </div>
      )}

      {/* PROGRESS */}
      {section === "progress" && (
        <div className="space-y-6">
          <SectionHeader title="Progress tracker" />
          <div className="glass rounded-2xl p-6 space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-1"><span>Overall roadmap progress</span><span>{overallProgress}%</span></div>
              <Progress value={overallProgress} />
            </div>
            {matchedIdeas.map((i) => {
              const steps = buildRoadmap(i);
              const total = steps.reduce((a, s) => a + s.tasks.length, 0);
              const done = doneTasks[i.id]?.size ?? 0;
              const pct = total ? Math.round((done / total) * 100) : 0;
              return (
                <div key={i.id}>
                  <div className="flex justify-between text-sm mb-1"><span>{i.emoji} {i.title}</span><span>{pct}%</span></div>
                  <Progress value={pct} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {section === "notifications" && (
        <div className="space-y-3">
          <SectionHeader title="Notifications" />
          <div className="glass rounded-2xl p-8 text-center text-muted-foreground">You're all caught up.</div>
        </div>
      )}

      {section === "settings" && (
        <div className="space-y-6">
          <SectionHeader title="Settings" />
          <div className="glass rounded-2xl p-6 space-y-4 max-w-xl">
            <div><label className="text-sm">Full name</label><Input defaultValue={fullName ?? ""} /></div>
            <Button className="btn-gradient border-0" onClick={() => toast.success("Profile saved")}>Save changes</Button>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

// ---------- Sub-components ----------
function Difficulty({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="font-mono tracking-widest">
      {[1,2,3].map((n) => <span key={n} className={n <= level ? "text-emerald" : "text-muted-foreground/40"}>●</span>)}
    </span>
  );
}

function IdeaCard({
  idea, bookmarked, onBookmark, onOpen, hideMatchBadge,
}: {
  idea: Idea & { matchCount: number };
  bookmarked: boolean;
  onBookmark: () => void;
  onOpen: () => void;
  hideMatchBadge?: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5 flex flex-col">
      {!hideMatchBadge && idea.matchCount > 0 && (
        <div className="text-xs text-emerald font-medium mb-2">{idea.matchCount} skill match{idea.matchCount > 1 ? "es" : ""}</div>
      )}
      <div className="flex items-start justify-between">
        <div className="text-4xl">{idea.emoji}</div>
        <button onClick={onBookmark} className="text-muted-foreground hover:text-foreground" aria-label="Bookmark">
          <Star className={`size-5 ${bookmarked ? "fill-current text-emerald" : ""}`} />
        </button>
      </div>
      <div className="mt-3 font-semibold text-lg">{idea.title}</div>
      <div className="text-sm text-muted-foreground">{idea.tagline}</div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {idea.skills.map((sid) => {
          const s = SKILL_BY_ID[sid];
          return s ? <span key={sid} className="text-xs px-2 py-1 rounded-full bg-accent/40">{s.emoji} {s.label}</span> : null;
        })}
      </div>
      <dl className="grid grid-cols-2 gap-3 mt-4 text-sm">
        <div><dt className="text-xs text-muted-foreground">Investment</dt><dd className="font-medium">{idea.investment}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Monthly</dt><dd className="font-medium">{idea.monthly}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Time to start</dt><dd className="font-medium">{idea.time}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Difficulty</dt><dd><Difficulty level={idea.difficulty} /></dd></div>
      </dl>
      <Button className="btn-gradient border-0 mt-5" onClick={onOpen}>Open roadmap <ArrowRight className="size-4 ml-1" /></Button>
    </motion.div>
  );
}

function RoadmapView({
  idea, done, onToggleTask, bookmarked, onBookmark, onBack,
}: {
  idea: Idea;
  done: Set<string>;
  onToggleTask: (stepIdx: number, taskIdx: number) => void;
  bookmarked: boolean;
  onBookmark: () => void;
  onBack: () => void;
}) {
  const steps = buildRoadmap(idea);
  const total = steps.reduce((a, s) => a + s.tasks.length, 0);
  const completed = done.size;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
        <ArrowLeft className="size-4" /> Back to ideas
      </button>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <div className="text-5xl">{idea.emoji}</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{idea.title}</h1>
              <p className="text-muted-foreground mt-1">{idea.tagline}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {idea.skills.map((sid) => {
                  const s = SKILL_BY_ID[sid];
                  return s ? <span key={sid} className="text-xs px-2 py-1 rounded-full bg-accent/40">{s.emoji} {s.label}</span> : null;
                })}
              </div>
            </div>
          </div>
          <Button variant="outline" className="bg-transparent" onClick={onBookmark}>
            <Star className={`size-4 mr-1 ${bookmarked ? "fill-current text-emerald" : ""}`} /> {bookmarked ? "Saved" : "Save"}
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          <Stat icon={Wallet} label="Investment" value={idea.investment} />
          <Stat icon={TrendingUp} label="Monthly potential" value={idea.monthly} />
          <Stat icon={Clock} label="Time to start" value={idea.time} />
          <Stat icon={BarChart3} label="Difficulty" value={<Difficulty level={idea.difficulty} />} />
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold">Your progress</div>
          <div className="text-sm text-muted-foreground">{pct}% complete</div>
        </div>
        <Progress value={pct} />
        <div className="text-xs text-muted-foreground mt-2">{completed} / {total} tasks done</div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold">About this business</h2>
        <p className="text-sm text-muted-foreground mt-2">{idea.about}</p>
        <p className="text-sm mt-3"><span className="text-muted-foreground">Best customers:</span> {idea.customers}</p>
        {idea.tools.length > 0 && (
          <>
            <h3 className="font-semibold mt-5 text-sm">You'll need</h3>
            <ul className="mt-2 grid sm:grid-cols-2 gap-2 text-sm">
              {idea.tools.map((t) => <li key={t} className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald" />{t}</li>)}
            </ul>
          </>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">7-step launch roadmap</h2>
        <div className="space-y-4">
          {steps.map((step, sIdx) => {
            const stepDone = step.tasks.every((_, tIdx) => done.has(`${sIdx}:${tIdx}`));
            return (
              <motion.div key={step.title} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: sIdx * 0.04 }} className="glass rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className={`size-9 shrink-0 rounded-full grid place-items-center font-semibold ${stepDone ? "btn-gradient" : "bg-accent/40"}`}>
                    {sIdx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <h3 className="font-semibold">{step.title}</h3>
                      <span className="text-xs text-muted-foreground">{step.when}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{step.goal}</p>
                    <ul className="mt-3 space-y-2">
                      {step.tasks.map((task, tIdx) => {
                        const k = `${sIdx}:${tIdx}`;
                        const isDone = done.has(k);
                        return (
                          <li key={tIdx}>
                            <button
                              onClick={() => onToggleTask(sIdx, tIdx)}
                              className={`w-full text-left flex items-start gap-2 p-2 rounded-lg hover:bg-accent/30 transition ${isDone ? "opacity-70" : ""}`}
                            >
                              {isDone ? <CheckCircle2 className="size-4 mt-0.5 text-emerald shrink-0" /> : <Circle className="size-4 mt-0.5 text-muted-foreground shrink-0" />}
                              <span className={`text-sm ${isDone ? "line-through" : ""}`}>{task}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Wallet; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl p-3 bg-accent/30">
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Icon className="size-3.5" />{label}</div>
      <div className="font-medium mt-1">{value}</div>
    </div>
  );
}
