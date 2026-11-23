"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export function GoogleSignInButton({ clientId, onSuccess }) {
  const CLIENT_ID =
    clientId ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const { googleLogin } = useAuth();
  const containerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!CLIENT_ID) return;
    if (window.google?.accounts?.id) {
      setReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!ready || !containerRef.current || !CLIENT_ID) return;
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: async (response) => {
        if (!response?.credential) return;
        setLoading(true);
        setError("");
        try {
          const user = await googleLogin(response.credential);
          onSuccess?.(user);
        } catch (err) {
          setError(err.message || "Google sign-in failed");
        } finally {
          setLoading(false);
        }
      },
    });
    window.google.accounts.id.renderButton(containerRef.current, {
      type: "standard",
      theme: "filled_black",
      size: "large",
      text: "continue_with",
      shape: "pill",
      width: 320,
    });
  }, [ready, googleLogin, onSuccess]);

  if (!CLIENT_ID) {
    return (
      <p className="text-center text-xs text-muted-foreground">
        Google sign-in is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-center overflow-hidden rounded-full">
        <div ref={containerRef} />
      </div>
      {loading ? (
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" /> Signing in…
        </div>
      ) : null}
      {error ? <p className="text-center text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
