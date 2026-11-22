"use client";

import { useState, useEffect } from "react";
import { useOnboardingMeta } from "@/app/hook/useOnboardingMeta";
import { HeartHandshake, Loader2, Award, CheckCircle2, AlertCircle } from "lucide-react";
import { useMe, useUpdateProfileMutation } from "@/app/hook/useMe";

export function ServicesSpecialtiesCard() {
  const { data: me, isLoading: isMeLoading } = useMe();
  const { services, specializations, loading: isMetaLoading } = useOnboardingMeta();
  const updateMutation = useUpdateProfileMutation();

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);

  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  // Sync state when data is loaded
  useEffect(() => {
    if (me) {
      setSelectedServices(me.services || []);
      setSelectedSpecializations(me.specializations || []);
    }
  }, [me]);

  const toggleService = (name: string) => {
    setSelectedServices((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  };

  const toggleSpecialization = (name: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!me?.id) return;
    setStatusMsg("");
    setStatusType("");

    try {
      await updateMutation.mutateAsync({
        id: me.id,
        data: {
          services: selectedServices,
          specializations: selectedSpecializations,
        },
      });
      setStatusMsg("Services and Specializations updated successfully!");
      setStatusType("success");
    } catch (err: any) {
      console.error(err);
      setStatusMsg(err.message || "Failed to update services.");
      setStatusType("error");
    }
  };

  if (isMeLoading || isMetaLoading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-center py-10">
        <Loader2 className="size-5 text-primary animate-spin" />
        <span className="text-xs text-gray-400 ml-2 font-medium">Loading services data...</span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
      {statusMsg && (
        <div className={`p-3.5 rounded-xl text-xs font-semibold border flex items-center gap-2 ${
          statusType === "success" 
            ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
            : "bg-red-50 border-red-100 text-red-600"
        }`}>
          {statusType === "success" ? <CheckCircle2 className="size-4 shrink-0" /> : <AlertCircle className="size-4 shrink-0" />}
          <span>{statusMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Services Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <HeartHandshake className="size-5 text-secondary" />
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Care Services Offered</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {services.map((s) => {
              const isChecked = selectedServices.includes(s.name);
              return (
                <label
                  key={s.id}
                  className={`flex items-center p-3 rounded-xl border cursor-pointer select-none transition-all ${
                    isChecked
                      ? "border-secondary bg-secondary/5"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleService(s.name)}
                    className="hidden"
                  />
                  <div className={`size-4 rounded border flex items-center justify-center mr-3 shrink-0 ${
                    isChecked ? "border-secondary bg-secondary text-white" : "border-gray-300 bg-white"
                  }`}>
                    {isChecked && (
                      <svg className="size-3 fill-current" viewBox="0 0 20 20">
                        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{s.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Specializations Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <Award className="size-5 text-primary" />
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Skills & Clinical Specialities</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {specializations.map((spec) => {
              const isChecked = selectedSpecializations.includes(spec.name);
              return (
                <label
                  key={spec.id}
                  className={`flex items-center p-3 rounded-xl border cursor-pointer select-none transition-all ${
                    isChecked
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSpecialization(spec.name)}
                    className="hidden"
                  />
                  <div className={`size-4 rounded border flex items-center justify-center mr-3 shrink-0 ${
                    isChecked ? "border-primary bg-primary text-white" : "border-gray-300 bg-white"
                  }`}>
                    {isChecked && (
                      <svg className="size-3 fill-current" viewBox="0 0 20 20">
                        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{spec.name}</span>
                </label>
              );
            })}
          </div>
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
              <span>Save Services</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
