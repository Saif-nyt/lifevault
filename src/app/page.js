"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Archive,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Compass,
  FileText,
  Film,
  Lightbulb,
  Link2,
  Lock,
  Moon,
  Search,
  Sparkles,
  StickyNote,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "@/context/theme-context";

const CATEGORIES = [
  { icon: BookOpen, label: "Knowledge", desc: "Notes, links, books, documents", href: "/knowledge" },
  { icon: Compass, label: "Memories", desc: "Moments, photos, places", href: "/memories" },
  { icon: Lightbulb, label: "Ideas", desc: "Thoughts and business ideas", href: "/ideas" },
  { icon: Film, label: "Entertainment", desc: "Movies, shows and videos", href: "/entertainment" },
  { icon: FileText, label: "Documents", desc: "Files, notes and references", href: "/archives?type=document" },
  { icon: CalendarDays, label: "Important moments", desc: "Events and milestones", href: "/archives?type=event" },
];

const QUICK_CAPTURE = [
  { icon: StickyNote, label: "Note" },
  { icon: Link2, label: "Link" },
  { icon: Compass, label: "Memory" },
  { icon: Lightbulb, label: "Idea" },
  { icon: BookOpen, label: "Book" },
  { icon: Film, label: "Movie" },
];

const SAMPLE_CARDS = [
  { type: "Book", title: "The Creative Act", meta: "Reading · 4.5 ★ · Rick Rubin", icon: BookOpen },
  { type: "Memory", title: "Sunsets in Cox's Bazar", meta: "Memory · Feb 2025", icon: Compass },
  { type: "Idea", title: "A calm study app for students", meta: "Idea · Exploring", icon: Lightbulb },
];

export default function LandingPage() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const primaryHref = user ? "/dashboard" : "/signup";
  const primaryLabel = user ? "Open your vault" : "Create your vault";

  function handleSearch(event) {
    event.preventDefault();
    const value = query.trim();
    if (user) {
      router.push(value ? `/archives?q=${encodeURIComponent(value)}` : "/archives");
    } else {
      router.push(value ? `/login?next=${encodeURIComponent(`/archives?q=${value}`)}` : "/login");
    }
  }

  function categoryHref(href) {
    return user ? href : `/login?next=${encodeURIComponent(href)}`;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Archive className="size-4" />
            </span>
            <span className="font-display text-base font-semibold">LifeVault</span>
          </Link>

          <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
            <a href="#categories" className="transition hover:text-foreground">Categories</a>
            <a href="#capture" className="transition hover:text-foreground">Capture</a>
            <a href="#preview" className="transition hover:text-foreground">Preview</a>
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="size-9">
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            {!loading && !user ? (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup">Get started</Link>
                </Button>
              </>
            ) : null}
            {user ? (
              <Button asChild size="sm">
                <Link href="/dashboard">Open vault</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Welcome + search */}
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              Your personal archive
            </p>
            <h1 className="mt-5 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              Everything worth remembering.{" "}
              <span className="italic text-primary">One place.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Your knowledge, memories, ideas and discoveries, organized in your personal space.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Lock className="size-3.5" />
              Private by default · Only you can read your archive
            </div>
          </div>

          <form onSubmit={handleSearch} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              <Search className="size-3.5" /> Universal search
            </div>
            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={user ? "Search your vault…" : "Search (sign in to search your data)…"}
                className="h-11 pl-10"
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {user
                ? "Search titles, notes, tags, links and more."
                : "Sign in to search your own archive. This preview never shows private data."}
            </p>
            <Button type="submit" size="sm" className="mt-3 w-full">
              {user ? "Search your vault" : "Sign in to search"}
            </Button>
          </form>
        </section>

        {/* Categories */}
        <section id="categories" className="mt-12 sm:mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Categories</p>
              <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">Every part of your life</h2>
            </div>
            <p className="hidden max-w-xs text-sm text-muted-foreground sm:block">
              Ten content types, each with a form that understands what it is.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c) => (
              <Link
                key={c.label}
                href={categoryHref(c.href)}
                className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-foreground/20 hover:bg-secondary/40"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <c.icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-medium">{c.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{c.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick capture preview */}
        <section id="capture" className="mt-12 sm:mt-16">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Quick capture</p>
                <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">Save in seconds</h2>
              </div>
              <p className="max-w-sm text-sm text-muted-foreground">
                Capture from anywhere — no page-hopping required.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {QUICK_CAPTURE.map((q) => (
                <span
                  key={q.label}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-sm"
                >
                  <q.icon className="size-4 text-primary" />
                  {q.label}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link href={primaryHref}>{primaryLabel} <ArrowRight /></Link>
              </Button>
              {!user ? (
                <Button asChild size="sm" variant="outline">
                  <Link href="/login">Sign in</Link>
                </Button>
              ) : null}
            </div>
          </div>
        </section>

        {/* Example archive preview */}
        <section id="preview" className="mt-12 sm:mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Preview</p>
              <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">How your archive looks</h2>
            </div>
            <span className="rounded-full border border-border bg-card px-2.5 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              Sample content
            </span>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SAMPLE_CARDS.map((card) => (
              <div key={card.title} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  <card.icon className="size-3" /> {card.type}
                </div>
                <p className="mt-2 font-display text-base font-semibold">{card.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{card.meta}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            These are demonstration cards, not real user records.
          </p>
        </section>

        {/* Final CTA */}
        <section className="mt-12 sm:mt-16">
          <div className="rounded-2xl border border-border bg-sidebar p-8 text-center sm:p-12">
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">Create your vault.</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Start with one thing worth remembering.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href={primaryHref}>
                {primaryLabel} <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <Archive className="size-4" />
            <span className="font-display text-sm text-foreground">LifeVault</span>
          </div>
          <p>Your life. Your knowledge. Your archive.</p>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-foreground">Sign in</Link>
            <Link href="/signup" className="hover:text-foreground">Get started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
