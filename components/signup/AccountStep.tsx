"use client";

import { useSignupStore } from "./useSignupStore";
import { createInitialProfile } from "@/app/actions/auth";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function AccountStep() {
  const store = useSignupStore();
  const router = useRouter();
  const [password, setLocalPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!store.email.trim() || !store.firstName.trim() || !store.lastName.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setIsPending(true);

      // 1. Sign up client-side to automatically establish session on the client browser
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: store.email,
        password: password,
        options: {
          data: {
            firstName: store.firstName,
            lastName: store.lastName,
            role: store.role,
          }
        }
      });

      if (authError || !authData.user) {
        setError(authError?.message || "Registration with Supabase Auth failed.");
        setIsPending(false);
        return;
      }

      // 2. Initialize the profile in the database
      const response = await createInitialProfile(
        authData.user.id,
        store.email,
        store.firstName,
        store.lastName,
        store.role
      );

      if (!response.success) {
        setError(response.error || "Failed to create profile record.");
        setIsPending(false);
        return;
      }

      // Save password and userId in Zustand store
      store.updateField("password", password);
      store.updateField("userId", authData.user.id);

      // 3. Check if email is verified
      const isVerified = Boolean(authData.user.email_confirmed_at || (authData.user as any).confirmed_at);

      if (!isVerified) {
        // Stop stepper and redirect to verify email page
        router.push(`/auth/verify-email?email=${encodeURIComponent(store.email)}`);
      } else {
        store.nextStep();
      }
    } catch (err: any) {
      console.error("AccountStep registration error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleNext} className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Create Account Credentials</h2>
        <p className="text-sm text-gray-500">
          Enter your name and details to set up secure access.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* First Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">First Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
            <input
              type="text"
              required
              disabled={isPending}
              placeholder="Emma"
              value={store.firstName}
              onChange={(e) => store.updateField("firstName", e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all disabled:opacity-55"
            />
          </div>
        </div>

        {/* Last Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Last Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
            <input
              type="text"
              required
              disabled={isPending}
              placeholder="Smith"
              value={store.lastName}
              onChange={(e) => store.updateField("lastName", e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all disabled:opacity-55"
            />
          </div>
        </div>
      </div>

      {/* Email Address */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
          <input
            type="email"
            required
            disabled={isPending}
            placeholder="emma@example.com"
            value={store.email}
            onChange={(e) => store.updateField("email", e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all disabled:opacity-55"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
          <input
            type="password"
            required
            disabled={isPending}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setLocalPassword(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all disabled:opacity-55"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full h-11 bg-primary text-white font-semibold rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/10 mt-2 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-80"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Registering User...</span>
          </>
        ) : (
          <span>Continue Onboarding</span>
        )}
      </button>
    </form>
  );
}
