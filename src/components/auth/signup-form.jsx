"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { useAuth } from "@/context/auth-context";

const schema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
    email: z.string().trim().email("Enter a valid email"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[a-zA-Z]/, "Include at least one letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function SignupForm({ googleClientId }) {
  const router = useRouter();
  const { user, loading: authLoading, register: registerUser } = useAuth();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (!authLoading && user) router.replace("/dashboard");
  }, [authLoading, user, router]);

  async function onSubmit({ name, email, password }) {
    setServerError("");
    try {
      await registerUser({ name, email, password });
      router.replace("/dashboard");
    } catch (error) {
      setServerError(error.message || "Could not create your account");
    }
  }

  return (
    <AuthShell
      eyebrow="Begin your archive"
      title="Create your vault"
      subtitle="Ten starter categories, a dashboard and a quiet place for everything worth keeping."
      footer={
        <>
          Already have an archive?{" "}
          <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {serverError ? (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>{serverError}</p>
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" autoComplete="name" placeholder="Your name" {...register("name")} />
          {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />
          {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password ? <p className="text-xs text-destructive">{errors.password.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" type="password" autoComplete="new-password" placeholder="Repeat your password" {...register("confirmPassword")} />
          {errors.confirmPassword ? <p className="text-xs text-destructive">{errors.confirmPassword.message}</p> : null}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : null}
          Create my vault
        </Button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/60" /></div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="bg-popover px-2">or</span>
          </div>
        </div>

        <GoogleSignInButton clientId={googleClientId} onSuccess={() => router.replace("/dashboard")} />

        <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
          Your password is hashed on the server. Sessions are kept in secure, HTTP-only cookies.
        </p>
      </form>
    </AuthShell>
  );
}
