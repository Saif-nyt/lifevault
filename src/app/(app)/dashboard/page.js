"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Bookmark,
  CalendarClock,
  FolderHeart,
  Layers,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { ArchiveGrid } from "@/components/archives/archive-card";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { useAuth } from "@/context/auth-context";
import { dashboardService } from "@/services/dashboard.service";
import { archiveService } from "@/services/archive.service";
import { TYPE_CHIPS, TYPE_MAP } from "@/lib/constants";
import { cn, formatDate, formatDateTime, relativeTime } from "@/lib/utils";

function StatCard({ icon: Icon, label, value, hint, href }) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-border/80 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_18px_40px_-28px_var(--glow)]"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-semibold">{value ?? "—"}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>
    </Link>
  );
}

function Panel({ title, meta, action, children, className }) {
  return (
    <section className={cn("flex flex-col rounded-2xl border border-border/80 bg-card", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-3.5">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-sm font-semibold">{title}</h2>
          {meta ? <span className="truncate text-xs text-muted-foreground">· {meta}</span> : null}
        </div>
        {action}
      </div>
      <div className="flex-1 p-2.5">{children}</div>
    </section>
  );
}

function TypeTile({ type, className }) {
  const meta = TYPE_MAP[type] || TYPE_MAP.note;
  const Icon = meta.icon;
  return (
    <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", TYPE_CHIPS[type], className)}>
      <Icon className="size-4" />
    </span>
  );
}

function greeting() {
  return "Welcome back";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const { data, loading, error, refresh } = useApi(async () => {
    const [stats, recent, favorites, reminders, rediscover] = await Promise.all([
      dashboardService.stats(),
      dashboardService.recent(),
      dashboardService.favorites(),
      dashboardService.upcomingReminders(),
      dashboardService.rediscover(),
    ]);
    return { stats, recent, favorites, reminders, rediscover };
  }, []);

  async function handleFavorite(item) {
    try {
      await archiveService.toggleFavorite(item.id);
      toast.success(item.isFavorite ? "Removed from favorites" : "Saved to favorites");
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/archives?q=${encodeURIComponent(value)}` : "/archives");
  }

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title={
          <span className="inline-flex items-center gap-2">
            {greeting()}, {firstName}
            <Sparkles className="size-5 text-primary" />
          </span>
        }
        description="Your archive is ready. Recent additions, favorites and the things worth revisiting."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/archives">
                <Layers /> All archives
              </Link>
            </Button>
            <Button asChild>
              <Link href="/archives/new">
                <Plus /> Quick capture
              </Link>
            </Button>
          </>
        }
      />

      <form onSubmit={handleSearch} className="relative max-w-2xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search titles, notes, tags, links…"
          aria-label="Search your archive"
          className="h-12 w-full rounded-2xl border border-input bg-card/60 pl-11 pr-24 text-sm shadow-inner shadow-black/5 outline-none transition focus:ring-2 focus:ring-ring/40"
        />
        <Button type="submit" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2">
          Search
        </Button>
      </form>

      {error ? <ErrorState error={error} onRetry={refresh} /> : null}

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-28" />
            ))}
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-64" />
            ))}
          </div>
        </div>
      ) : null}

      {!loading && data ? (
        <>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <StatCard icon={Layers} label="Archived items" value={data.stats.totalItems} hint="Everything you have saved" href="/archives" />
            <StatCard icon={Bookmark} label="Favorites" value={data.stats.favorites} hint="Kept close" href="/favorites" />
            <StatCard icon={CalendarClock} label="Upcoming" value={data.stats.upcomingReminders} hint="Reminders ahead" href="/reminders" />
            <StatCard icon={FolderHeart} label="Collections" value={data.stats.collections} hint="Curated groups" href="/collections" />
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <Panel
              title="Recently saved"
              meta="Latest additions"
              className="xl:col-span-2"
              action={
                <Button asChild variant="ghost" size="sm">
                  <Link href="/archives">
                    View all <ArrowRight />
                  </Link>
                </Button>
              }
            >
              {data.recent.length ? (
                <div className="divide-y divide-border/50">
                  {data.recent.slice(0, 5).map((item) => (
                    <Link
                      key={item.id}
                      href={`/archives/${item.id}`}
                      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary/50"
                    >
                      <TypeTile type={item.type} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{item.title}</span>
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {(TYPE_MAP[item.type] || TYPE_MAP.note).label} · {relativeTime(item.createdAt)}
                          {item.category ? ` · ${item.category.name}` : ""}
                        </span>
                      </span>
                      <span className="hidden shrink-0 text-[11px] text-muted-foreground sm:block">
                        {formatDate(item.createdAt)}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Your archive is waiting"
                  description="Save your first note, memory or link. It only takes a moment."
                  actionLabel="Capture something"
                  actionHref="/archives/new"
                />
              )}
            </Panel>

            <Panel
              title="Upcoming"
              meta="Reminders"
              action={
                <Button asChild variant="ghost" size="sm">
                  <Link href="/reminders" aria-label="Manage reminders">
                    <ArrowRight />
                  </Link>
                </Button>
              }
            >
              {data.reminders.length ? (
                <div className="space-y-1">
                  {data.reminders.slice(0, 5).map((reminder) => {
                    const date = new Date(reminder.remindAt);
                    return (
                      <div key={reminder.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-secondary/50">
                        <span className="flex size-9 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <span className="text-xs font-semibold leading-none">{date.getDate()}</span>
                          <span className="mt-0.5 text-[9px] uppercase leading-none">
                            {date.toLocaleString("en", { month: "short" })}
                          </span>
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm">{reminder.title}</span>
                          <span className="block truncate text-[11px] text-muted-foreground">
                            {formatDateTime(reminder.remindAt)}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">No upcoming reminders.</p>
              )}
            </Panel>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <Panel title="By type" meta="Your archive mix" className="xl:col-span-2">
              {data.stats.byType?.length ? (
                <div className="grid gap-1 sm:grid-cols-2">
                  {data.stats.byType.map((entry) => {
                    const meta = TYPE_MAP[entry.type] || TYPE_MAP.note;
                    const Icon = meta.icon;
                    return (
                      <Link
                        key={entry.type}
                        href={`/archives?type=${entry.type}`}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-secondary/50"
                      >
                        <span className={cn("flex size-9 items-center justify-center rounded-lg", TYPE_CHIPS[entry.type])}>
                          <Icon className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm">{meta.label}</span>
                        <Badge variant="success">{entry.count}</Badge>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">Nothing archived yet.</p>
              )}
            </Panel>

            <Panel
              title="Favorites"
              meta="Kept close"
              action={<Bookmark className="size-4 text-muted-foreground" />}
            >
              {data.favorites.length ? (
                <div className="space-y-1">
                  {data.favorites.slice(0, 5).map((item) => (
                    <Link
                      key={item.id}
                      href={`/archives/${item.id}`}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary/50"
                    >
                      <TypeTile type={item.type} />
                      <span className="min-w-0 flex-1 truncate text-sm">{item.title}</span>
                      <Bookmark className="size-3.5 shrink-0 fill-current text-primary" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">Favorite something to keep it here.</p>
              )}
            </Panel>
          </div>

          <section className="space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                  <Sparkles className="size-4 text-primary" /> Rediscover
                </h2>
                <p className="text-xs text-muted-foreground">Forgotten corners of your archive, surfaced again.</p>
              </div>
              <Badge variant="outline">
                <TrendingUp className="size-3" /> From your vault
              </Badge>
            </div>
            {data.rediscover.length ? (
              <ArchiveGrid items={data.rediscover} onFavorite={handleFavorite} compact />
            ) : (
              <EmptyState
                title="Nothing to rediscover yet"
                description="Once your archive has a few items, this shelf will bring older ones back."
                actionLabel="Add something"
                actionHref="/archives/new"
              />
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
