"use client";

import { useState, useEffect } from "react";
import { FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useMe, useUpdateProfileMutation } from "@/app/hook/useMe";

export function ProfessionalBioCard() {
  const { data: me, isLoading } = useMe();
  const updateMutation = useUpdateProfileMutation();

  const [bio, setBio] = useState("");

  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  // Sync state when data is loaded
  useEffect(() => {
    if (me) {
      setBio(me.bio || "");
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
          bio,
        },
      });
      setStatusMsg("Bio statement updated successfully!");
      setStatusType("success");
    } catch (err: any) {
      console.error(err);
      setStatusMsg(err.message || "Failed to update bio statement.");
      setStatusType("error");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-center py-10">
        <Loader2 className="size-5 text-primary animate-spin" />
        <span className="text-xs text-gray-400 ml-2 font-medium">Loading bio statement...</span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
        <FileText className="size-5 text-gray-600" />
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Professional Bio Statement</h3>
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
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Bio Description</label>
          <textarea
            required
            rows={4}
            placeholder="Describe your credentials, personal care philosophy, and home care expertise..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-colors resize-none leading-relaxed"
          />
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
              <span>Save Bio</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
