// Shared client-side store (localStorage) so admin-curated content and mentors
// reflect on the entrepreneur dashboard within the same browser. For real
// cross-user sync, move these to Supabase tables later.

export type ContentType = "Tutorial" | "Learning module" | "Featured" | "Category";
export type ResourceKind = "Video" | "Article" | "PDF" | "Checklist";

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  url: string;
  kind: ResourceKind;
  skill: string; // skill id, or "general"
}

export interface MentorItem {
  id: string;
  name: string;
  expertise: string;
  skills: string[];
  rating: number;
  years: number;
  bio?: string;
  email?: string;
}

const KEYS = {
  content: "esh:content",
  mentors: "esh:mentors",
};

const DEFAULT_CONTENT: ContentItem[] = [
  // Tailoring
  { id: "c1", type: "Tutorial", kind: "Video", skill: "tailoring", title: "Beginner Tailoring Course (Hindi)", url: "https://www.youtube.com/results?search_query=tailoring+course+for+beginners" },
  { id: "c2", type: "Tutorial", kind: "Video", skill: "tailoring", title: "How to Start a Boutique Business", url: "https://www.youtube.com/results?search_query=how+to+start+a+boutique+business" },
  { id: "c3", type: "Tutorial", kind: "Article", skill: "embroidery", title: "Embroidery Basics Guide", url: "https://www.thesprucecrafts.com/learn-to-embroider-1177620" },
  // Food
  { id: "c4", type: "Tutorial", kind: "Video", skill: "cooking", title: "Cloud Kitchen Setup Guide", url: "https://www.youtube.com/results?search_query=cloud+kitchen+business+setup+india" },
  { id: "c5", type: "Tutorial", kind: "Video", skill: "baking", title: "Home Bakery Business Course", url: "https://www.youtube.com/results?search_query=home+bakery+business" },
  { id: "c6", type: "Tutorial", kind: "Video", skill: "tiffin", title: "Start a Tiffin Service", url: "https://www.youtube.com/results?search_query=how+to+start+tiffin+service+business" },
  // Digital
  { id: "c7", type: "Tutorial", kind: "Video", skill: "design", title: "Graphic Design Full Course", url: "https://www.youtube.com/results?search_query=graphic+design+full+course" },
  { id: "c8", type: "Tutorial", kind: "Video", skill: "video", title: "Video Editing for Beginners", url: "https://www.youtube.com/results?search_query=video+editing+for+beginners" },
  { id: "c9", type: "Tutorial", kind: "Video", skill: "web", title: "Full-Stack Web Development", url: "https://www.youtube.com/results?search_query=full+stack+web+development+course" },
  { id: "c10", type: "Tutorial", kind: "Video", skill: "social", title: "Social Media Marketing", url: "https://www.youtube.com/results?search_query=social+media+marketing+full+course" },
  { id: "c11", type: "Tutorial", kind: "Video", skill: "photo", title: "Photography Masterclass", url: "https://www.youtube.com/results?search_query=photography+masterclass" },
  // Services
  { id: "c12", type: "Tutorial", kind: "Video", skill: "tutoring", title: "Start an Online Tutoring Business", url: "https://www.youtube.com/results?search_query=start+online+tutoring+business" },
  { id: "c13", type: "Tutorial", kind: "Video", skill: "garden", title: "Plant Nursery Business", url: "https://www.youtube.com/results?search_query=plant+nursery+business" },
  // Wellness
  { id: "c14", type: "Tutorial", kind: "Video", skill: "beauty", title: "Beauty & Salon Business Tips", url: "https://www.youtube.com/results?search_query=salon+business+tips" },
  { id: "c15", type: "Tutorial", kind: "Video", skill: "yoga", title: "Yoga Teacher Training", url: "https://www.youtube.com/results?search_query=yoga+teacher+training" },
  // Trades
  { id: "c16", type: "Tutorial", kind: "Video", skill: "electronics", title: "Mobile Repair Course", url: "https://www.youtube.com/results?search_query=mobile+repair+course" },
  { id: "c17", type: "Tutorial", kind: "Video", skill: "carpentry", title: "Carpentry Skills", url: "https://www.youtube.com/results?search_query=carpentry+for+beginners" },
  { id: "c18", type: "Tutorial", kind: "Video", skill: "jewelry", title: "Handmade Jewelry Business", url: "https://www.youtube.com/results?search_query=handmade+jewelry+business" },
  { id: "c19", type: "Tutorial", kind: "Video", skill: "mehendi", title: "Mehendi Designs Tutorial", url: "https://www.youtube.com/results?search_query=mehendi+designs+tutorial" },
  // General
  { id: "c20", type: "Learning module", kind: "Article", skill: "general", title: "How to validate a business idea", url: "https://www.ycombinator.com/library/4D-yc-s-essential-startup-advice" },
  { id: "c21", type: "Learning module", kind: "Article", skill: "general", title: "Pricing your service for profit", url: "https://hbr.org/2018/01/a-quick-guide-to-value-based-pricing" },
  { id: "c22", type: "Featured", kind: "Video", skill: "general", title: "Marketing on Instagram", url: "https://www.youtube.com/results?search_query=instagram+marketing+for+small+business" },
  { id: "c23", type: "Featured", kind: "Article", skill: "general", title: "Legal basics for solopreneurs (India)", url: "https://www.indiafilings.com/learn/sole-proprietorship-india/" },
];

const DEFAULT_MENTORS: MentorItem[] = [
  { id: "m1", name: "Arun Kumar", expertise: "Boutique & Tailoring", skills: ["tailoring", "embroidery"], rating: 4.9, years: 12, bio: "12 years running a boutique. Helps founders launch in 30 days.", email: "arun@entreskillhub.com" },
  { id: "m2", name: "Priya Shah", expertise: "Food & Catering", skills: ["cooking", "baking", "tiffin"], rating: 4.8, years: 9, bio: "Founder of a cloud bakery doing ₹5L/month.", email: "priya@entreskillhub.com" },
  { id: "m3", name: "Ravi Menon", expertise: "Freelancing & Digital", skills: ["design", "video", "social", "web"], rating: 4.7, years: 14, bio: "Helps freelancers cross ₹1L/month.", email: "ravi@entreskillhub.com" },
];

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("esh:store", { detail: { key } }));
}

export const contentStore = {
  list: () => read<ContentItem[]>(KEYS.content, DEFAULT_CONTENT),
  add: (item: Omit<ContentItem, "id">) => {
    const items = contentStore.list();
    const next = [{ ...item, id: crypto.randomUUID() }, ...items];
    write(KEYS.content, next);
    return next;
  },
  remove: (id: string) => {
    const next = contentStore.list().filter(i => i.id !== id);
    write(KEYS.content, next);
    return next;
  },
};

export const mentorStore = {
  list: () => read<MentorItem[]>(KEYS.mentors, DEFAULT_MENTORS),
  add: (item: Omit<MentorItem, "id">) => {
    const next = [{ ...item, id: crypto.randomUUID() }, ...mentorStore.list()];
    write(KEYS.mentors, next);
    return next;
  },
  remove: (id: string) => {
    const next = mentorStore.list().filter(m => m.id !== id);
    write(KEYS.mentors, next);
    return next;
  },
};

// React hook
import { useEffect, useState } from "react";
export function useStore<T>(loader: () => T): T {
  const [val, setVal] = useState<T>(loader);
  useEffect(() => {
    const handler = () => setVal(loader());
    window.addEventListener("esh:store", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("esh:store", handler);
      window.removeEventListener("storage", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return val;
}
