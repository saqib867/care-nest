"use client";

import { useSignupStore } from "./useSignupStore";
import { useOnboardingMeta } from '@/app/hook/useOnboardingMeta';
import { saveCaregiverServices } from "@/app/actions/auth";
import { Loader2, ShieldCheck, HeartHandshake } from "lucide-react";
import { useState } from "react";

export function ServicesStep() {
  const store = useSignupStore();
  const { services, specializations, loading, error } = useOnboardingMeta();
  const [formError, setFormError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (store.selectedServices.length === 0) {
      setFormError("Please select at least one care service.");
      return;
    }

    if (!store.userId) {
      setFormError("Authentication session is missing. Please restart onboarding.");
      return;
    }

    try {
      setIsUpdating(true);
      const res = await saveCaregiverServices(
        store.userId,
        store.selectedServices,
        store.selectedSpecializations
      );

      if (!res.success) {
        setFormError(res.error || "Failed to save selected services.");
      } else {
        store.nextStep();
      }
    } catch (err: any) {
      console.error("ServicesStep error:", err);
      setFormError(err.message || "An unexpected error occurred.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="size-8 text-secondary animate-spin" />
        <p className="text-sm text-gray-500 font-medium animate-pulse">Loading clinical options...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleNext} className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Services & Specializations</h2>
        <p className="text-sm text-gray-500">
          Tell us about the home care services you provide and any certified skills you possess.
        </p>
      </div>

      {formError && (
        <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-xl border border-red-100">
          {formError}
        </div>
      )}

      {error && (
        <div className="bg-amber-50 text-amber-700 text-xs p-3 rounded-xl border border-amber-100">
          Operating in offline mode: Loaded default standard selections.
        </div>
      )}

      <div className="space-y-6">
        {/* Services Select */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <HeartHandshake className="size-5 text-secondary" />
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest">Care Services Offered</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {services.map((service) => {
              const isChecked = store.selectedServices.includes(service.name);
              return (
                <label
                  key={service.id}
                  className={`flex items-center p-3 rounded-xl border cursor-pointer select-none transition-all ${
                    isChecked
                      ? "border-secondary bg-secondary/5"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={isUpdating}
                    onChange={() => store.toggleService(service.name)}
                    className="mr-3 accent-secondary size-4"
                  />
                  <span className="text-sm font-medium text-gray-700">{service.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Specializations Select */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <ShieldCheck className="size-5 text-primary" />
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest">Specializations</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {specializations.map((spec) => {
              const isChecked = store.selectedSpecializations.includes(spec.name);
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
                    disabled={isUpdating}
                    onChange={() => store.toggleSpecialization(spec.name)}
                    className="mr-3 accent-primary size-4"
                  />
                  <span className="text-sm font-medium text-gray-700">{spec.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          disabled={isUpdating}
          onClick={store.prevStep}
          className="flex-1 h-11 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 cursor-pointer"
        >
          Go Back
        </button>
        <button
          type="submit"
          disabled={isUpdating}
          className="flex-1 h-11 bg-primary text-white font-semibold rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/10 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-85"
        >
          {isUpdating ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Continue</span>
          )}
        </button>
      </div>
    </form>
  );
}
