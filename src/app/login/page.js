import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LoginForm googleClientId={process.env.GOOGLE_CLIENT_ID} />
    </Suspense>
  );
}
