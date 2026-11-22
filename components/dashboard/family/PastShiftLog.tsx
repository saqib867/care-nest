"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Star,
  ChevronRight,
  User,
  Loader2,
} from "lucide-react";
import { useBookings } from "@/app/hook/useBookings";
import { useDashboardStore } from "@/app/hook/useDashboardStore";

export function PastShiftLog() {
  const { data, isLoading } = useBookings({ queryKeyPrefix: "dashboard" });
  const { setSelectedBookingId, setShowReviewModal } = useDashboardStore();

  const rawBookings = data?.bookings || [];

  const pastBookings = rawBookings.filter((bk: any) => {
    const status = (bk.status || "").toUpperCase();
    return status === "COMPLETED" || status === "DECLINED" || status === "CANCELLED";
  });

  const handleReview = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setShowReviewModal(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-gray-100/45 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 className="font-extrabold text-base flex items-center gap-2 text-primary">
          <ShieldCheck className="size-5" /> Past Shift Log
        </h2>
        <span className="text-xs font-bold text-gray-400">
          {pastBookings.length} History
        </span>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-2">
          <Loader2 className="size-6 text-primary animate-spin" />
          <p className="text-xs font-semibold text-gray-400 animate-pulse">
            Loading past shift log...
          </p>
        </div>
      ) : pastBookings.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-6">
          No previous shifts found in your log.
        </p>
      ) : (
        <div className="space-y-4">
          {pastBookings.map((bk: any) => {
            const content =
              typeof bk.content === "object" && bk.content !== null
                ? bk.content
                : {};
            const cg = bk.CaregiverProfile;

            const caregiverName =
              bk.caregiverName ||
              (cg ? `${cg.firstName || ""} ${cg.lastName || ""}`.trim() : "") ||
              "Caregiver Partner";

            const caregiverAvatar =
              bk.caregiverAvatar || cg?.avatar || null;

            const timing = content.timing || {};
            const dateString =
              bk.dateString ||
              timing.formattedDate ||
              timing.formattedStartDate ||
              content.formattedDate ||
              content.startDate ||
              bk.startTime ||
              "Completed Shift";

            const totalAmount = Number(
              bk.totalAmount ||
                bk.payment ||
                content.payment ||
                content.totalAmount ||
                0
            );

            const status = (bk.status || "COMPLETED").toUpperCase();

            return (
              <div
                key={bk.id}
                className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl overflow-hidden relative shrink-0 bg-gray-100 border flex items-center justify-center text-gray-400">
                    {caregiverAvatar ? (
                      <Image
                        src={caregiverAvatar}
                        alt={caregiverName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User className="size-6 text-gray-400" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-gray-900">
                      {caregiverName}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      Shift Date: <span className="font-bold text-gray-700">{dateString}</span>
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end gap-3 w-full sm:w-auto border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0 justify-between">
                  <div className="text-right">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                        status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1 font-semibold">
                      Total Paid: ${totalAmount.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {status === "COMPLETED" && (
                      <button
                        type="button"
                        onClick={() => handleReview(bk.id)}
                        className="inline-flex h-8 px-3 items-center justify-center rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/95 transition-colors gap-1 cursor-pointer"
                      >
                        <Star className="size-3.5 fill-current" /> Review
                      </button>
                    )}

                    <Link
                      href={`/dashboard/bookings/${bk.id}`}
                      className="inline-flex h-8 px-3 items-center justify-center rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors gap-1"
                    >
                      Details <ChevronRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
