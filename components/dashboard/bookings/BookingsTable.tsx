"use client";

import {
  Clock,
  CheckCircle2,
  ChevronRight,
  User,
  AlertCircle,
  XCircle,
  Calendar,
  Repeat,
  Home,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format, parse, parseISO, isValid } from "date-fns";

interface BookingsTableProps {
  bookings: any[];
  isFamily: boolean;
  onSelectBooking?: (booking: any) => void;
}

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

export function BookingsTable({
  bookings,
  isFamily,
  onSelectBooking,
}: BookingsTableProps) {
  const router = useRouter();

  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs select-none">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
              <th className="p-4 pl-6">
                {isFamily ? "Caregiver Partner" : "Client Family"}
              </th>
              <th className="p-4">Care Type</th>
              <th className="p-4 text-right">Hourly Rate</th>
              <th className="p-4">Schedule Summary</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right pr-6">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.map((bk: any) => {
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

              const partnerProfile = isFamily
                ? bk.CaregiverProfile
                : bk.FamilyProfile;

              const partnerName = partnerProfile
                ? `${partnerProfile.firstName || ""} ${partnerProfile.lastName || ""}`.trim()
                : isFamily
                  ? "Caregiver Partner"
                  : "Client Family";

              const careTypeVal =
                bk.careType || content.careType || "One-time Care";

              const scheduleSummaryStr = content.scheduleSummary || "";
              const combinedTypeCheck = `${careTypeVal} ${scheduleSummaryStr}`.toLowerCase();

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

              const hourlyRateVal =
                content.hourlyRate ||
                bk.hourlyRate ||
                content.rate ||
                bk.CaregiverProfile?.hourlyRate;

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
              const status = bk.status || "PENDING";

              return (
                <tr
                  key={bk.id}
                  onClick={() => {
                    if (onSelectBooking) onSelectBooking(bk);
                    router.push(`/dashboard/bookings/${bk.id}`);
                  }}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  {/* Partner Name & Avatar */}
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold shrink-0">
                        <User className="size-4" />
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 text-xs group-hover:text-primary transition-colors">
                          {partnerName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <span>ID: {bk.id?.slice(0, 8)}...</span>
                          {recipient?.name && (
                            <>
                              <span>•</span>
                              <span className="text-slate-500 font-semibold">
                                For {recipient.name}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Care Type Badge */}
                  <td className="p-4">
                    {typeKind === "one-time" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-extrabold bg-sky-50 text-sky-700 border border-sky-200/80">
                        <Calendar className="size-3.5 text-sky-600 shrink-0" />
                        One-time Care
                      </span>
                    )}

                    {typeKind === "recurring" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200/80">
                        <Repeat className="size-3.5 text-purple-600 shrink-0" />
                        Recurring Care
                      </span>
                    )}

                    {typeKind === "live-in" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-extrabold bg-amber-50 text-amber-800 border border-amber-200/80">
                        <Home className="size-3.5 text-amber-600 shrink-0" />
                        Live-in Care
                      </span>
                    )}
                  </td>

                  {/* Hourly Rate / Duration */}
                  <td className="p-4 text-right">
                    <p className="font-extrabold text-slate-900">
                      {hourlyRateVal
                        ? `$${Number(hourlyRateVal).toFixed(2)}/hr`
                        : "N/A"}
                    </p>
                    {typeKind === "one-time" &&
                      (timing.duration || content.estimatedDuration) && (
                        <p className="text-[10px] text-slate-400 font-semibold">
                          {timing.duration || content.estimatedDuration}
                        </p>
                      )}
                    {typeKind === "recurring" &&
                      (timing.duration || content.estimatedDuration) && (
                        <p className="text-[10px] text-purple-600 font-semibold">
                          {timing.duration || content.estimatedDuration} daily
                        </p>
                      )}
                    {typeKind === "live-in" &&
                      (timing.stayDuration || content.stayDuration) && (
                        <p className="text-[10px] text-amber-600 font-semibold">
                          {timing.stayDuration || content.stayDuration} stay
                        </p>
                      )}
                  </td>

                  {/* Schedule Summary (Adjusted by Care Type) */}
                  <td className="p-4 max-w-[280px]">
                    {typeKind === "one-time" && (
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 min-w-0">
                          <Calendar className="size-3.5 text-sky-500 shrink-0" />
                          <span className="truncate">
                            {timing.formattedDate ||
                              formatDateStr(
                                timing.date || bk.startTime,
                                "EEE, MMM d, yyyy",
                              ) ||
                              content.scheduleSummary ||
                              "Single Shift"}
                            {(timing.formattedTime ||
                              formatTimeStr(timing.time)) && (
                              <span className="text-slate-500 font-medium">
                                {" "}
                                at{" "}
                                {timing.formattedTime ||
                                  formatTimeStr(timing.time)}
                              </span>
                            )}
                          </span>
                        </div>
                        {(timing.duration || content.estimatedDuration) && (
                          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 pl-5">
                            <Clock className="size-3 text-slate-400 shrink-0" />
                            <span>
                              Duration:{" "}
                              {timing.duration || content.estimatedDuration}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {typeKind === "recurring" && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 min-w-0">
                          <Repeat className="size-3.5 text-purple-500 shrink-0" />
                          <span className="truncate">
                            {timing.formattedStartDate ||
                            timing.startDate ||
                            timing.formattedEndDate
                              ? `${
                                  timing.formattedStartDate ||
                                  formatDateStr(timing.startDate, "MMM d")
                                } – ${
                                  timing.formattedEndDate ||
                                  formatDateStr(timing.endDate, "MMM d, yyyy")
                                }`
                              : content.scheduleSummary || "Recurring Schedule"}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1 pl-5">
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
                          {(timing.formattedTime ||
                            formatTimeStr(timing.time)) && (
                            <span className="text-[10px] font-semibold text-slate-500 ml-1">
                              @{" "}
                              {timing.formattedTime ||
                                formatTimeStr(timing.time)}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {typeKind === "live-in" && (
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 min-w-0">
                          <Home className="size-3.5 text-amber-600 shrink-0" />
                          <span className="truncate">
                            {timing.formattedMoveInDate || timing.moveInDate
                              ? `Moves in ${
                                  timing.formattedMoveInDate ||
                                  formatDateStr(
                                    timing.moveInDate,
                                    "EEE, MMM d, yyyy",
                                  )
                                }`
                              : content.scheduleSummary || "Live-in Care"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 pl-5">
                          <span>
                            Stay:{" "}
                            {timing.stayDuration ||
                              content.stayDuration ||
                              "Extended Period"}
                          </span>
                          {timing.customEndDate && (
                            <span>
                              (until{" "}
                              {timing.formattedCustomEndDate ||
                                formatDateStr(timing.customEndDate, "MMM d")}
                              )
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="p-4 text-center">
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
                  </td>

                  {/* Action Link Arrow */}
                  <td className="p-4 text-right pr-6">
                    <div className="size-7 rounded-lg bg-slate-100 text-slate-400 group-hover:bg-primary group-hover:text-white transition-all inline-flex items-center justify-center">
                      <ChevronRight className="size-4" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

