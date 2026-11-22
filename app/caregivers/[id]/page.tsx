"use client";

import { useState, useEffect, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { getCaregiverById } from "@/app/actions/search";
import { useModalStore } from "@/components/modals/useModalStore";
import { CaregiverHeroCard } from "@/components/caregivers/CaregiverHeroCard";
import { CaregiverTabs } from "@/components/caregivers/CaregiverTabs";
import { CaregiverAvailabilityCalendar } from "@/components/caregivers/CaregiverAvailabilityCalendar";
import { CaregiverBookingSidebar } from "@/components/caregivers/CaregiverBookingSidebar";
import Navbar from "@/components/landing/Navbar";

export default function CaregiverProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const caregiverId = resolvedParams.id;
  const { openModal } = useModalStore();

  const [cg, setCg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const res = await getCaregiverById(caregiverId);
        if (res.success) {
          setCg(res.caregiver);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [caregiverId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center font-sans">
        <Loader2 className="size-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground mt-3 animate-pulse">
          Retrieving caregiver credential profiles...
        </p>
      </div>
    );
  }

  if (!cg) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center font-sans">
        <h2 className="text-2xl font-bold text-foreground">
          Caregiver Profile Not Found
        </h2>
        <p className="text-muted-foreground mt-2">
          The caregiver you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/search"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/95 transition-colors"
        >
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Navbar />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Profile Card Hero */}
        <CaregiverHeroCard
          cg={cg}
          isFavorite={isFavorite}
          setIsFavorite={setIsFavorite}
        />

        {/* Profile Content and Booking Sidebar */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* LEFT: About Tabs & Availability */}
          <div className="lg:col-span-8 space-y-6">
            <Suspense
              fallback={
                <div className="h-48 bg-card rounded-2xl animate-pulse" />
              }
            >
              <CaregiverTabs cg={cg} />
            </Suspense>

            <CaregiverAvailabilityCalendar cg={cg} />
          </div>

          {/* RIGHT: Booking Checkout Console */}
          <CaregiverBookingSidebar cg={cg} openModal={openModal} />
        </div>
      </main>
    </div>
  );
}
