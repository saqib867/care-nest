"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  MapPin,
  Heart,
  DollarSign,
  Info,
  FileText,
  KeyRound,
  Car,
  Loader2,
  MessageSquare,
  Repeat,
  Home,
  AlertCircle,
  XCircle,
  ShieldCheck,
  Sparkles,
  CreditCard,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  format,
  parseISO,
  isValid,
  addDays,
  isBefore,
  isAfter,
  isSameDay,
} from "date-fns";
import {
  getBookingById,
  payOneTimeBooking,
  payRecurringWeek,
} from "@/app/actions/booking";
import { useDashboardAuth } from "@/app/hook/useDashboard";

// Helper function to calculate weekly schedule for Recurring Care & Live-in Care
function buildWeeklyPaymentSchedule({
  careTypeKind,
  startDateStr,
  endDateStr,
  moveInDateStr,
  customEndDateStr,
  stayDurationStr,
  days,
  estimatedDuration,
  hourlyRate,
  paidWeeks = [],
}: {
  careTypeKind?: "one-time" | "recurring" | "live-in";
  startDateStr?: string;
  endDateStr?: string;
  moveInDateStr?: string;
  customEndDateStr?: string;
  stayDurationStr?: string;
  days?: string[];
  estimatedDuration?: string;
  hourlyRate: number;
  paidWeeks: number[];
}) {
  try {
    let effectiveStartStr = startDateStr;
    let effectiveEndStr = endDateStr;
    let hoursPerDay = 4;
    let targetDayIndices: number[] = [1, 3, 5];

    if (careTypeKind === "live-in") {
      effectiveStartStr = moveInDateStr || startDateStr;
      effectiveEndStr = customEndDateStr || endDateStr;

      // Calculate end date from move-in date + stayDuration if not specified
      if (!effectiveEndStr && effectiveStartStr) {
        try {
          const match = String(stayDurationStr || "1 Month").match(/\d+/);
          const num = match ? Number(match[0]) : 1;
          const durationLower = String(stayDurationStr || "1 Month").toLowerCase();
          let stayDays = 30;
          if (durationLower.includes("week")) stayDays = num * 7;
          else if (durationLower.includes("month")) stayDays = num * 30;
          else if (durationLower.includes("year")) stayDays = num * 365;
          else stayDays = num;

          const startD = parseISO(effectiveStartStr);
          if (!isNaN(startD.getTime())) {
            const calculatedEndD = addDays(startD, Math.max(1, stayDays) - 1);
            effectiveEndStr = format(calculatedEndD, "yyyy-MM-dd");
          }
        } catch (e) {
          console.error("Error calculating live-in end date:", e);
        }
      }

      // Live-in care is 8 hours/day daily (7 days a week)
      hoursPerDay = 8;
      targetDayIndices = [0, 1, 2, 3, 4, 5, 6];
    } else {
      if (estimatedDuration) {
        const match = String(estimatedDuration).match(/\d+/);
        if (match) hoursPerDay = Number(match[0]);
      }

      const dayNameMap: Record<string, number> = {
        sun: 0,
        sunday: 0,
        mon: 1,
        monday: 1,
        tue: 2,
        tuesday: 2,
        wed: 3,
        wednesday: 3,
        thu: 4,
        thursday: 4,
        fri: 5,
        friday: 5,
        sat: 6,
        saturday: 6,
      };

      targetDayIndices =
        days && Array.isArray(days) && days.length > 0
          ? days
              .map((d) => dayNameMap[String(d).toLowerCase().trim()])
              .filter((idx) => idx !== undefined)
          : [1, 3, 5]; // Default Mon, Wed, Fri if empty
    }

    if (!effectiveStartStr || !effectiveEndStr) return [];

    const start = parseISO(effectiveStartStr);
    const end = parseISO(effectiveEndStr);

    if (
      isNaN(start.getTime()) ||
      isNaN(end.getTime()) ||
      isBefore(end, start)
    ) {
      return [];
    }

    let currentWeekStart = start;
    let weekIndex = 1;
    const now = new Date();
    const weeks: Array<{
      weekIndex: number;
      label: string;
      rangeStr: string;
      workDaysCount: number;
      weeklyHours: number;
      weeklyAmount: number;
      isDue: boolean;
      isPaid: boolean;
      startDate: Date;
      endDate: Date;
    }> = [];

    while (
      isBefore(currentWeekStart, end) ||
      isSameDay(currentWeekStart, end)
    ) {
      const currentWeekEnd = addDays(currentWeekStart, 6);
      const actualWeekEnd = isBefore(currentWeekEnd, end)
        ? currentWeekEnd
        : end;

      let workDaysCount = 0;
      let checkDate = currentWeekStart;
      while (
        isBefore(checkDate, actualWeekEnd) ||
        isSameDay(checkDate, actualWeekEnd)
      ) {
        if (targetDayIndices.includes(checkDate.getDay())) {
          workDaysCount++;
        }
        checkDate = addDays(checkDate, 1);
      }

      const weeklyHours = workDaysCount * hoursPerDay;
      const weeklyAmount = weeklyHours * hourlyRate;

      // Week is due ONLY if current date has reached or passed the week's start date
      const isDue =
        isAfter(now, currentWeekStart) || isSameDay(now, currentWeekStart);

      const isPaid = paidWeeks.includes(weekIndex);

      weeks.push({
        weekIndex,
        label: `Week ${weekIndex}`,
        rangeStr: `${format(currentWeekStart, "MMM d")} – ${format(actualWeekEnd, "MMM d, yyyy")}`,
        workDaysCount,
        weeklyHours,
        weeklyAmount,
        isDue,
        isPaid,
        startDate: currentWeekStart,
        endDate: actualWeekEnd,
      });

      currentWeekStart = addDays(currentWeekStart, 7);
      weekIndex++;
    }

    return weeks;
  } catch (err) {
    console.error("Error building weekly schedule:", err);
    return [];
  }
}

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const { userId, dbRole, me } = useDashboardAuth();
  const isCaregiver = dbRole === "CAREGIVER" || Boolean(me?.isCaregiver);

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [payingWeekIndex, setPayingWeekIndex] = useState<number | null>(null);
  const [payingOneTime, setPayingOneTime] = useState(false);
  const [showAllWeeks, setShowAllWeeks] = useState(false);

  useEffect(() => {
    if (!bookingId) return;

    let isMounted = true;
    async function loadBooking() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await getBookingById(bookingId);
        if (isMounted) {
          if (res.success && res.booking) {
            setBooking(res.booking);
          } else {
            setErrorMsg(res.error || "Booking not found.");
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorMsg(err.message || "Failed to load booking details.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadBooking();
    return () => {
      isMounted = false;
    };
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] space-y-3">
        <Loader2 className="size-8 text-primary animate-spin" />
        <p className="text-xs font-semibold text-slate-500 animate-pulse">
          Retrieving shift booking details...
        </p>
      </div>
    );
  }

  if (errorMsg || !booking) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6">
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="size-4" /> Back to Bookings
        </Link>
        <div className="bg-red-50 border border-red-200/80 rounded-3xl p-8 text-center space-y-3">
          <AlertCircle className="size-10 text-red-500 mx-auto" />
          <h2 className="text-lg font-extrabold text-slate-900">
            Booking Details Unavailable
          </h2>
          <p className="text-xs font-semibold text-red-600 max-w-md mx-auto">
            {errorMsg || "The requested booking could not be found."}
          </p>
          <Link
            href="/dashboard/bookings"
            className="inline-flex h-9 px-4 items-center justify-center rounded-xl bg-slate-900 text-white text-xs font-extrabold hover:bg-slate-800 transition-all shadow-sm"
          >
            Return to Bookings List
          </Link>
        </div>
      </div>
    );
  }

  const content =
    typeof booking.content === "object" && booking.content !== null
      ? booking.content
      : {};

  const partnerProfile = isCaregiver
    ? booking.FamilyProfile
    : booking.CaregiverProfile;

  const partnerName = partnerProfile
    ? `${partnerProfile.firstName || ""} ${partnerProfile.lastName || ""}`.trim()
    : isCaregiver
      ? "Client Family"
      : "Caregiver Partner";

  const partnerEmail = partnerProfile?.email || "";
  const partnerId = isCaregiver ? booking.careFaimlyId : booking.careGiverId;

  const careType = booking.careType || content.careType || "One-time Care";
  const estimatedDuration = content.estimatedDuration;
  const scheduleSummary = content.scheduleSummary;
  const recipient = content.recipient;
  const careNeeds: string[] = content.careNeeds || [];
  const location = content.location;
  const additionalInfo = content.additionalInfo;
  const personalMessage = content.personalMessage;

  const timing = content.timing || {
    date: content.date,
    time: content.time,
    startDate: content.startDate,
    endDate: content.endDate,
    days: content.days || content.recDays,
    moveInDate: content.moveInDate,
    stayDuration: content.stayDuration,
    formattedDate: content.formattedDate,
    formattedTime: content.formattedTime,
    formattedStartDate: content.formattedStartDate,
    formattedEndDate: content.formattedEndDate,
    formattedMoveInDate: content.formattedMoveInDate,
    duration: content.duration,
  };

  const status = booking.status || "PENDING";

  const hourlyRateVal = Number(
    content.hourlyRate ||
      booking.hourlyRate ||
      booking.CaregiverProfile?.hourlyRate ||
      30,
  );

  const totalAmount = Number(
    booking.payment ||
      booking.totalAmount ||
      content.payment ||
      content.totalAmount ||
      0,
  );
  const paidAmountVal = Number(
    booking.paid || content.paid || content.paidAmount || 0,
  );
  const commissionFee = 0;
  const netAmount = totalAmount;

  const isOneTimePaid = Boolean(content.isPaid || status === "COMPLETED");
  const paidWeeksList: number[] = Array.isArray(content.paidWeeks)
    ? content.paidWeeks
    : [];

  const formattedBookingDate = booking.created_at
    ? format(parseISO(booking.created_at), "EEEE, MMMM d, yyyy 'at' h:mm a")
    : "N/A";

  const combinedTypeCheck =
    `${careType} ${scheduleSummary || ""}`.toLowerCase();
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

  // Calculate Weekly Schedule Items (for Recurring & Live-in Care)
  const weeklyScheduleItems = buildWeeklyPaymentSchedule({
    careTypeKind: typeKind,
    startDateStr: timing.startDate || content.startDate,
    endDateStr: timing.endDate || content.endDate,
    moveInDateStr: timing.moveInDate || content.moveInDate,
    customEndDateStr: timing.customEndDate || content.customEndDate,
    stayDurationStr: timing.stayDuration || content.stayDuration,
    days: timing.days || content.days || content.recDays,
    estimatedDuration: timing.duration || content.estimatedDuration,
    hourlyRate: hourlyRateVal,
    paidWeeks: paidWeeksList,
  });

  const totalWeeklyScheduleAmount = weeklyScheduleItems.reduce(
    (acc, w) => acc + w.weeklyAmount,
    0,
  );
  const totalPaidWeeklyAmount = weeklyScheduleItems
    .filter((w) => w.isPaid)
    .reduce((acc, w) => acc + w.weeklyAmount, 0);

  const activeDueWeek =
    weeklyScheduleItems.find((w) => !w.isPaid && w.isDue) ||
    weeklyScheduleItems.find((w) => !w.isPaid) ||
    weeklyScheduleItems[0];

  // Action: Pay One-Time Booking
  const handlePayOneTime = async () => {
    if (payingOneTime) return;
    setPayingOneTime(true);
    try {
      const res = await payOneTimeBooking(booking.id);
      if (res.success) {
        setBooking((prev: any) => ({
          ...prev,
          status: "COMPLETED",
          paid: totalAmount,
          content: {
            ...prev.content,
            isPaid: true,
            paidAt: new Date().toISOString(),
            paid: totalAmount,
          },
        }));
      } else {
        alert(res.error || "Failed to process payment.");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred during payment.");
    } finally {
      setPayingOneTime(false);
    }
  };

  // Action: Pay Recurring Week
  const handlePayWeek = async (weekIndex: number, amount: number) => {
    if (payingWeekIndex !== null) return;
    setPayingWeekIndex(weekIndex);
    try {
      const res = await payRecurringWeek(booking.id, weekIndex, amount);
      if (res.success) {
        setBooking((prev: any) => {
          const currentContent = prev.content || {};
          const currentPaidWeeks: number[] = Array.isArray(
            currentContent.paidWeeks,
          )
            ? currentContent.paidWeeks
            : [];
          const updatedPaid =
            Number(prev.paid || currentContent.paidAmount || 0) + amount;
          return {
            ...prev,
            paid: updatedPaid,
            content: {
              ...currentContent,
              paidWeeks: [...currentPaidWeeks, weekIndex],
              paidAmount: updatedPaid,
              paid: updatedPaid,
            },
          };
        });
      } else {
        alert(res.error || "Failed to process weekly payment.");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred during payment.");
    } finally {
      setPayingWeekIndex(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <Link
            href="/dashboard/bookings"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-1"
          >
            <ChevronLeft className="size-4" /> Back to Bookings
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Shift Booking Details
            </h1>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider border ${
                status === "COMPLETED"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : status === "ACCEPTED" || status === "APPROVED"
                    ? "bg-teal-50 text-teal-700 border-teal-200"
                    : status === "PENDING"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {status === "COMPLETED" ||
              status === "ACCEPTED" ||
              status === "APPROVED" ? (
                <CheckCircle2 className="size-3.5" />
              ) : status === "PENDING" ? (
                <AlertCircle className="size-3.5" />
              ) : (
                <XCircle className="size-3.5" />
              )}
              {status}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Booking Reference ID:{" "}
            <span className="font-mono text-slate-700 font-bold">
              {booking.id}
            </span>{" "}
            • Requested on {formattedBookingDate}
          </p>
        </div>

        {/* Action Button */}
        {partnerId && (
          <Link
            href={`/dashboard/messages?userId=${partnerId}`}
            className="inline-flex h-10 px-4 items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-extrabold transition-all shadow-md active:scale-95 shrink-0"
          >
            <MessageSquare className="size-4" /> Message{" "}
            {isCaregiver ? "Family" : "Caregiver"}
          </Link>
        )}
      </div>

      {/* Main Grid Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Shift Schedule & Recipient Details (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category & Schedule Banner */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Shift Classification
              </span>
              {typeKind === "one-time" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold bg-sky-50 text-sky-700 border border-sky-200/80">
                  <Calendar className="size-3.5 text-sky-600 shrink-0" />
                  One-time Care
                </span>
              )}
              {typeKind === "recurring" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200/80">
                  <Repeat className="size-3.5 text-purple-600 shrink-0" />
                  Recurring Care
                </span>
              )}
              {typeKind === "live-in" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold bg-amber-50 text-amber-800 border border-amber-200/80">
                  <Home className="size-3.5 text-amber-600 shrink-0" />
                  Live-in Care
                </span>
              )}
            </div>

            {scheduleSummary ? (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-slate-50 border-l-4 border-l-primary border border-primary/20 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-xs">
                    <Clock className="size-4" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-primary">
                    Requested Schedule Summary
                  </span>
                </div>
                <p className="font-extrabold text-slate-900 text-base leading-relaxed pl-0.5">
                  {scheduleSummary}
                </p>
                {estimatedDuration && (
                  <p className="text-xs text-slate-500 font-semibold pl-0.5">
                    Estimated Duration: {estimatedDuration}
                  </p>
                )}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Calendar className="size-3.5 text-primary" /> Shift Date
                  </span>
                  <p className="font-extrabold text-slate-900 text-sm">
                    {timing.formattedDate || timing.date || "Scheduled Visit"}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Clock className="size-3.5 text-secondary" /> Time Window
                  </span>
                  <p className="font-extrabold text-slate-900 text-sm">
                    {timing.formattedTime || timing.time || "Full Day"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RECURRING & LIVE-IN CARE: CLEAN WEEKLY PAYMENT HIGHLIGHT CARD */}
          {(typeKind === "recurring" || typeKind === "live-in") && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`size-9 rounded-2xl flex items-center justify-center font-bold shadow-xs ${
                      typeKind === "live-in"
                        ? "bg-amber-500 text-white"
                        : "bg-purple-500 text-white"
                    }`}
                  >
                    {typeKind === "live-in" ? (
                      <Home className="size-4" />
                    ) : (
                      <CreditCard className="size-4" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Weekly Payment Plan
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Payments are unlocked week-by-week as schedule dates
                      arrive.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-xl border block ${
                      typeKind === "live-in"
                        ? "text-amber-800 bg-amber-50 border-amber-100"
                        : "text-purple-700 bg-purple-50 border-purple-100"
                    }`}
                  >
                    ${paidAmountVal.toFixed(2)} / ${totalAmount.toFixed(2)} Paid
                  </span>
                </div>
              </div>

              {/* PAYMENT & PAID COLUMN METRICS BREAKDOWN */}
              <div
                className={`grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl text-xs text-center border ${
                  typeKind === "live-in"
                    ? "bg-amber-50/50 border-amber-100/80"
                    : "bg-purple-50/50 border-purple-100/80"
                }`}
              >
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Total Contract Payment
                  </span>
                  <span className="text-base font-black text-slate-900">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Amount Paid So Far
                  </span>
                  <span className="text-base font-black text-emerald-600">
                    ${paidAmountVal.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Remaining Balance
                  </span>
                  <span
                    className={`text-base font-black ${
                      typeKind === "live-in"
                        ? "text-amber-800"
                        : "text-purple-700"
                    }`}
                  >
                    ${Math.max(0, totalAmount - paidAmountVal).toFixed(2)}
                  </span>
                </div>
              </div>

              {weeklyScheduleItems.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  Specify start date and stay duration to view weekly payment plan.
                </p>
              ) : (
                <div className="space-y-4">
                  {/* FEATURED ACTIVE / NEXT UPCOMING WEEK */}
                  {activeDueWeek && (
                    <div className="p-5 rounded-2xl bg-primary/10 shadow-md space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary px-2.5 py-0.5 rounded-md ">
                          {activeDueWeek.isPaid
                            ? "Completed Installment"
                            : activeDueWeek.isDue
                              ? "Active Installment Due Now"
                              : "Next Scheduled Installment"}
                        </span>
                        <span className="text-xs font-black ">
                          {activeDueWeek.label}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                        <div>
                          <h4 className="text-lg font-black tracking-tight">
                            {activeDueWeek.rangeStr}
                          </h4>
                          <p className="text-xs font-medium mt-0.5">
                            {activeDueWeek.workDaysCount} days (
                            {activeDueWeek.weeklyHours} hrs @ $
                            {hourlyRateVal.toFixed(2)}/hr)
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black block">
                            ${activeDueWeek.weeklyAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* FEATURED INSTALLMENT ACTION BUTTON */}
                      <div className="pt-3 border-t border-primary/20 flex items-center justify-between gap-3">
                        <div className="text-[11px] font-bold text-slate-600">
                          <span>Calculated Rate: </span>
                          <span className="font-extrabold text-slate-900">
                            {typeKind === "live-in" ? (
                              <>
                                {activeDueWeek.workDaysCount} days × 8 hrs × ${hourlyRateVal.toFixed(2)}/hr (${(hourlyRateVal * 8).toFixed(2)}/day)
                              </>
                            ) : (
                              <>
                                {activeDueWeek.workDaysCount} days ×{" "}
                                {activeDueWeek.weeklyHours /
                                  (activeDueWeek.workDaysCount || 1)}{" "}
                                hrs × ${hourlyRateVal.toFixed(2)}/hr
                              </>
                            )}
                          </span>
                        </div>

                        {activeDueWeek.isPaid ? (
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-sm">
                            <Check className="size-4" /> Installment Paid
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handlePayWeek(
                                activeDueWeek.weekIndex,
                                activeDueWeek.weeklyAmount,
                              )
                            }
                            disabled={
                              payingWeekIndex === activeDueWeek.weekIndex
                            }
                            className="inline-flex h-11 px-6 items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                          >
                            {payingWeekIndex === activeDueWeek.weekIndex ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <CreditCard className="size-4" />
                            )}
                            Pay {activeDueWeek.label} ($
                            {activeDueWeek.weeklyAmount.toFixed(2)})
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* COLLAPSIBLE ACCORDION TRIGGER */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAllWeeks(!showAllWeeks)}
                      className="w-full py-3 px-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 font-extrabold text-xs flex items-center justify-between transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>
                          View All {weeklyScheduleItems.length} Weekly
                          Installments
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          ({weeklyScheduleItems.filter((w) => w.isPaid).length}{" "}
                          paid)
                        </span>
                      </span>
                      {showAllWeeks ? (
                        <ChevronUp className="size-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="size-4 text-slate-500" />
                      )}
                    </button>

                    {/* EXPANDED WEEKLY LIST */}
                    {showAllWeeks && (
                      <div className="mt-3 space-y-2 max-h-[380px] overflow-y-auto pr-1">
                        {weeklyScheduleItems.map((item) => (
                          <div
                            key={item.weekIndex}
                            className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
                              item.isPaid
                                ? "bg-emerald-50/60 border-emerald-200"
                                : item.isDue
                                  ? typeKind === "live-in"
                                    ? "bg-white border-amber-200 shadow-2xs"
                                    : "bg-white border-purple-200 shadow-2xs"
                                  : "bg-slate-50/60 border-slate-100 opacity-75"
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2 font-bold text-slate-900">
                                <span>{item.label}:</span>
                                <span className="font-semibold text-slate-700">
                                  {item.rangeStr}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 font-medium">
                                {item.workDaysCount} days •{" "}
                                {typeKind === "live-in"
                                  ? `8 hrs/day ($${(hourlyRateVal * 8).toFixed(2)}/day)`
                                  : `$${hourlyRateVal.toFixed(2)}/hr`}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-extrabold text-slate-900">
                                ${item.weeklyAmount.toFixed(2)}
                              </span>

                              {item.isPaid ? (
                                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-extrabold text-[10px]">
                                  Paid
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handlePayWeek(
                                      item.weekIndex,
                                      item.weeklyAmount,
                                    )
                                  }
                                  disabled={payingWeekIndex === item.weekIndex}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] shadow-2xs cursor-pointer disabled:opacity-50"
                                >
                                  {payingWeekIndex === item.weekIndex ? (
                                    <Loader2 className="size-3 animate-spin inline" />
                                  ) : (
                                    `Pay ($${item.weeklyAmount.toFixed(2)})`
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Care Recipient Details */}
          {recipient && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Heart className="size-4 text-rose-500 fill-rose-500" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  Care Recipient Profile
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400 block">
                    Full Name
                  </span>
                  <p className="font-extrabold text-slate-900 text-sm">
                    {recipient.name || "Family Member"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Age & Gender
                  </span>
                  <p className="font-extrabold text-slate-900 text-sm">
                    {recipient.gender || "N/A"} • {recipient.age || "N/A"} years
                    old
                  </p>
                </div>
              </div>

              {recipient.relationship && (
                <div className="text-xs text-slate-600 font-medium">
                  Relationship to Family:{" "}
                  <span className="font-extrabold text-slate-900">
                    {recipient.relationship}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Care Requirements & Tasks */}
          {careNeeds.length > 0 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-primary" /> Requested Care
                Services & Tasks
              </span>
              <div className="flex flex-wrap gap-2">
                {careNeeds.map((need) => (
                  <span
                    key={need}
                    className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-primary/10 text-primary border border-primary/20"
                  >
                    {need}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Service Location */}
          {location && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-primary" /> Service Location &
                Entry Details
              </span>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <p className="font-extrabold text-slate-900 text-sm leading-snug">
                  {location.address}
                  {location.aptNumber ? `, Apt ${location.aptNumber}` : ""}
                  <br />
                  {location.city}, {location.postalCode}
                </p>

                {(location.parkingInfo || location.doorbellName) && (
                  <div className="pt-3 border-t border-slate-200/80 grid sm:grid-cols-2 gap-3 text-xs text-slate-700 font-semibold">
                    {location.parkingInfo && (
                      <span className="flex items-center gap-1.5">
                        <Car className="size-4 text-slate-400" />
                        Parking: {location.parkingInfo}
                      </span>
                    )}
                    {location.doorbellName && (
                      <span className="flex items-center gap-1.5">
                        <KeyRound className="size-4 text-slate-400" />
                        Doorbell / Buzzer: {location.doorbellName}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Special Instructions & Notes */}
          {(additionalInfo || personalMessage) && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="size-3.5 text-primary" /> Instructions &
                Personal Notes
              </span>
              <div className="p-4 rounded-2xl border-l-4 border-primary bg-slate-50 text-xs space-y-2 text-slate-800">
                {additionalInfo && (
                  <div>
                    <span className="font-extrabold block text-[10px] text-slate-400 uppercase tracking-wider">
                      Additional Instructions
                    </span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {additionalInfo}
                    </p>
                  </div>
                )}
                {personalMessage && (
                  <div>
                    <span className="font-extrabold block text-[10px] text-slate-400 uppercase tracking-wider">
                      Personal Message
                    </span>
                    <p className="italic text-slate-700 mt-0.5">
                      "{personalMessage}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Financial Summary & Partner Info (1 col) */}
        <div className="space-y-6">
          {/* Partner Info Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              {isCaregiver ? "Client Family Partner" : "Caregiver Partner"}
            </span>

            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-base shrink-0">
                {partnerName.charAt(0) || "U"}
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-slate-900 text-sm truncate">
                  {partnerName}
                </h4>
                {partnerEmail && (
                  <p className="text-xs text-slate-400 truncate">
                    {partnerEmail}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-flex border border-emerald-100">
                  <ShieldCheck className="size-3" /> Verified Partner
                </div>
              </div>
            </div>

            {partnerId && (
              <Link
                href={isCaregiver ? `#` : `/caregivers/${partnerId}`}
                className="w-full inline-flex h-9 items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all border border-slate-200/80"
              >
                View Profile Details
              </Link>
            )}
          </div>

          {/* Financial Breakdown Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <DollarSign className="size-5 text-emerald-600" />
              <h3 className="text-sm font-extrabold text-slate-900">
                Escrow & Payment Breakdown
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Agreed Hourly Rate</span>
                <span className="font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                  ${hourlyRateVal.toFixed(2)}/hr
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span>Total Amount Billed</span>
                <span className="font-bold text-slate-900">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-emerald-800 text-[11px] font-medium leading-relaxed">
                CareNest Escrow Protection secures your payment until shift completion.
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="font-extrabold text-slate-900">
                  {isCaregiver ? "Net Partner Payout" : "Total Escrow Charged"}
                </span>
                <span className="text-xl font-black text-primary">
                  ${(isCaregiver ? netAmount : totalAmount).toFixed(2)}
                </span>
              </div>

              {/* RECURRING & LIVE-IN CARE FINANCIAL SUMMARY */}
              {(typeKind === "recurring" || typeKind === "live-in") && (
                <div className="pt-3 space-y-2 border-t border-slate-100">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>
                      Paid So Far (
                      {weeklyScheduleItems.filter((w) => w.isPaid).length}/
                      {weeklyScheduleItems.length} Weeks)
                    </span>
                    <span className="font-bold text-emerald-600">
                      ${totalPaidWeeklyAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Remaining Contract Balance</span>
                    <span className="font-bold text-slate-900">
                      $
                      {Math.max(
                        0,
                        totalWeeklyScheduleAmount - totalPaidWeeklyAmount,
                      ).toFixed(2)}
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] font-extrabold text-slate-400">
                      <span>Weekly Payment Progress</span>
                      <span className="text-emerald-600 font-extrabold">
                        {totalWeeklyScheduleAmount > 0
                          ? Math.round(
                              (totalPaidWeeklyAmount /
                                totalWeeklyScheduleAmount) *
                                100,
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            totalWeeklyScheduleAmount > 0
                              ? Math.min(
                                  100,
                                  Math.round(
                                    (totalPaidWeeklyAmount /
                                      totalWeeklyScheduleAmount) *
                                      100,
                                  ),
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ONE-TIME CARE PAYMENT BUTTON */}
              {!isCaregiver && typeKind === "one-time" && (
                <div className="pt-2">
                  {isOneTimePaid ? (
                    <div className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-center font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs">
                      <CheckCircle2 className="size-4" /> Shift Paid ($
                      {totalAmount.toFixed(2)})
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePayOneTime}
                      disabled={payingOneTime}
                      className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      {payingOneTime ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <CreditCard className="size-4" />
                      )}
                      Pay Booking (${totalAmount.toFixed(2)})
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
