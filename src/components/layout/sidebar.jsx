"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Archive,
  ChevronDown,
  LogOut,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Settings,
  Sparkles,
  Sun,
  User,
} from "lucide-react";
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
import { CATEGORY_TO_SECTION, NAV_ITEMS, SECTIONS, SUBSECTION_CATEGORY_NAMES, getSectionAccent } from "@/lib/constants";
import { useApi } from "@/hooks/use-api";
import { taxonomyService } from "@/services/taxonomy.service";
import { cn, initials } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "@/context/theme-context";
import { ReminderBell } from "./reminder-bell";
import { useSidebar } from "./sidebar-context";

const MAIN_NAV = NAV_ITEMS.filter((item) => item.href !== "/settings");
const SETTINGS_ITEM = NAV_ITEMS.find((item) => item.href === "/settings");

function subsectionHref(sectionId, subsectionId, categoryIdByName) {
  const categoryName = SUBSECTION_CATEGORY_NAMES[`${sectionId}:${subsectionId}`];
  const categoryId = categoryIdByName?.get((categoryName || "").toLowerCase());
  return categoryId ? `/archives?category=${categoryId}` : "/archives";
}

function isActive(pathname, href) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ item, active, collapsed, onNavigate }) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center rounded-2xl transition-all duration-200",
        collapsed ? "justify-center p-1.5" : "gap-3 px-2.5 py-2",
        active
          ? "bg-primary/15 text-primary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl transition-all",
          active
            ? "bg-primary/15 text-primary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]"
            : "group-hover:bg-secondary/70"
        )}
      >
        <item.icon className="size-[18px]" />
      </span>
      {!collapsed ? (
        <span className={cn("truncate text-sm", active ? "font-medium" : "font-normal")}>{item.label}</span>
      ) : null}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();
  const [openSections, setOpenSections] = useState(() => new Set([SECTIONS[0].id]));
  const { data: categories } = useApi(() => taxonomyService.categories(), []);

  const categoryIdByName = new Map((categories || []).map((category) => [category.name.toLowerCase(), category.id]));

  function toggleSection(id) {
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-border/50 bg-sidebar/65 backdrop-blur-2xl transition-[width] duration-200 lg:flex",
        collapsed ? "w-[76px]" : "w-64"
      )}
    >
      <div className={cn("flex border-b border-border/50 px-3", collapsed ? "flex-col items-center gap-1 py-3" : "h-16 items-center gap-2")}>
        <Link href="/dashboard" className={cn("flex min-w-0 items-center gap-2.5", collapsed && "justify-center")}>
          <span className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#5b34e8] text-white shadow-[0_10px_26px_-10px_var(--glow)]">
            <Sparkles className="size-4" />
            <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
          </span>
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-base font-semibold leading-none">LifeVault</span>
              <span className="mt-1 block truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Personal archive
              </span>
            </span>
          ) : null}
        </Link>
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground",
            collapsed ? "size-7" : "ml-auto size-8"
          )}
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
      </div>

      <nav className={cn("flex-1 overflow-y-auto py-3", collapsed ? "space-y-1 px-2" : "space-y-0.5 px-3")}>
        {!collapsed ? (
          <div className="space-y-0.5 pb-2">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const open = openSections.has(section.id);
              const accent = getSectionAccent(section.id);
              if (collapsed) {
                return (
                  <div key={section.id} className="flex justify-center rounded-2xl">
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      aria-expanded={open}
                      aria-label={section.label}
                      title={section.label}
                      className={cn(
                        "flex size-10 items-center justify-center rounded-2xl transition-colors",
                        open ? "bg-secondary/60" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                      )}
                      style={accent ? { color: open ? accent.hex : undefined } : undefined}
                    >
                      <Icon className="size-5" style={accent ? { color: open ? accent.hex : undefined } : undefined} />
                    </button>
                  </div>
                );
              }
              return (
                <div key={section.id} className="rounded-2xl">
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    aria-expanded={open}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-2xl px-2.5 py-2 text-left text-sm transition-colors",
                      open ? "bg-secondary/60" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                    style={accent ? { color: open ? accent.hex : undefined } : undefined}
                  >
                    <Icon className="size-4 shrink-0" style={accent ? { color: open ? accent.hex : undefined } : undefined} />
                    <span className="min-w-0 flex-1 truncate font-medium">{section.label}</span>
                    <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")} />
                  </button>
                  {open ? (
                    <div className="mt-0.5 ml-3 space-y-0.5 border-l border-border/60 pl-2">
                      {section.subsections.map((sub) => (
                        <Link
                          key={sub.id}
                          href={subsectionHref(section.id, sub.id, categoryIdByName)}
                          title={sub.label}
                          className="flex items-center rounded-xl px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
        {MAIN_NAV.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(pathname, item.href)}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className={cn("border-t border-border/50", collapsed ? "space-y-2 p-2" : "space-y-2 p-3")}>
        <Button asChild size={collapsed ? "icon" : "default"} className={cn(!collapsed && "w-full justify-start")}>
          <Link href="/archives/new" title={collapsed ? "Quick capture" : undefined}>
            <Plus />
            {!collapsed ? "Quick capture" : null}
          </Link>
        </Button>
        {SETTINGS_ITEM ? (
          <NavLink item={SETTINGS_ITEM} active={isActive(pathname, SETTINGS_ITEM.href)} collapsed={collapsed} />
        ) : null}
        {!collapsed ? (
          <p className="px-2 pt-1 text-[11px] leading-relaxed text-muted-foreground">
            Capture anything. Organize lightly. Rediscover often.
          </p>
        ) : null}
      </div>
    </aside>
  );
}

export function Topbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    function onKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape" && document.activeElement === searchRef.current) {
        searchRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
    <header className="sticky top-0 z-30 border-b border-border/50 bg-background/60 backdrop-blur-2xl">
      <div className="flex h-16 items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="mr-1 flex items-center gap-2 lg:hidden">
          <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#5b34e8] text-white shadow-[0_10px_24px_-12px_var(--glow)]">
            <Sparkles className="size-4" />
          </span>
          <span className="text-base font-semibold">LifeVault</span>
        </Link>

        <form onSubmit={handleSearch} className="relative hidden flex-1 max-w-md md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search your archive…"
            aria-label="Search your archive"
            className="glass-control h-11 w-full rounded-2xl pl-11 pr-16 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring/40"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-card/60 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
            ⌘K
          </kbd>
        </form>

        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
          <Button asChild variant="ghost" size="icon" className="md:hidden" aria-label="Search archive">
            <Link href="/archives">
              <Search />
            </Link>
          </Button>
          <Button asChild size="sm" className="hidden md:inline-flex">
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
              <button
                className="ml-0.5 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Account menu"
              >
                <Avatar className="ring-1 ring-border/80">
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
              <DropdownMenuItem onSelect={() => router.push("/dashboard")}>
                <Archive /> Dashboard
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
