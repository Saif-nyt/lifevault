"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const current = await authService.me();
      setUser(current);
      return current;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    function handleUnauthorized() {
      setUser(null);
    }
    window.addEventListener("lifevault:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("lifevault:unauthorized", handleUnauthorized);
  }, []);

  async function login(payload) {
    const current = await authService.login(payload);
    setUser(current);
    return current;
  }

  async function register(payload) {
    const current = await authService.register(payload);
    setUser(current);
    return current;
  }

  async function logout() {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
