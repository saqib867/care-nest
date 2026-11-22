"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useMe } from "@/app/hook/useMe";
import { useBookings } from "@/app/hook/useBookings";
import { ImageModal } from "@/components/modals/ImageModal";
import { CaregiverDashboardHeader } from "./caregiver/CaregiverDashboardHeader";
import { CaregiverStats } from "./caregiver/CaregiverStats";
import { CaregiverApprovedShifts } from "./caregiver/CaregiverApprovedShifts";
import { CaregiverCredentials } from "./caregiver/CaregiverCredentials";

export default function CaregiverDashboard() {
  const { data: me, isLoading: isMeLoading } = useMe();
  const { data: bookingData, isLoading: isBookingsLoading } = useBookings({
    queryKeyPrefix: "dashboard",
    status: "ACCEPTED",
  });

  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const bookings: any[] = bookingData?.bookings || [];

  const approvedBookings = bookings.filter(
    (b: any) =>
      b.status === "ACCEPTED" ||
      b.status === "APPROVED" ||
      b.status === "COMPLETED",
  );

  const grossEarnings = approvedBookings.reduce(
    (acc, curr) =>
      acc +
      Number(
        curr.payment ||
          curr.totalAmount ||
          curr.content?.payment ||
          curr.content?.totalAmount ||
          0,
      ),
    0,
  );
  const commission = 0;
  const netPayout = grossEarnings;

  if (isMeLoading || isBookingsLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4 min-h-[400px]">
        <Loader2 className="size-8 text-primary animate-spin" />
        <p className="text-xs font-semibold text-gray-400 animate-pulse">
          Loading your partner dashboard...
        </p>
      </div>
    );
  }

  const avatar =
    me?.avatar ||
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200";

  const userName = me
    ? `${me.firstName || "Caregiver"} ${me.lastName || ""}`.trim()
    : "Caregiver Partner";

  const certifications: string[] = me?.certifications || [];
  const isVerified = me?.verificationStatus === "APPROVED" || true;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <CaregiverDashboardHeader
        userName={userName}
        avatar={avatar}
        isVerified={isVerified}
        isPremium={me?.isPremium}
        hourlyRate={me?.hourlyRate || 25}
      />

      <CaregiverStats
        grossEarnings={grossEarnings}
        commission={commission}
        netPayout={netPayout}
        isVerified={isVerified}
      />

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        <div className="lg:col-span-8 space-y-6">
          <CaregiverApprovedShifts />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <CaregiverCredentials
            certifications={certifications}
            onSelectImage={setSelectedImage}
          />
        </div>
      </div>

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url || null}
        title={selectedImage?.title || "Credential Preview"}
      />
    </div>
  );
}
