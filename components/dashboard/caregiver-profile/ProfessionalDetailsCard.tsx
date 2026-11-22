"use client";

import { useState, useEffect } from "react";
import {
  Award,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  ShieldCheck,
} from "lucide-react";
import { useMe, useUpdateProfileMutation } from "@/app/hook/useMe";
import { ImageModal } from "@/components/modals/ImageModal";

export function ProfessionalDetailsCard() {
  const { data: me, isLoading } = useMe();
  const updateMutation = useUpdateProfileMutation();

  const [hourlyRate, setHourlyRate] = useState(25);
  const [experienceYears, setExperienceYears] = useState(2);
  const [languages, setLanguages] = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  // Sync state when data is loaded
  useEffect(() => {
    if (me) {
      setHourlyRate(Number(me.hourlyRate || 25));
      setExperienceYears(Number(me.experienceYears || 2));
      setLanguages(me.languages ? me.languages.join(", ") : "");
      setCertifications(me.certifications || []);
    }
  }, [me]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!me?.id) return;
    setStatusMsg("");
    setStatusType("");

    try {
      const parsedLangs = languages
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean);

      await updateMutation.mutateAsync({
        id: me.id,
        data: {
          hourlyRate: Number(hourlyRate),
          experienceYears: Number(experienceYears),
          languages: parsedLangs,
        },
      });
      setStatusMsg("Credentials updated successfully!");
      setStatusType("success");
    } catch (err: any) {
      console.error(err);
      setStatusMsg(err.message || "Failed to update credentials.");
      setStatusType("error");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-center py-10">
        <Loader2 className="size-5 text-primary animate-spin" />
        <span className="text-xs text-gray-400 ml-2 font-medium">
          Loading credentials...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
        <Award className="size-5 text-secondary" />
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
          Professional Credentials
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
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Hourly Rate */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
              Hourly Rate ($)
            </label>
            <input
              type="number"
              required
              min="10"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Experience Years */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
              Experience (Years)
            </label>
            <input
              type="number"
              required
              min="0"
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Languages */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            Languages (Comma separated)
          </label>
          <input
            type="text"
            placeholder="English, German, French"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Certifications (Read Only) */}
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-600" />
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Verified Credentials & Certifications
              </label>
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50/80 border border-amber-200/60 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
              <Lock className="size-3 text-amber-600" /> Read Only
            </span>
          </div>

          {certifications.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
              {certifications.map((cert, index) => {
                const isImage =
                  typeof cert === "string" &&
                  (cert.startsWith("http") ||
                    cert.startsWith("/") ||
                    cert.startsWith("data:") ||
                    cert.startsWith("blob:") ||
                    /\.(jpg|jpeg|png|webp|avif|svg)$/i.test(cert));

                const certTitle = `Certificate #${index + 1}`;

                return (
                  <div
                    key={cert + index}
                    onClick={() => {
                      if (isImage) {
                        setSelectedImage({ url: cert, title: certTitle });
                      }
                    }}
                    className={`group relative flex flex-col bg-slate-50 border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs transition-all duration-200 ${
                      isImage
                        ? "hover:border-primary/60 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                        : "cursor-default"
                    }`}
                  >
                    {isImage ? (
                      <div className="relative aspect-4/3 w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                        <img
                          src={cert}
                          alt={certTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1.5 backdrop-blur-[2px] text-white p-2">
                          <div className="size-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-sm">
                            <Eye className="size-4" />
                          </div>
                          <span className="text-[10px] font-bold tracking-wide uppercase bg-black/40 px-2 py-0.5 rounded-full">
                            Click to View
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 flex items-center gap-2 bg-emerald-50/30">
                        <div className="size-8 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-700 shrink-0">
                          <Award className="size-4" />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 truncate">
                          {cert}
                        </span>
                      </div>
                    )}

                    {/* Card Footer */}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-center">
              <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                <Award className="size-5" />
              </div>
              <p className="text-xs font-bold text-slate-600">
                No Verified Credentials Found
              </p>
              <p className="text-[11px] text-slate-400 max-w-xs mt-0.5">
                Verified background checks and medical certifications will be
                displayed here once approved by administrator.
              </p>
            </div>
          )}
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
              <span>Save Credentials</span>
            )}
          </button>
        </div>
      </form>

      {/* Image Modal Lightbox */}
      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url || null}
        title={selectedImage?.title || "Certificate Preview"}
      />
    </div>
  );
}
