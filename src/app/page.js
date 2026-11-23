"use client";

import Link from "next/link";
import {
  Archive,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Compass,
  Film,
  FolderHeart,
  Lightbulb,
  Link2,
  Lock,
  Moon,
  Search,
  Sparkles,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "@/context/theme-context";

const KEEP = [
  { icon: BookOpen, label: "Class notes & learning" },
  { icon: Compass, label: "Memories & places" },
  { icon: Film, label: "Films, shows & videos" },
  { icon: Lightbulb, label: "Ideas & business thoughts" },
  { icon: FolderHeart, label: "Books & reading lists" },
  { icon: Link2, label: "Links worth keeping" },
  { icon: CalendarDays, label: "Dates & reminders" },
  { icon: Archive, label: "Documents & photos" },
];

const STEPS = [
  {
    number: "01",
    title: "Capture without friction",
    body: "Save a note, a link, a memory or a film in seconds. LifeVault gives every thought a place to land.",
    icon: Archive,
  },
  {
    number: "02",
    title: "Give it gentle structure",
    body: "Categories, tags and collections keep your archive tidy without turning it into a spreadsheet.",
    icon: FolderHeart,
  },
  {
    number: "03",
    title: "Rediscover what matters",
    body: "Search everything, browse the timeline, or let the Rediscover shelf resurface something you forgot.",
    icon: Search,
  },
];

export default function LandingPage() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const primaryHref = user ? "/dashboard" : "/signup";
  const primaryLabel = user ? "Open your vault" : "Start your archive";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Archive className="size-4" />
            </span>
            <span className="font-display text-lg font-semibold">LifeVault</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#philosophy" className="transition hover:text-foreground">Philosophy</a>
            <a href="#keep" className="transition hover:text-foreground">What you keep</a>
            <a href="#how" className="transition hover:text-foreground">How it works</a>
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
            {!loading && !user ? (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup">Get started</Link>
                </Button>
              </>
            ) : null}
            {user ? (
              <Button asChild size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-40 top-0 hidden size-[32rem] rounded-full bg-accent/30 blur-3xl lg:block" />
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28">
            <div className="relative z-10">
              <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs text-muted-foreground">
                <Sparkles className="size-3.5" /> Your life. Your knowledge. Your archive.
              </p>
              <h1 className="mt-6 max-w-xl font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
                A quieter home for everything you want to{" "}
                <span className="italic text-primary">remember</span>.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
                LifeVault is a private personal archive for the notes, memories, ideas, films and reading lists
                that make up a life — organized enough to find, loose enough to feel like yours.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href={primaryHref}>
                    {primaryLabel} <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#how">See how it works</a>
                </Button>
              </div>
              <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="size-3.5" /> Private by default · Your archive is only yours
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:mr-0">
              <div className="absolute inset-6 rotate-6 rounded-2xl border border-border bg-card/60" />
              <div className="absolute inset-4 -rotate-3 rounded-2xl border border-border bg-card/80" />
              <div className="relative rounded-2xl border border-border bg-card p-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">This week</p>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">12 items</span>
                </div>
                <div className="space-y-3 pt-4">
                  <div className="rounded-lg border border-border p-3">
                    <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      <BookOpen className="size-3" /> Book
                    </div>
                    <p className="mt-1.5 font-display text-base font-semibold">The Creative Act</p>
                    <p className="text-xs text-muted-foreground">Reading · 4.5 ★ · Rick Rubin</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-border p-3">
                      <Compass className="size-3 text-muted-foreground" />
                      <p className="mt-2 text-sm font-medium leading-snug">Sunsets in Cox&apos;s Bazar</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">Memory · Feb 2025</p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <Lightbulb className="size-3 text-muted-foreground" />
                      <p className="mt-2 text-sm font-medium leading-snug">A calm study app for students</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">Idea · Exploring</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-secondary/70 p-3">
                    <Search className="size-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Search anything you&apos;ve saved…</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="philosophy" className="border-y border-border bg-card/50">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Our philosophy</p>
                <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">Capture. Organize. Rediscover.</h2>
              </div>
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                Most apps ask you to fit your life into their structure. LifeVault starts from the other direction:
                save first, then shape it. A personal library should feel like a reflection of you, not a corporate
                dashboard. Every detail here is designed to keep the archive calm, legible and worth returning to.
              </p>
            </div>
          </div>
        </section>

        <section id="keep" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">A place for</p>
              <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">Every part of your life</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Ten content types, each with a form that understands what it is — from a film rating to a memory date.
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {KEEP.map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <item.icon className="size-4" />
                </span>
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="how" className="border-t border-border bg-card/40">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
            <div className="max-w-xl">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">How it works</p>
              <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">Simple by design</h2>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.number}>
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <span className="font-mono text-xs text-muted-foreground">{step.number}</span>
                    <step.icon className="size-5 text-primary" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <div className="grid gap-10 rounded-2xl border border-border bg-sidebar p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Built to be private</p>
              <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">Your vault stays yours.</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                Authentication lives in secure, HTTP-only cookies. Every archive query is scoped to the signed-in
                account. Your files are stored in cloud object storage, never inside the database itself.
              </p>
            </div>
            <ul className="space-y-4">
              {[
                "Secure session cookies — no auth tokens in localStorage",
                "Every item is checked against your account before it is read or changed",
                "Passwords hashed with bcrypt; secrets stay on the server",
                "Uploads validated by type and size, then stored in Cloudinary",
              ].map((line) => (
                <li key={line} className="flex gap-3 text-sm">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-muted-foreground">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto flex max-w-6xl flex-col items-center px-5 py-20 text-center sm:px-8">
            <h2 className="max-w-2xl font-display text-4xl tracking-tight sm:text-5xl">
              Start with one thing worth remembering.
            </h2>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Your future self will thank you for the archive you begin today.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href={primaryHref}>
                {primaryLabel} <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:px-8">
          <div className="flex items-center gap-2">
            <Archive className="size-4" />
            <span className="font-display text-sm text-foreground">LifeVault</span>
          </div>
          <p>Your life. Your knowledge. Your archive.</p>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-foreground">Log in</Link>
            <Link href="/signup" className="hover:text-foreground">Get started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
