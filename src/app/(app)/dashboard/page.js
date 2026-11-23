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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { useApi } from "@/hooks/use-api";
import { useAuth } from "@/context/auth-context";
import { dashboardService } from "@/services/dashboard.service";
import { archiveService } from "@/services/archive.service";
import { TYPE_MAP } from "@/lib/constants";
import { formatDateTime, relativeTime } from "@/lib/utils";

function StatCard({ icon: Icon, label, value, hint, href }) {
  const content = (
    <div className="flex items-start justify-between gap-2 rounded-xl border border-border bg-card p-4 transition hover:border-foreground/20 sm:p-5">
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:text-xs">{label}</p>
        <p className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{value ?? "—"}</p>
        {hint ? <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">{hint}</p> : null}
      </div>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary sm:size-9">
        <Icon className="size-4" />
      </span>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
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
    <div className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${firstName}`}
        description="Here is the shape of your archive today — recent additions, favorites and things worth revisiting."
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
          className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-24 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-ring/30"
        />
        <Button type="submit" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2">
          Search
        </Button>
      </form>

      {error ? <ErrorState error={error} onRetry={refresh} /> : null}

      {loading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-28" />
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-44" />
            ))}
          </div>
        </div>
      ) : null}

      {!loading && data ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <StatCard icon={Layers} label="Archived items" value={data.stats.totalItems} hint="Everything you have saved" href="/archives" />
            <StatCard icon={Bookmark} label="Favorites" value={data.stats.favorites} hint="Kept close" href="/favorites" />
            <StatCard icon={CalendarClock} label="Upcoming reminders" value={data.stats.upcomingReminders} hint="Coming up next" href="/reminders" />
            <StatCard icon={FolderHeart} label="Collections" value={data.stats.collections} hint="Curated groups" href="/collections" />
          </div>

          {data.stats.categories.length ? (
            <section className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-semibold">Your categories</h2>
                  <p className="text-xs text-muted-foreground">
                    A quick way back into each part of your archive — {data.stats.tags} tags in use.
                  </p>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/settings">
                    Manage <ArrowRight />
                  </Link>
                </Button>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {data.stats.categories.slice(0, 10).map((category) => (
                  <Link
                    key={category.id}
                    href={`/archives?category=${category.id}`}
                    className="group flex items-center gap-2.5 rounded-lg border border-border/70 px-3 py-2.5 transition hover:border-foreground/20 hover:bg-secondary/40"
                  >
                    <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="truncate text-sm">{category.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{category.itemCount}</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-semibold">Recently saved</h2>
                  <p className="text-xs text-muted-foreground">The latest additions to your vault.</p>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/archives">
                    View all <ArrowRight />
                  </Link>
                </Button>
              </div>
              {data.recent.length ? (
                <ArchiveGrid items={data.recent} onFavorite={handleFavorite} />
              ) : (
                <EmptyState
                  title="Your archive is waiting"
                  description="Save your first note, memory or link. It only takes a moment."
                  actionLabel="Capture something"
                  actionHref="/archives/new"
                />
              )}
            </section>

            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-display text-base">Favorites</CardTitle>
                    <Bookmark className="size-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {data.favorites.length ? (
                    data.favorites.slice(0, 4).map((item) => (
                      <Link
                        key={item.id}
                        href={`/archives/${item.id}`}
                        className="flex items-center gap-3 rounded-lg border border-border/60 p-2.5 transition hover:bg-secondary/40"
                      >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                          {(() => {
                            const Icon = (TYPE_MAP[item.type] || TYPE_MAP.note).icon;
                            return <Icon className="size-3.5" />;
                          })()}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm">{item.title}</span>
                          <span className="block text-[11px] text-muted-foreground">{item.type}</span>
                        </span>
                      </Link>
                    ))
                  ) : (
                    <p className="py-4 text-center text-sm text-muted-foreground">Favorite something to keep it here.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-display text-base">Upcoming reminders</CardTitle>
                    <CalendarClock className="size-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {data.reminders.length ? (
                    data.reminders.map((reminder) => (
                      <div key={reminder.id} className="rounded-lg border border-border/60 p-2.5">
                        <p className="truncate text-sm">{reminder.title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {formatDateTime(reminder.remindAt)} · {relativeTime(reminder.remindAt)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="py-4 text-center text-sm text-muted-foreground">No upcoming reminders.</p>
                  )}
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/reminders">Manage reminders</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <section className="space-y-4">
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
