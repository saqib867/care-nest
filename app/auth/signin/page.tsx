"use client";

import { getProfileProgress } from "@/app/actions/auth";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Heart, Mail, Lock, Loader2, ShieldCheck } from "lucide-react";

export default function SigninPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    startTransition(async () => {
      try {
        // 1. Sign in client-side to set browser session cookie and storage tokens
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError || !authData.user) {
          if (
            authError?.message?.toLowerCase().includes("email not confirmed") ||
            authError?.message?.toLowerCase().includes("verification")
          ) {
            router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
            return;
          }
          setError(authError?.message || "Invalid email or password.");
          return;
        }

        // 2. Check if email is verified
        const isVerified = Boolean(authData.user.email_confirmed_at || (authData.user as any).confirmed_at);
        if (!isVerified) {
          router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
          return;
        }

        // 3. Fetch progressive onboarding status from database
        const progress = await getProfileProgress(authData.user.id);
        if (progress.success && progress.role) {
          const stepsVal = progress.stepsCompleted || 0;
          if (stepsVal < 3) {
            router.push("/auth/signup");
          } else {
            // Onboarding completed: redirect to dashboard
            const redirectRole = progress.role === "FAMILY" ? "family" : "caregiver";
            router.push(`/dashboard?role=${redirectRole}`);
          }
        } else {
          setError(progress.error || "No matching profile record found for this user.");
        }
      } catch (err: any) {
        console.error("Login submission error:", err);
        setError(err.message || "An unexpected error occurred.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between p-4 sm:p-6 font-sans text-gray-900 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5">
      {/* Centered Brand Header */}
      <header className="max-w-xl w-full mx-auto flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white group-hover:scale-105 transition-transform shadow-sm">
            <Heart className="size-4.5 fill-current" />
          </div>
          <span className="text-lg font-bold tracking-tight text-primary">
            Care<span className="text-secondary font-semibold">Nest</span>
          </span>
        </Link>
        <div className="text-right">
          <span className="text-xs text-gray-400">New to CareNest?</span>
          <Link href="/auth/signup" className="text-xs font-bold text-primary hover:underline ml-1">
            Register
          </Link>
        </div>
      </header>

      {/* Main Sign In Form Card */}
      <main className="max-w-xl w-full mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30 p-6 sm:p-10 my-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-sm text-gray-500">
            Sign in to access your dashboard and manage shifts.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
              <input
                type="email"
                name="email"
                required
                disabled={isPending}
                placeholder="you@example.com"
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all disabled:opacity-55"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
              <a href="#" className="text-xs font-semibold text-primary hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
              <input
                type="password"
                name="password"
                required
                disabled={isPending}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all disabled:opacity-55"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-11 bg-primary text-white font-semibold rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/10 mt-4 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-80"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </main>

      {/* GDPR Info Footer */}
      <footer className="max-w-xl w-full mx-auto text-center text-[10px] text-gray-400 space-y-2 py-4">
        <p>
          By continuing, you verify compliance with local care guidelines.
        </p>
        <p className="flex justify-center items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-secondary" />
          GDPR compliant &bull; Encrypted sessions
        </p>
      </footer>
    </div>
  );
}
