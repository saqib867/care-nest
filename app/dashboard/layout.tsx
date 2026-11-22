"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useDashboardAuth } from '@/app/hook/useDashboard';
import { useMe } from '@/app/hook/useMe';
import { supabase } from "@/lib/supabase";
import Header from "@/components/dashboard/Header";
import ReviewModal from "@/components/dashboard/ReviewModal";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { authLoading, fetchDashboardData } = useDashboardAuth();

  // Pre-fetch and cache user profile via React Query as soon as dashboard opens
  useMe();

  useEffect(() => {
    async function checkVerificationAndLoad() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const isVerified = Boolean(user.email_confirmed_at || (user as any).confirmed_at);
          if (!isVerified) {
            router.replace(`/auth/verify-email?email=${encodeURIComponent(user.email || "")}`);
            return;
          }
        }
      } catch (err) {
        console.error("Dashboard auth check error:", err);
      }
      fetchDashboardData(router);
    }

    checkVerificationAndLoad();
  }, [router, fetchDashboardData]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 text-primary animate-spin" />
          <p className="text-sm font-semibold text-gray-500 animate-pulse">
            Verifying your dashboard session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900 flex flex-col">
      <Header />

      <main className="p-8 flex-1 max-w-7xl w-full mx-auto">
        {children}
      </main>

      <ReviewModal />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center font-sans">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-sm font-semibold text-gray-500">Loading dashboard portal...</p>
      </div>
    }>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
