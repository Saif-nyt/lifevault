"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Archive, LogOut, Moon, Plus, Search, Settings, Sun, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAV_ITEMS } from "@/lib/constants";
import { cn, initials } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "@/context/theme-context";
import { ReminderBell } from "./reminder-bell";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-sidebar lg:flex">
      <div className="px-6 pb-6 pt-7">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Archive className="size-4" />
          </span>
          <span>
            <span className="block font-display text-lg font-semibold leading-none">LifeVault</span>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Personal archive</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-card font-medium text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-card/70 hover:text-foreground"
              )}
            >
              <item.icon className={cn("size-4", active && "text-primary")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-border p-4">
        <Button asChild className="w-full justify-start">
          <Link href="/archives/new">
            <Plus /> Quick capture
          </Link>
        </Button>
        <p className="px-1 text-[11px] leading-relaxed text-muted-foreground">
          Capture anything. Organize lightly. Rediscover often.
        </p>
      </div>
    </aside>
  );
}

export function Topbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");

  function handleSearch(event) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/archives?q=${encodeURIComponent(value)}` : "/archives");
  }

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="flex h-16 items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="mr-1 flex items-center gap-2 lg:hidden">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Archive className="size-4" />
          </span>
          <span className="font-display text-base font-semibold">LifeVault</span>
        </Link>

        <form onSubmit={handleSearch} className="relative hidden flex-1 max-w-md md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search your archive…"
            className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-14 text-sm outline-none transition focus:ring-2 focus:ring-ring/30"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
            Enter
          </kbd>
        </form>

        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
          <Button asChild size="sm" className="md:hidden">
            <Link href="/archives/new">
              <Plus /> Capture
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
            <Link href="/archives/new">
              <Plus /> Capture
            </Link>
          </Button>
          <ReminderBell />
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-0.5 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" aria-label="Account menu">
                <Avatar>
                  {user?.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
                  <AvatarFallback>{initials(user?.name)}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <span className="block truncate text-sm font-medium text-foreground">{user?.name}</span>
                <span className="block truncate text-xs font-normal text-muted-foreground">{user?.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => router.push("/profile")}>
                <User /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push("/settings")}>
                <Settings /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
