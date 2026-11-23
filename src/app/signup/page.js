import { Suspense } from "react";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata = { title: "Create your vault" };

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SignupForm />
    </Suspense>
  );
}
