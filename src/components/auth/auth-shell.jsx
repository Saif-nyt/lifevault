import Link from "next/link";
import { Archive, ArrowLeft, BookOpen, Lock, Search } from "lucide-react";

export function AuthShell({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-sidebar p-10 lg:flex">
        <div className="pointer-events-none absolute -left-24 bottom-0 size-96 rounded-full bg-accent/25 blur-3xl" />
        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Archive className="size-4" />
          </span>
          <span className="font-display text-lg font-semibold">LifeVault</span>
        </Link>

        <div className="relative max-w-md">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">A personal archive</p>
          <blockquote className="mt-5 font-display text-4xl leading-[1.15] tracking-tight">
            “The things we keep are the shape of the life we lived.”
          </blockquote>
          <div className="mt-10 space-y-4">
            {[
              { icon: BookOpen, text: "Notes, books and ideas in one quiet place" },
              { icon: Search, text: "Search across everything you have saved" },
              { icon: Lock, text: "Private by default, scoped to your account" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex size-8 items-center justify-center rounded-lg border border-border bg-card">
                  <item.icon className="size-3.5" />
                </span>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-muted-foreground">Your life. Your knowledge. Your archive.</p>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between px-5 py-5 sm:px-10">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Archive className="size-4" />
            </span>
            <span className="font-display font-semibold">LifeVault</span>
          </Link>
          <Link href="/" className="ml-auto inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-3.5" /> Back home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 pb-14 sm:px-10">
          <div className="w-full max-w-sm">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
            <div className="mt-8">{children}</div>
            {footer ? <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
