"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getProfileProgress } from "@/app/actions/auth";
import { Heart, Mail, CheckCircle2, Loader2, RefreshCw, ShieldCheck, LogOut, ArrowRight } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState<string>(paramEmail);
  const [checking, setChecking] = useState<boolean>(true);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkVerificationStatus() {
      try {
        if (isMounted) setChecking(true);

        // 1. Force refresh session to get latest user token & email_confirmed_at status from Supabase
        const { data: refreshData } = await supabase.auth.refreshSession();
        const user = refreshData?.session?.user || (await supabase.auth.getUser()).data.user;

        if (user) {
          if (isMounted && user.email) setEmail(user.email);

          const isVerified = Boolean(user.email_confirmed_at || (user as any).confirmed_at);

          if (isVerified) {
            // User email is verified! Fetch onboarding profile progress
            const progress = await getProfileProgress(user.id);
            if (progress.success && progress.role) {
              const stepsVal = progress.stepsCompleted || 0;
              if (stepsVal >= 3) {
                // Onboarding complete -> redirect to dashboard
                const redirectRole = progress.role === "FAMILY" ? "family" : "caregiver";
                router.replace(`/dashboard?role=${redirectRole}`);
              } else {
                // Onboarding incomplete -> redirect to stepper to finish profile
                router.replace("/auth/signup");
              }
            } else {
              router.replace("/auth/signup");
            }
            return;
          }
        }
      } catch (err) {
        console.error("Error checking verification status:", err);
      } finally {
        if (isMounted) setChecking(false);
      }
    }

    checkVerificationStatus();

    // Check verification status automatically when user switches back to this window/tab
    const handleFocus = () => checkVerificationStatus();
    window.addEventListener("focus", handleFocus);

    // Listen to Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const isVerified = Boolean(session.user.email_confirmed_at || (session.user as any).confirmed_at);
        if (isVerified) {
          checkVerificationStatus();
        }
      }
    });

    return () => {
      isMounted = false;
      window.removeEventListener("focus", handleFocus);
      subscription.unsubscribe();
    };
  }, [router]);

  // Resend verification email
  const handleResendEmail = async () => {
    const targetEmail = email.trim();
    if (!targetEmail) {
      setStatusMessage({
        type: "error",
        text: "Please provide a valid email address to resend the verification link.",
      });
      return;
    }

    setIsResending(true);
    setStatusMessage(null);

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: targetEmail,
      });

      if (error) {
        setStatusMessage({
          type: "error",
          text: error.message || "Failed to resend verification email.",
        });
      } else {
        setStatusMessage({
          type: "success",
          text: `Verification email resent to ${targetEmail}! Please check your inbox and spam folder.`,
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Failed to resend verification email.",
      });
    } finally {
      setIsResending(false);
    }
  };

  // Sign out to register with another account
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/auth/signin");
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 text-primary animate-spin" />
          <p className="text-sm font-semibold text-gray-500 animate-pulse">
            Checking verification status...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between p-4 sm:p-6 font-sans text-gray-900 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5">
      {/* Brand Header */}
      <header className="max-w-xl w-full mx-auto flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white group-hover:scale-105 transition-transform shadow-sm">
            <Heart className="size-4.5 fill-current" />
          </div>
          <span className="text-lg font-bold tracking-tight text-primary">
            Care<span className="text-secondary font-semibold">Nest</span>
          </span>
        </Link>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-red-600 transition-colors"
        >
          <LogOut className="size-3.5" />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Main Verification Card */}
      <main className="max-w-xl w-full mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30 p-6 sm:p-10 my-4 space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="mx-auto size-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center shadow-inner relative">
          <Mail className="size-8" />
          <span className="absolute -top-1 -right-1 size-5 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center animate-bounce">
            !
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Verify Your Email Address
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
            We have sent a verification link to{" "}
            <span className="font-bold text-gray-900 underline decoration-primary decoration-2">
              {email || "your email account"}
            </span>
            . Please check your inbox and verify your email to continue your CareNest setup.
          </p>
        </div>

        {/* Status Message Alert */}
        {statusMessage && (
          <div
            className={`p-4 rounded-2xl text-xs font-semibold text-left transition-all border ${
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : statusMessage.type === "error"
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Primary Action Button */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleResendEmail}
            disabled={isResending}
            className="w-full h-12 bg-primary text-white font-extrabold text-xs rounded-2xl hover:bg-primary/95 transition-all shadow-md shadow-primary/15 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
          >
            {isResending ? (
              <>
                <Loader2 className="size-4 animate-spin text-white" />
                <span>Resending Verification Email...</span>
              </>
            ) : (
              <>
                <RefreshCw className="size-4 text-white" />
                <span>Resend Verification Email</span>
              </>
            )}
          </button>
        </div>

        {/* Helper Note */}
        <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1">
          <p>Did not receive the email? Check your Spam / Junk folder.</p>
          <p>
            Wrong email address?{" "}
            <button
              type="button"
              onClick={handleSignOut}
              className="font-bold text-primary hover:underline"
            >
              Sign up with a different email
            </button>
          </p>
        </div>
      </main>

      {/* GDPR Footer */}
      <footer className="max-w-xl w-full mx-auto text-center text-[10px] text-gray-400 space-y-2 py-4">
        <p className="flex justify-center items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-secondary" />
          CareNest Security &bull; Encrypted Sessions
        </p>
      </footer>
    </div>
  );
}
