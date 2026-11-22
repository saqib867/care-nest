"use client";

import { useDashboardAuth } from '@/app/hook/useDashboard';
import FamilyHelp from "@/components/dashboard/FamilyHelp";

export default function HelpPage() {
  const { role } = useDashboardAuth();

  if (role !== "family") {
    return (
      <div className="text-center py-12 text-sm text-gray-500">
        This page is only accessible for Family profiles.
      </div>
    );
  }

  return <FamilyHelp />;
}
