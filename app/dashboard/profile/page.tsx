"use client";

import { useDashboardAuth } from '@/app/hook/useDashboard';
import FamilyProfile from "@/components/dashboard/FamilyProfile";
import CaregiverProfile from "@/components/dashboard/CaregiverProfile";

export default function ProfilePage() {
  const { role } = useDashboardAuth();
  return role === "family" ? <FamilyProfile /> : <CaregiverProfile />;
}
