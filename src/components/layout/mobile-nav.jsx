"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Archive, LogOut, MoreHorizontal, Plus, Search } from "lucide-react";
import { NAV_ITEMS, MOBILE_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <Link
        href="/archives/new"
        aria-label="Quick capture"
        className="fixed bottom-[calc(4.6rem+env(safe-area-inset-bottom))] right-4 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_18px_40px_-12px_var(--glow)] transition-transform active:scale-95 lg:hidden"
      >
        <Plus className="size-6" />
      </Link>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/50 bg-background/70 backdrop-blur-2xl lg:hidden">
        <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
          {MOBILE_NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl transition-colors",
                    active && "bg-primary/15"
                  )}
                >
                  <item.icon className="size-5" />
                </span>
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] transition-colors",
              moreOpen ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className={cn("flex size-9 items-center justify-center rounded-xl", moreOpen && "bg-primary/15")}>
              <MoreHorizontal className="size-5" />
            </span>
            More
          </button>
        </div>
      </nav>

      <Dialog open={moreOpen} onOpenChange={setMoreOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Everything in your vault</DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-secondary/50 p-3 backdrop-blur-md">
            <Avatar>
              {user?.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
              <AvatarFallback>{initials(user?.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              const value = new FormData(event.currentTarget).get("q");
              setMoreOpen(false);
              router.push(value ? `/archives?q=${encodeURIComponent(value)}` : "/archives");
            }}
            className="relative"
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              name="q"
              placeholder="Search your archive…"
              className="glass-control h-11 w-full rounded-2xl pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </form>

          <div className="grid grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl border border-border/70 px-3 py-2.5 text-sm transition-colors",
                    active ? "bg-primary/15 font-medium text-primary" : "bg-card/40 hover:bg-secondary/60"
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <Button asChild variant="outline">
            <Link href="/profile" onClick={() => setMoreOpen(false)}>
              <Archive /> Profile
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={async () => {
              await logout();
              setMoreOpen(false);
              router.replace("/");
            }}
          >
            <LogOut /> Log out
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?next=/dashboard");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <span className="flex size-10 animate-pulse items-center justify-center rounded-xl bg-primary/20 text-primary">
            <Archive className="size-5" />
          </span>
          <p className="text-xs uppercase tracking-[0.2em]">Opening your vault</p>
        </div>
      </div>
    );
  }

  if (!user) return null;
  return children;
}
