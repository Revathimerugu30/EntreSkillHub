import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Rocket, BookOpen, Users, Target, Compass, Scissors, ChefHat, Palette, Wrench, Laptop, Heart, Check, Mail, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mentorStore, useStore } from "@/lib/shared-store";

export const Route = createFileRoute("/")({
  component: Landing,
});

const features = [
  { icon: Sparkles, title: "Business recommendations", desc: "AI-matched ideas based on your skills and interests." },
  { icon: Compass, title: "Startup roadmaps", desc: "Step-by-step plans from idea to first customer." },
  { icon: BookOpen, title: "Learning resources", desc: "Articles, videos, PDFs and checklists curated by mentors." },
  { icon: Users, title: "Mentorship", desc: "Request 1:1 guidance from verified industry experts." },
];

const steps = [
  { n: "Step 1", t: "Register" },
  { n: "Step 2", t: "Select skills" },
  { n: "Step 3", t: "Get ideas" },
  { n: "Step 4", t: "Learn" },
  { n: "Step 5", t: "Connect mentors" },
  { n: "Step 6", t: "Start business" },
];

const categories = [
  { icon: Scissors, name: "Tailoring" },
  { icon: ChefHat, name: "Food business" },
  { icon: Laptop, name: "Freelancing" },
  { icon: Heart, name: "Beauty services" },
  { icon: Wrench, name: "Repair services" },
  { icon: Palette, name: "Handicrafts" },
];

const stories = [
  { quote: "I started with home baking and now run a successful cloud bakery generating ₹5L/month through EntreSkill Hub's guidance.", who: "Mahesh Merugu, Food entrepreneur" },
  { quote: "EntreSkill Hub transformed my tailoring skills into a thriving boutique business with professional branding and steady growth.", who: "Mayuri, Boutique founder" },
];

function Landing() {
  const mentors = useStore(() => mentorStore.list());
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/40 backdrop-blur-xl bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 rounded-lg btn-gradient grid place-items-center">
              <Rocket className="size-4" />
            </div>
            <span className="font-bold text-lg">EntreSkill <span className="gradient-text">Hub</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#how" className="hover:text-foreground transition">How it works</a>
            <a href="#categories" className="hover:text-foreground transition">Categories</a>
            <a href="#mentors" className="hover:text-foreground transition">Mentors</a>
            <a href="#contact" className="hover:text-foreground transition">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link to="/register"><Button size="sm" className="btn-gradient border-0">Get started</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 pt-20 pb-24 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-muted-foreground mb-6">
              <Sparkles className="size-3 text-emerald" /> Skill-to-Startup enablement, reimagined
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.05]">
              Turn your <span className="gradient-text">skills</span> into a thriving <span className="gradient-text">micro-business</span>.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Personalized business ideas, step-by-step startup roadmaps, curated learning, and mentor-led support — all in one premium platform.
            </p>
            <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
              <Link to="/register"><Button size="lg" className="btn-gradient border-0 h-12 px-7 text-base">Start your journey <ArrowRight className="ml-2 size-4" /></Button></Link>
              <a href="#features"><Button size="lg" variant="outline" className="h-12 px-7 text-base bg-transparent">Explore features</Button></a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }} className="mt-16 mx-auto max-w-5xl">
            <div className="glass rounded-2xl p-1 ring-glow">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 rounded-xl bg-background/40">
                {[
                  { k: "12k+", v: "Aspiring founders" },
                  { k: "350+", v: "Verified mentors" },
                  { k: "80+", v: "Startup roadmaps" },
                  { k: "24/7", v: "Real-time support" },
                ].map((s) => (
                  <div key={s.v} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold gradient-text">{s.k}</div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About / Mission */}
      <section id="about" className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-emerald">Our mission</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">EntreSkill Hub bridges the gap between <span className="gradient-text">skill</span> and <span className="gradient-text">enterprise</span>.</h2>
            <p className="mt-5 text-muted-foreground">
              We give every aspiring founder — from tailors to coders — the roadmap, resources, and human support needed to convert craft into income.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Personalized business recommendations",
                "Mentor-validated startup roadmaps",
                "Hands-on learning resources",
                "Real-time progress tracking",
              ].map((p) => (
                <li key={p} className="flex items-center gap-3 text-sm">
                  <Check className="size-4 text-emerald" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { t: "Launch faster", d: "Skip the guesswork." },
              { t: "Learn deeper", d: "Curated by mentors." },
              { t: "Connect smarter", d: "Right people, right time." },
              { t: "Navigate clearly", d: "Always know the next step." },
            ].map((c) => (
              <div key={c.t} className="glass rounded-2xl p-5">
                <div className="font-semibold">{c.t}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold">Everything you need to <span className="gradient-text">start</span></h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">A premium toolkit built for the next wave of micro-entrepreneurs.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass rounded-2xl p-6 hover:ring-glow transition">
              <div className="size-11 rounded-xl btn-gradient grid place-items-center mb-4">
                <f.icon className="size-5" />
              </div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How */}
      <section id="how" className="container mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold">How it works</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((s) => (
            <div key={s.n} className="glass rounded-2xl p-6">
              <div className="text-xs text-emerald uppercase tracking-[0.2em]">{s.n}</div>
              <div className="mt-2 text-2xl font-semibold">{s.t}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="container mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold">Business <span className="gradient-text">categories</span></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c) => (
            <div key={c.name} className="glass rounded-2xl p-5 text-center hover:ring-glow transition">
              <c.icon className="size-7 mx-auto mb-3 text-emerald" />
              <div className="text-sm font-medium">{c.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mentors */}
      <section id="mentors" className="container mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold">Featured <span className="gradient-text">mentors</span></h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mentors.map((m) => (
            <motion.div key={m.id} className="glass rounded-2xl p-6 hover:ring-glow hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105 cursor-pointer hover:border-emerald-200/50"
              whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(16, 185, 129, 0.1), 0 10px 10px -5px rgba(16, 185, 129, 0.04)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <div className="flex items-center gap-4">
                <motion.div className="size-14 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 grid place-items-center font-semibold text-white shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  {m.name.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}
                </motion.div>
                <div>
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.expertise}</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-5 text-xs text-muted-foreground">
                <span className="flex-1">{m.bio || `${m.years} yrs experience`}</span>
                <span className="inline-flex items-center gap-1"><Star className="size-3 fill-current text-emerald" /> {m.rating}</span>
              </div>
              <Link to="/register">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white border-0 mt-5 w-full shadow-lg hover:shadow-blue-500/25 transition-all duration-200">Request mentorship</Button>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Success stories */}
      <section id="stories" className="container mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold">Success <span className="gradient-text">stories</span></h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {stories.map((s) => (
            <div key={s.who} className="glass rounded-2xl p-8">
              <p className="text-lg leading-relaxed">"{s.quote}"</p>
              <div className="text-sm text-muted-foreground mt-4">— {s.who}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="container mx-auto px-6 py-20">
        <div className="glass-strong rounded-3xl p-10 md:p-14 text-center ring-glow">
          <Target className="size-10 mx-auto text-emerald mb-4" />
          <h2 className="text-4xl font-bold">Ready to build something of your own?</h2>
          <p className="mt-3 text-muted-foreground">Join thousands of micro-founders turning skills into income.</p>
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <Link to="/register"><Button size="lg" className="btn-gradient border-0 h-12 px-8">Get started free</Button></Link>
            <a href="mailto:hello@entreskillhub.com"><Button size="lg" variant="outline" className="h-12 px-8 bg-transparent"><Mail className="mr-2 size-4" /> hello@entreskillhub.com</Button></a>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/40 py-10 mt-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between gap-4 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} EntreSkill Hub</div>
          <div className="flex gap-6">
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
