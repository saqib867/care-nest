"use client";

import { useState, useEffect } from "react";
import { Calendar, Loader2, CheckCircle2, AlertCircle, Check } from "lucide-react";
import { useMe, useUpdateProfileMutation } from "@/app/hook/useMe";

export interface OnboardingAvailability {
  day: number;
  startTime: string;
  endTime: string;
}

export function AvailabilitySchedulerCard() {
  const { data: me, isLoading } = useMe();
  const updateMutation = useUpdateProfileMutation();

  const [availability, setAvailability] = useState<OnboardingAvailability[]>(
    [],
  );

  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  // Sync state when data is loaded
  useEffect(() => {
    if (me) {
      setAvailability(me.availability || []);
    }
  }, [me]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!me?.id) return;
    setStatusMsg("");
    setStatusType("");

    try {
      await updateMutation.mutateAsync({
        id: me.id,
        data: {
          availability: availability,
        },
      });
      setStatusMsg("Availability calendar updated successfully!");
      setStatusType("success");
    } catch (err: any) {
      console.error(err);
      setStatusMsg(err.message || "Failed to update availability.");
      setStatusType("error");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-center py-10">
        <Loader2 className="size-5 text-primary animate-spin" />
        <span className="text-xs text-gray-400 ml-2 font-medium">
          Loading availability...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
        <Calendar className="size-5 text-emerald-600" />
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
          Weekly Availability & Hours
        </h3>
      </div>

      {statusMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold border flex items-center gap-2 ${
            statusType === "success"
              ? "bg-emerald-50 border-emerald-100 text-emerald-700"
              : "bg-red-50 border-red-100 text-red-600"
          }`}
        >
          {statusType === "success" ? (
            <CheckCircle2 className="size-4 shrink-0" />
          ) : (
            <AlertCircle className="size-4 shrink-0" />
          )}
          <span>{statusMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {[
            { name: "Sunday", id: 0 },
            { name: "Monday", id: 1 },
            { name: "Tuesday", id: 2 },
            { name: "Wednesday", id: 3 },
            { name: "Thursday", id: 4 },
            { name: "Friday", id: 5 },
            { name: "Saturday", id: 6 },
          ].map((day) => {
            const activeSlot = availability.find((av) => av.day === day.id);
            const isChecked = !!activeSlot;

            const handleCheckboxChange = (checked: boolean) => {
              if (checked) {
                setAvailability((prev) => [
                  ...prev,
                  { day: day.id, startTime: "09:00", endTime: "17:00" },
                ]);
              } else {
                setAvailability((prev) =>
                  prev.filter((av) => av.day !== day.id),
                );
              }
            };

            const handleTimeChange = (
              type: "startTime" | "endTime",
              val: string,
            ) => {
              setAvailability((prev) =>
                prev.map((av) =>
                  av.day === day.id ? { ...av, [type]: val } : av,
                ),
              );
            };

            return (
              <div
                key={day.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 text-xs hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <label
                    htmlFor={`edit-avail-${day.id}`}
                    className="relative flex items-center gap-3 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      id={`edit-avail-${day.id}`}
                      onChange={(e) => handleCheckboxChange(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div
                      className={`size-4.5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                        isChecked
                          ? "border-primary bg-primary text-white shadow-2xs"
                          : "border-gray-300 bg-white hover:border-gray-400"
                      }`}
                    >
                      {isChecked && <Check className="size-3.5 text-white stroke-[3]" />}
                    </div>
                    <span
                      className={`font-bold text-xs select-none transition-colors ${
                        isChecked ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {day.name}
                    </span>
                  </label>
                </div>

                {isChecked && activeSlot ? (
                  <div className="flex items-center gap-2 animate-in fade-in duration-200">
                    <input
                      type="time"
                      value={activeSlot.startTime}
                      onChange={(e) =>
                        handleTimeChange("startTime", e.target.value)
                      }
                      className="px-2 py-1 border border-gray-200 rounded-lg text-[10px] focus:border-secondary focus:ring-1 focus:ring-secondary outline-none font-bold text-gray-700"
                    />
                    <span className="text-gray-400 font-medium">to</span>
                    <input
                      type="time"
                      value={activeSlot.endTime}
                      onChange={(e) =>
                        handleTimeChange("endTime", e.target.value)
                      }
                      className="px-2 py-1 border border-gray-200 rounded-lg text-[10px] focus:border-secondary focus:ring-1 focus:ring-secondary outline-none font-bold text-gray-700"
                    />
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-400 font-bold italic sm:pr-8">
                    Unavailable
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="inline-flex h-9 px-5 items-center justify-center rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="size-3 animate-spin" />
                <span>Saving...</span>
              </span>
            ) : (
              <span>Save Availability</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
