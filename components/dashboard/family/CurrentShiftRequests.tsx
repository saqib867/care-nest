"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MessageSquare,
  ChevronRight,
  User,
  Star,
  Loader2,
  Home,
  Repeat,
  DollarSign,
  Heart,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { format, parse, parseISO, isValid } from "date-fns";
import { useBookings } from "@/app/hook/useBookings";

const formatDateStr = (dateStr?: string, pattern = "MMM d, yyyy") => {
  if (!dateStr) return "";
  try {
    const parsed = parseISO(dateStr);
    return isValid(parsed) ? format(parsed, pattern) : dateStr;
  } catch {
    return dateStr;
  }
};

const formatTimeStr = (timeStr?: string) => {
  if (!timeStr) return "";
  try {
    const parsed = parse(timeStr, "HH:mm", new Date());
    return isValid(parsed) ? format(parsed, "h:mm a") : timeStr;
  } catch {
    return timeStr;
  }
};

export function CurrentShiftRequests() {
  const { data, isLoading, error } = useBookings({
    queryKeyPrefix: "dashboard",
    status: "ACCEPTED",
    limit: 3,
  });

  const rawBookings = data?.bookings || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-gray-100/45 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-extrabold text-base flex items-center gap-2 text-primary">
            <Calendar className="size-5" /> Current Shift Requests
          </h2>
        </div>

        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-1 text-xs font-extrabold text-primary hover:text-primary/80 transition-colors cursor-pointer"
        >
          View all <ChevronRight className="size-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-10 space-y-2">
          <Loader2 className="size-6 text-primary animate-spin" />
          <p className="text-xs font-semibold text-gray-400 animate-pulse">
            Loading active shift requests...
          </p>
        </div>
      ) : error ? (
        <p className="text-xs text-red-500 text-center py-4 font-medium">
          Failed to load shift requests.
        </p>
      ) : rawBookings.length === 0 ? (
        <div className="text-center py-8 space-y-2">
          <p className="text-xs text-gray-400">
            No active shift requests. Click "Find New Caregiver" above to
            schedule care.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rawBookings.map((bk: any) => {
            let content: any = {};
            if (typeof bk.content === "object" && bk.content !== null) {
              content = bk.content;
            } else if (typeof bk.content === "string") {
              try {
                content = JSON.parse(bk.content);
              } catch {
                content = {};
              }
            }

            const cg = bk.CaregiverProfile;

            const caregiverId =
              bk.caregiverId || bk.careGiverId || cg?.id || "";
            const caregiverName =
              bk.caregiverName ||
              (cg ? `${cg.firstName || ""} ${cg.lastName || ""}`.trim() : "") ||
              "Caregiver Partner";
            const caregiverAvatar = bk.caregiverAvatar || cg?.avatar || null;
            const hourlyRate =
              content.hourlyRate || bk.hourlyRate || cg?.hourlyRate || 30;
            const rating = cg?.rating || 4.9;

            const careTypeVal =
              bk.careType || content.careType || "One-time Care";
            const scheduleSummaryStr = content.scheduleSummary || "";

            const combinedTypeCheck =
              `${careTypeVal} ${scheduleSummaryStr}`.toLowerCase();
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

            const timing = content.timing || {
              date: content.date,
              time: content.time,
              startDate: content.startDate,
              endDate: content.endDate,
              days: content.days || content.recDays,
              moveInDate: content.moveInDate,
              stayDuration: content.stayDuration,
              customEndDate: content.customEndDate,
              formattedDate: content.formattedDate,
              formattedTime: content.formattedTime,
              formattedStartDate: content.formattedStartDate,
              formattedEndDate: content.formattedEndDate,
              formattedMoveInDate: content.formattedMoveInDate,
              duration: content.duration || content.estimatedDuration,
            };

            const recipient = content.recipient;

            const totalAmount = Number(
              bk.totalAmount ||
                bk.payment ||
                content.payment ||
                content.totalAmount ||
                0,
            );

            const status = (bk.status || "PENDING").toUpperCase();

            return (
              <div
                key={bk.id}
                className="border border-gray-100 rounded-2xl p-5 bg-gradient-to-br from-white to-gray-50/50 hover:border-primary/30 transition-all shadow-xs space-y-4 group"
              >
                {/* Top Section: Caregiver Info & Care Type */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="size-12 rounded-2xl overflow-hidden relative shrink-0 bg-gray-100 border border-gray-200 shadow-xs flex items-center justify-center font-bold text-gray-400">
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
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-primary transition-colors">
                          {caregiverName}
                        </h3>
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100">
                          <Star className="size-3 fill-amber-400 text-amber-400" />{" "}
                          {rating}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                        <span>ID: {bk.id?.slice(0, 8)}...</span>
                        {hourlyRate && (
                          <>
                            <span>•</span>
                            <span className="font-bold text-gray-700">
                              ${Number(hourlyRate).toFixed(2)}/hr
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
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
                  </div>
                </div>

                {/* Middle Section: Booking Schedule & Details (Matches Booking Page) */}
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  {/* Shift Schedule */}
                  <div className="p-3 rounded-xl bg-white border border-gray-100 space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                      <Calendar className="size-3 text-primary" /> Shift Schedule
                    </span>

                    {typeKind === "one-time" && (
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-gray-900 truncate">
                          {timing.formattedDate ||
                            formatDateStr(
                              timing.date || bk.startTime,
                              "EEE, MMM d, yyyy",
                            ) ||
                            content.scheduleSummary ||
                            "Single Shift"}
                        </p>
                        {(timing.formattedTime || formatTimeStr(timing.time) || bk.startTime) && (
                          <p className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                            <Clock className="size-3 text-gray-400 shrink-0" />
                            {timing.formattedTime ||
                              formatTimeStr(timing.time) ||
                              `${bk.startTime || "09:00"} - ${bk.endTime || "17:00"}`}
                            {(timing.duration || content.estimatedDuration) && (
                              <span className="text-gray-400">• ({timing.duration || content.estimatedDuration})</span>
                            )}
                          </p>
                        )}
                      </div>
                    )}

                    {typeKind === "recurring" && (
                      <div className="space-y-1">
                        <p className="font-extrabold text-gray-900 truncate">
                          {timing.formattedStartDate || timing.startDate || timing.formattedEndDate
                            ? `${
                                timing.formattedStartDate ||
                                formatDateStr(timing.startDate, "MMM d")
                              } – ${
                                timing.formattedEndDate ||
                                formatDateStr(timing.endDate, "MMM d, yyyy")
                              }`
                            : content.scheduleSummary || "Recurring Schedule"}
                        </p>
                        <div className="flex flex-wrap items-center gap-1 pt-0.5">
                          {timing.days && Array.isArray(timing.days) && timing.days.length > 0 ? (
                            timing.days.map((day: string) => (
                              <span
                                key={day}
                                className="px-1.5 py-0.5 text-[9px] font-extrabold bg-purple-100 text-purple-700 rounded-md border border-purple-200"
                              >
                                {day}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-purple-600 font-semibold">
                              Repeating
                            </span>
                          )}
                          {(timing.formattedTime || formatTimeStr(timing.time)) && (
                            <span className="text-[10px] font-semibold text-gray-500 ml-1">
                              @ {timing.formattedTime || formatTimeStr(timing.time)}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {typeKind === "live-in" && (
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-gray-900 truncate">
                          {timing.formattedMoveInDate || timing.moveInDate
                            ? `Moves in ${
                                timing.formattedMoveInDate ||
                                formatDateStr(
                                  timing.moveInDate,
                                  "EEE, MMM d, yyyy",
                                )
                              }`
                            : content.scheduleSummary || "Live-in Care"}
                        </p>
                        <p className="text-[11px] text-amber-700 font-semibold">
                          Stay: {timing.stayDuration || content.stayDuration || "Extended Period"}
                          {timing.customEndDate && (
                            <span className="text-gray-500 font-normal">
                              {" "}(until {timing.formattedCustomEndDate || formatDateStr(timing.customEndDate, "MMM d")})
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Payment Status */}
                  <div className="p-3 rounded-xl bg-white border border-gray-100 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                      <DollarSign className="size-3 text-emerald-600" /> Payment & Status
                    </span>
                    <div className="flex items-center justify-between pt-0.5">
                      <div>
                        <span className="font-black text-gray-900 text-base">
                          ${totalAmount.toFixed(2)}
                        </span>
                        {hourlyRate && (
                          <p className="text-[10px] text-gray-400 font-semibold">
                            ${Number(hourlyRate).toFixed(2)}/hr rate
                          </p>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider border ${
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
                          <CheckCircle2 className="size-3" />
                        ) : status === "PENDING" ? (
                          <AlertCircle className="size-3" />
                        ) : (
                          <XCircle className="size-3" />
                        )}
                        {status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recipient info if present */}
                {recipient?.name && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium pt-1">
                    <Heart className="size-3.5 text-rose-500 fill-rose-500 shrink-0" />
                    <span>
                      Care Recipient:{" "}
                      <span className="font-extrabold text-gray-900">
                        {recipient.name}
                      </span>
                      {recipient.relationship && ` (${recipient.relationship})`}
                    </span>
                  </div>
                )}

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                  {caregiverId ? (
                    <Link
                      href={`/messages?userId=${caregiverId}&userName=${encodeURIComponent(
                        caregiverName,
                      )}`}
                      className="inline-flex h-9 px-3.5 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors gap-1.5 shadow-2xs"
                    >
                      <MessageSquare className="size-3.5 text-primary" />{" "}
                      Message Caregiver
                    </Link>
                  ) : (
                    <div />
                  )}

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
