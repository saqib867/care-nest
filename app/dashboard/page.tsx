"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MockBooking } from "@/lib/mockData";
import { useDashboardAuth } from "@/app/hook/useDashboard";
import FamilyDashboard from "@/components/dashboard/FamilyDashboard";
import CaregiverDashboard from "@/components/dashboard/CaregiverDashboard";

function DashboardContent() {
  const searchParams = useSearchParams();
  const { role, authLoading, userName, bookings, setBookings } =
    useDashboardAuth();
  console.log("role =>", role);

  // Handle demo-mode new booking parameter
  useEffect(() => {
    if (authLoading) return;
    const hasNewBooking = searchParams.get("newBooking") === "true";
    if (hasNewBooking) {
      const cgName = searchParams.get("cgName") || "Caregiver Partner";
      const date = searchParams.get("date") || "2026-08-05";
      const total = Number(searchParams.get("total") || 180);
      const hours = Number(searchParams.get("hours") || 4);

      const duplicate = bookings.some((b) => b.id === "bk-new");
      if (!duplicate) {
        const newBk: MockBooking = {
          id: "bk-new",
          caregiverId: "cg-1",
          caregiverName: cgName,
          caregiverAvatar:
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
          familyId: "fam-1",
          familyName: userName || "The Mueller Family",
          startTime: "09:00",
          endTime: `${9 + hours}:00`,
          hourlyRate: 45,
          commissionFee: total * 0.15,
          totalAmount: total,
          status: "PENDING",
          paymentStatus: "PAID",
          dateString: date,
        };
        setBookings((prev) => [newBk, ...prev]);
      }
    }
  }, [searchParams, authLoading, userName, bookings, setBookings]);

  return role === "family" ? <FamilyDashboard /> : <CaregiverDashboard />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
