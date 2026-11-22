"use client";

import { useSignupStore } from "@/components/signup/useSignupStore";
import { RoleStep } from "@/components/signup/RoleStep";
import { AccountStep } from "@/components/signup/AccountStep";
import { ServicesStep } from "@/components/signup/ServicesStep";
import { ProfileStep } from "@/components/signup/ProfileStep";
import { supabase } from "@/lib/supabase";
import { getProfileProgress } from "@/app/actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, ShieldCheck, Loader2 } from "lucide-react";

export default function SignupPage() {
  const store = useSignupStore();
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  // Resume onboarding session if user is already authenticated
  useEffect(() => {
    async function resumeOnboardingSession() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const isVerified = Boolean(user.email_confirmed_at || (user as any).confirmed_at);
          if (!isVerified) {
            router.push(`/auth/verify-email?email=${encodeURIComponent(user.email || "")}`);
            return;
          }

          const progress = await getProfileProgress(user.id);
          if (progress.success && progress.role) {
            const stepsVal = progress.stepsCompleted || 0;
            if (stepsVal < 3) {
              // Onboarding is incomplete: restore store fields and jump to correct step
              store.updateField("userId", user.id);
              store.setRole(progress.role);
              const nextUiStep = stepsVal === 1 ? 3 : 4;
              store.setStep(nextUiStep);
              
              if (progress.profile) {
                store.updateField("firstName", progress.profile.firstName || "");
                store.updateField("lastName", progress.profile.lastName || "");
                store.updateField("email", progress.profile.email || "");
                if (progress.role === "CAREGIVER") {
                  store.updateField("selectedServices", progress.profile.services || []);
                  store.updateField("selectedSpecializations", progress.profile.specializations || []);
                }
              }
            } else {
              // Onboarding is complete: redirect directly to their dashboard
              const redirectRole = progress.role === "FAMILY" ? "family" : "caregiver";
              router.push(`/dashboard?role=${redirectRole}`);
              return;
            }
          }
        }
      } catch (err) {
        console.error("Failed to restore onboarding session:", err);
      } finally {
        setCheckingSession(false);
      }
    }

    resumeOnboardingSession();
  }, []);

  // Caregiver has 3 inputs steps, Family has 2 inputs steps (excluding preliminary role selection)
  const totalSteps = store.role === "CAREGIVER" ? 3 : 2;
  const currentStep = store.step - 1;
  const progressPercent = Math.min((currentStep / totalSteps) * 100, 100);

  // Render current step dynamically
  const renderStep = () => {
    switch (store.step) {
      case 1:
        return <RoleStep />;
      case 2:
        return <AccountStep />;
      case 3:
        return store.role === "CAREGIVER" ? <ServicesStep /> : <ProfileStep />;
      case 4:
        return store.role === "CAREGIVER" ? <ProfileStep /> : null;
      default:
        return <RoleStep />;
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 text-primary animate-spin" />
          <p className="text-sm font-semibold text-gray-500 animate-pulse">
            Verifying your CareNest profile...
          </p>
        </div>
      </div>
    );
  }

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
          <span className="text-xs text-gray-400">Already registered?</span>
          <Link href="/auth/signin" className="text-xs font-bold text-primary hover:underline ml-1">
            Sign In
          </Link>
        </div>
      </header>

      {/* Onboarding Wizard Form Center */}
      <main className="max-w-xl w-full mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30 p-6 sm:p-10 my-4 space-y-8">
        
        {/* Progress Tracker */}
        {store.step > 1 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-gray-400 uppercase tracking-widest">Onboarding Progress</span>
              <span className="font-bold text-primary">Step {currentStep} of {totalSteps}</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Render Step Component */}
        {renderStep()}
      </main>

      {/* GDPR Info Footer */}
      <footer className="max-w-xl w-full mx-auto text-center text-[10px] text-gray-400 space-y-2 py-4">
        <p>
          By signing up, you agree to our Terms of Service and Privacy Guidelines.
        </p>
        <p className="flex justify-center items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-secondary" />
          GDPR compliant &bull; Encrypted sessions
        </p>
      </footer>
    </div>
  );
}
