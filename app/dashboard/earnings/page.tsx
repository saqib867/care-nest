"use client";

import { useDashboardAuth } from '@/app/hook/useDashboard';
import CaregiverEarnings from "@/components/dashboard/CaregiverEarnings";

export default function EarningsPage() {
  const { role } = useDashboardAuth();

  if (role !== "caregiver") {
    return (
      <div className="text-center py-12 text-sm text-gray-500">
        This page is only accessible for Caregiver profiles.
      </div>
    );
  }

  return <CaregiverEarnings />;
}
