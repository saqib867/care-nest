"use client";

import { useSignupStore } from "./useSignupStore";
import { Users, Heart, Check } from "lucide-react";

export function RoleStep() {
  const { role, setRole, nextStep } = useSignupStore();

  const handleSelectRole = (newRole: "FAMILY" | "CAREGIVER") => {
    setRole(newRole);
    nextStep();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Account Type</h2>
        <p className="text-sm text-gray-500">
          Select how you want to participate in the CareNest ecosystem.
        </p>
      </div>

      <div className="space-y-4">
        {/* Family Card */}
        <button
          type="button"
          onClick={() => handleSelectRole("FAMILY")}
          className={`w-full flex items-center p-5 rounded-2xl border-2 text-left transition-all cursor-pointer group ${
            role === "FAMILY"
              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
              : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
          }`}
        >
          <div className={`p-3.5 rounded-xl mr-5 transition-colors ${
            role === "FAMILY" ? "bg-primary text-white" : "bg-gray-50 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary"
          }`}>
            <Users className="size-7" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900 mb-0.5">I Need Home Care</h3>
            <p className="text-xs text-gray-500 max-w-sm">
              Find, vet, and book qualified independent caregivers for your family.
            </p>
          </div>
          {/* Selected indicator */}
          <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-all ${
            role === "FAMILY" ? "border-primary bg-primary text-white" : "border-gray-300"
          }`}>
            {role === "FAMILY" && <Check className="size-3 stroke-[3]" />}
          </div>
        </button>

        {/* Caregiver Card */}
        <button
          type="button"
          onClick={() => handleSelectRole("CAREGIVER")}
          className={`w-full flex items-center p-5 rounded-2xl border-2 text-left transition-all cursor-pointer group ${
            role === "CAREGIVER"
              ? "border-secondary bg-secondary/5 ring-2 ring-secondary/20"
              : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
          }`}
        >
          <div className={`p-3.5 rounded-xl mr-5 transition-colors ${
            role === "CAREGIVER" ? "bg-secondary text-white" : "bg-gray-50 text-gray-400 group-hover:bg-secondary/10 group-hover:text-secondary"
          }`}>
            <Heart className="size-7" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900 mb-0.5">I Provide Home Care</h3>
            <p className="text-xs text-gray-500 max-w-sm">
              List your profile, set your rates, find clients, and keep 100% of your earnings.
            </p>
          </div>
          {/* Selected indicator */}
          <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-all ${
            role === "CAREGIVER" ? "border-secondary bg-secondary text-white" : "border-gray-300"
          }`}>
            {role === "CAREGIVER" && <Check className="size-3 stroke-[3]" />}
          </div>
        </button>
      </div>
    </div>
  );
}
