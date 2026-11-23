"use client";

import { Sidebar, Topbar } from "@/components/layout/sidebar";
import { AuthGuard, MobileNav } from "@/components/layout/mobile-nav";

export function AppShell({ children }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="lg:pl-64">
          <Topbar />
          <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-12">
            {children}
          </main>
        </div>
        <MobileNav />
      </div>
    </AuthGuard>
  );
}
