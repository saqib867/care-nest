"use client";

import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Loader2,
  User,
  Home,
  Repeat,
  DollarSign,
} from "lucide-react";
import { useBookings } from "@/app/hook/useBookings";
import { format, parseISO, isValid } from "date-fns";

export function CaregiverApprovedShifts() {
  const { data: bookingData, isLoading: isBookingsLoading } = useBookings({
    queryKeyPrefix: "dashboard",
    status: "ACCEPTED",
    limit: 3,
  });

  const bookings: any[] = bookingData?.bookings || [];

  // Filter ONLY Approved / Accepted Bookings (max 3)
  const approvedBookings = bookings
    .filter(
      (b: any) =>
        b.status === "ACCEPTED" ||
        b.status === "APPROVED" ||
        b.status === "COMPLETED",
    )
    .slice(0, 3);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      const parsed = parseISO(dateStr);
      return isValid(parsed) ? format(parsed, "MMM d, yyyy") : dateStr;
    } catch {
      return dateStr;
    }
  };

  const formatTimeRange = (startStr: string, endStr: string) => {
    if (!startStr) return "";
    try {
      const startParsed = parseISO(startStr);
      const endParsed = parseISO(endStr);
      if (isValid(startParsed) && isValid(endParsed)) {
        return `${format(startParsed, "h:mm a")} - ${format(endParsed, "h:mm a")}`;
      }
    } catch {
      // fallback
    }
    return `${startStr} - ${endStr}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-gray-100/45 space-y-5">
      <div className="flex items-center justify-between border-b border-gray-50 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-extrabold text-lg flex items-center gap-2 text-primary">
            <Calendar className="size-5 text-primary" /> Approved Bookings & Shifts
          </h2>
          {bookingData?.totalCount !== undefined && (
            <span className="text-xs font-bold text-gray-400">
              ({bookingData.totalCount})
            </span>
          )}
        </div>
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-1 text-xs font-extrabold text-primary hover:text-primary/80 transition-colors cursor-pointer"
        >
          View all <ChevronRight className="size-3.5" />
        </Link>
      </div>

      {isBookingsLoading ? (
        <div className="flex flex-col items-center justify-center py-10 space-y-2">
          <Loader2 className="size-6 text-primary animate-spin" />
          <p className="text-xs font-semibold text-gray-400 animate-pulse">
            Loading approved shifts...
          </p>
        </div>
      ) : approvedBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-gray-200 rounded-2xl bg-slate-50/50 text-center">
          <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <Calendar className="size-6 text-slate-400" />
          </div>
          <p className="text-sm font-bold text-gray-800">
            No Approved Bookings Found
          </p>
          <p className="text-xs text-gray-400 max-w-sm mt-1">
            Once families confirm shift requests with you, your approved upcoming schedules and timesheets will be displayed here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvedBookings.map((bk: any) => {
            const familyObj = bk.FamilyProfile;
            const familyId = bk.careFaimlyId || familyObj?.id || "";
            const familyName = familyObj
              ? `${familyObj.firstName || "Care"} ${familyObj.lastName || "Family"}`.trim()
              : "Client Family";

            const content = typeof bk.content === "object" && bk.content !== null ? bk.content : {};
            const careTypeVal = bk.careType || content.careType || "One-time Care";
            const scheduleSummary = content.scheduleSummary || "";

            const combinedTypeCheck = `${careTypeVal} ${scheduleSummary}`.toLowerCase();
            let typeKind: "one-time" | "recurring" | "live-in" = "one-time";
            if (
              combinedTypeCheck.includes("recurring") ||
              combinedTypeCheck.includes("repeat") ||
              combinedTypeCheck.includes("repeating")
            ) {
              typeKind = "recurring";
            } else if (
              combinedTypeCheck.includes("live-in") ||
              combinedTypeCheck.includes("livein") ||
              combinedTypeCheck.includes("live in")
            ) {
              typeKind = "live-in";
            }

            const timing = content.timing || {};
            const shiftDate = timing.formattedStartDate || timing.startDate || timing.formattedDate || formatDate(bk.startTime || bk.createdAt);
            const timeRange = timing.formattedTime || timing.time || formatTimeRange(bk.startTime, bk.endTime);

            const payout = Number(
              bk.caregiverShare ||
              Number(bk.totalAmount || bk.payment || content.payment || 0) * 0.85 ||
              0
            );

            return (
              <div
                key={bk.id}
                className="border border-gray-200/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 bg-slate-50/50 hover:bg-white hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold shrink-0">
                      <User className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-primary transition-colors truncate">
                        Shift with {familyName}
                      </h3>
                      <p className="text-xs text-emerald-700 font-bold">
                        Net Payout: ${payout.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {typeKind === "one-time" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-extrabold bg-sky-50 text-sky-700 border border-sky-200/80">
                        <Calendar className="size-3.5 text-sky-600 shrink-0" />
                        One-time Care
                      </span>
                    )}
                    {typeKind === "recurring" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200/80">
                        <Repeat className="size-3.5 text-purple-600 shrink-0" />
                        Recurring Care
                      </span>
                    )}
                    {typeKind === "live-in" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-extrabold bg-amber-50 text-amber-800 border border-amber-200/80">
                        <Home className="size-3.5 text-amber-600 shrink-0" />
                        Live-in Care
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 shrink-0">
                      <CheckCircle2 className="size-3" /> Approved
                    </span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-gray-100 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                      <Calendar className="size-3 text-primary" /> Shift Schedule
                    </span>
                    <p className="font-extrabold text-gray-900 truncate">
                      {shiftDate}
                    </p>
                    {timeRange && (
                      <p className="text-[11px] text-gray-500 font-medium">
                        Time: {timeRange}
                      </p>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-gray-100 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                      <DollarSign className="size-3 text-emerald-600" /> Payout Summary
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-gray-900 text-sm">
                        ${payout.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">
                        (Total ${Number(bk.totalAmount || bk.payment || 0).toFixed(2)})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                  {familyId ? (
                    <Link
                      href={`/messages?userId=${familyId}&userName=${encodeURIComponent(
                        familyName,
                      )}`}
                      className="inline-flex h-9 px-3.5 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors gap-1.5 shadow-2xs"
                    >
                      <MessageSquare className="size-3.5 text-primary" /> Message Family
                    </Link>
                  ) : <div />}

                  <Link
                    href={`/dashboard/bookings/${bk.id}`}
                    className="inline-flex h-9 px-4 items-center justify-center rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-extrabold transition-all gap-1.5 shadow-xs active:scale-95 cursor-pointer"
                  >
                    View Booking Details <ChevronRight className="size-4" />
                  </Link>
                </div>
              </div>
            );
          })}

          <div className="pt-2 text-center">
            <Link
              href="/dashboard/bookings"
              className="inline-flex h-9 px-4 items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-extrabold transition-all border border-slate-200/80 gap-1.5 cursor-pointer"
            >
              View all bookings <ChevronRight className="size-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
