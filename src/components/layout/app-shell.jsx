"use client";

import { usePathname } from "next/navigation";
import { Sidebar, Topbar } from "@/components/layout/sidebar";
import { AuthGuard, MobileNav } from "@/components/layout/mobile-nav";
import { SidebarProvider, useSidebar } from "@/components/layout/sidebar-context";
import { cn } from "@/lib/utils";

function ShellInner({ children }) {
  const { collapsed } = useSidebar();
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className={cn("transition-[padding] duration-200", collapsed ? "lg:pl-[76px]" : "lg:pl-64")}>
        <Topbar />
        <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pb-12">
          <div key={pathname} className="animate-page">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

export function AppShell({ children }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <ShellInner>{children}</ShellInner>
      </SidebarProvider>
    </AuthGuard>
  );
}
