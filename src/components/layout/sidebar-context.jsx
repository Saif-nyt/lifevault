"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "lifevault-sidebar-collapsed";

const SidebarContext = createContext({ collapsed: true, toggle: () => {} });

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== null) setCollapsed(stored === "1");
  }, []);

  function toggle() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }

  return <SidebarContext.Provider value={{ collapsed, toggle }}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  return useContext(SidebarContext);
}
