"use client";

import { useState, useEffect } from "react";
import { User, Lock, Calendar, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useMe, useUpdateProfileMutation } from "@/app/hook/useMe";

export function PersonalInfoCard() {
  const { data: me, isLoading } = useMe();
  const updateMutation = useUpdateProfileMutation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Female");

  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  // Sync state when data is loaded
  useEffect(() => {
    if (me) {
      setFirstName(me.firstName || "");
      setLastName(me.lastName || "");
      setEmail(me.email || "");
      setDob(me.dateOfBirth || "");
      setGender(me.gender || "Female");
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
          firstName,
          lastName,
          dateOfBirth: dob,
          gender,
        },
      });
      setStatusMsg("Personal information updated successfully!");
      setStatusType("success");
    } catch (err: any) {
      console.error(err);
      setStatusMsg(err.message || "Failed to update personal information.");
      setStatusType("error");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-center py-10">
        <Loader2 className="size-5 text-primary animate-spin" />
        <span className="text-xs text-gray-400 ml-2 font-medium">Loading personal details...</span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
        <User className="size-5 text-primary" />
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Personal Information</h3>
      </div>

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

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* First Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">First Name</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Last Name</label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Date of Birth */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Date of Birth</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-3.5" />
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full pl-9 pr-4 bg-white border border-gray-200 rounded-xl py-2 text-xs focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary transition-colors"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
            </select>
          </div>
        </div>

        {/* Email (Read Only) */}
        <div className="space-y-1.5 pt-2">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>Email Address</span>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-200/50">
              <Lock className="size-3" /> Read Only
            </span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 size-3.5" />
            <input
              type="email"
              disabled
              value={email}
              className="w-full pl-9 pr-4 bg-gray-50 border border-gray-100 text-gray-400 rounded-xl py-2 text-xs cursor-not-allowed"
            />
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
              <span>Save Personal Info</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
