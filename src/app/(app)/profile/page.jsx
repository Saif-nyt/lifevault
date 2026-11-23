"use client";

import Link from "next/link";
import { CalendarClock, FolderHeart, Layers, LogOut, Pencil, Settings, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/use-api";
import { useAuth } from "@/context/auth-context";
import { dashboardService } from "@/services/dashboard.service";
import { formatDate, initials } from "@/lib/utils";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { data, loading } = useApi(() => dashboardService.stats(), []);

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Your account"
        title="Profile"
        description="A small overview of you and the shape of your archive."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/settings">
                <Settings /> Settings
              </Link>
            </Button>
            <Button asChild>
              <Link href="/archives/new">
                <Sparkles /> New item
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <CardContent className="flex flex-col items-center px-6 py-10 text-center">
            <Avatar className="size-24">
              {user?.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
              <AvatarFallback className="text-2xl">{initials(user?.name)}</AvatarFallback>
            </Avatar>
            <h2 className="mt-4 font-display text-2xl font-semibold">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            {user?.bio ? <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">{user.bio}</p> : null}
            <Badge variant="outline" className="mt-4">
              Member since {formatDate(user?.createdAt)}
            </Badge>
            <div className="mt-5 flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/settings">
                  <Pencil /> Edit profile
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:text-destructive">
                <LogOut /> Log out
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">Your archive at a glance</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-20" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Layers, label: "Archived items", value: data?.totalItems ?? 0, href: "/archives" },
                    { icon: FolderHeart, label: "Favorites", value: data?.favorites ?? 0, href: "/favorites" },
                    { icon: CalendarClock, label: "Upcoming reminders", value: data?.upcomingReminders ?? 0, href: "/reminders" },
                    { icon: Sparkles, label: "Collections", value: data?.collections ?? 0, href: "/collections" },
                  ].map((stat) => (
                    <Link key={stat.label} href={stat.href} className="rounded-lg border border-border p-4 transition hover:bg-secondary/40">
                      <stat.icon className="size-4 text-muted-foreground" />
                      <p className="mt-2 font-display text-2xl font-semibold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">Account details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between gap-3 border-b border-border/60 pb-3">
                <span className="text-muted-foreground">Name</span>
                <span>{user?.name}</span>
              </div>
              <div className="flex justify-between gap-3 border-b border-border/60 pb-3">
                <span className="text-muted-foreground">Email</span>
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex justify-between gap-3 border-b border-border/60 pb-3">
                <span className="text-muted-foreground">Member since</span>
                <span>{formatDate(user?.createdAt)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Session</span>
                <span>Secure HTTP-only cookie</span>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-xl border border-border bg-sidebar p-5">
            <p className="font-display text-lg font-semibold">Rediscover your own life.</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              The archive gets more valuable the longer you keep it. Add one small thing today.
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/archives/new">Capture something</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
