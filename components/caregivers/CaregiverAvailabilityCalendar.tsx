"use client";

import { Calendar } from "lucide-react";
import { format, parse, isValid } from "date-fns";

const formatTime12h = (timeStr?: string) => {
  if (!timeStr) return "";
  const cleaned = String(timeStr).trim();
  if (!cleaned) return "";

  if (/am|pm/i.test(cleaned)) return cleaned;

  const formatsToTry = ["HH:mm:ss", "HH:mm", "H:mm", "HH:mm:ss.SSS"];
  for (const fmt of formatsToTry) {
    try {
      const parsed = parse(cleaned, fmt, new Date(0));
      if (isValid(parsed)) {
        return format(parsed, "h:mm a");
      }
    } catch {
      // continue
    }
  }

  return cleaned;
};

const formatSlotTiming = (slot: any) => {
  if (!slot) return "";

  if (slot.startTime && slot.endTime) {
    const formattedStart = formatTime12h(slot.startTime);
    const formattedEnd = formatTime12h(slot.endTime);
    return `${formattedStart} - ${formattedEnd}`;
  }

  if (slot.hours) {
    const parts = String(slot.hours).split("-");
    if (parts.length === 2) {
      const formattedStart = formatTime12h(parts[0].trim());
      const formattedEnd = formatTime12h(parts[1].trim());
      return `${formattedStart} - ${formattedEnd}`;
    }
    return formatTime12h(slot.hours);
  }

  return "";
};

interface CaregiverAvailabilityCalendarProps {
  cg: any;
}

export function CaregiverAvailabilityCalendar({ cg }: CaregiverAvailabilityCalendarProps) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
      <h2 className="font-bold text-lg text-primary mb-4 flex items-center gap-2">
        <Calendar className="size-5" /> Weekly Availability Calendar
      </h2>
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
        {[
          { name: "Sun", id: 0 },
          { name: "Mon", id: 1 },
          { name: "Tue", id: 2 },
          { name: "Wed", id: 3 },
          { name: "Thu", id: 4 },
          { name: "Fri", id: 5 },
          { name: "Sat", id: 6 }
        ].map((day) => {
          const slots = (cg.availability || []).filter((av: any) => {
            const dayVal = av.day !== undefined ? av.day : av.dayOfWeek;
            return Number(dayVal) === day.id;
          });
          const isAvailable = slots.length > 0;
          return (
            <div 
              key={day.id} 
              className={`rounded-2xl border p-3.5 text-center flex flex-col justify-between min-h-[100px] transition-all duration-200 ${
                isAvailable 
                  ? "border-emerald-100 bg-emerald-50/30 text-emerald-800 shadow-sm" 
                  : "border-slate-100 bg-slate-50/40 text-slate-400"
              }`}
            >
              <span className={`text-[11px] font-bold uppercase tracking-wider ${
                isAvailable ? "text-emerald-700" : "text-slate-400"
              }`}>{day.name}</span>
              {isAvailable ? (
                <div className="space-y-1.5 mt-2">
                  <span className="inline-block rounded-full bg-emerald-500/10 text-emerald-700 px-2 py-0.5 text-[9px] font-bold border border-emerald-500/10 uppercase tracking-wider">
                    Available
                  </span>
                  <span className="block text-[10px] font-extrabold text-emerald-950 leading-tight pt-0.5">
                    {formatSlotTiming(slots[0])}
                  </span>
                </div>
              ) : (
                <div className="mt-2 space-y-1">
                  <span className="inline-block rounded-full bg-slate-100 text-slate-400/80 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider">
                    Off
                  </span>
                  <span className="block text-[10px] font-semibold text-slate-400/60 leading-tight pt-0.5">
                    Unavailable
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
