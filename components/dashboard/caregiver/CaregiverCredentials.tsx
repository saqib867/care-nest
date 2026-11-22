import { FileCheck, Award, Eye, Sparkles } from "lucide-react";

interface CaregiverCredentialsProps {
  certifications: string[];
  onSelectImage: (img: { url: string; title: string }) => void;
}

export function CaregiverCredentials({
  certifications,
  onSelectImage,
}: CaregiverCredentialsProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-gray-100/45 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-50 pb-3">
          <h3 className="font-extrabold text-base flex items-center gap-2 text-primary">
            <FileCheck className="size-4.5 text-primary" /> Verified Credentials
          </h3>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            {certifications.length} Credentials
          </span>
        </div>

        {certifications.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 pt-1">
            {certifications.map((cert: string, index: number) => {
              const isImage =
                typeof cert === "string" &&
                (cert.startsWith("http") ||
                  cert.startsWith("/") ||
                  cert.startsWith("data:") ||
                  cert.startsWith("blob:") ||
                  /\.(jpg|jpeg|png|webp|avif|svg)$/i.test(cert));

              const certTitle = `Credential #${index + 1}`;

              return (
                <div
                  key={cert + index}
                  onClick={() => {
                    if (isImage) {
                      onSelectImage({ url: cert, title: certTitle });
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
                      <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1 backdrop-blur-[2px] text-white p-1 text-center">
                        <Eye className="size-4" />
                        <span className="text-[9px] font-bold uppercase">
                          View
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 flex items-center gap-2 bg-emerald-50/30 min-h-[60px]">
                      <Award className="size-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-semibold text-gray-700 truncate">
                        {cert}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 px-4 border border-dashed border-gray-200 rounded-xl bg-slate-50/50 text-center">
            <Award className="size-8 text-gray-300 mb-2" />
            <p className="text-xs font-bold text-gray-600">No Credentials Listed</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Verified background checks and certifications will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Partner Guarantee Banner */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-gray-100/45 space-y-3">
        <h3 className="font-extrabold text-base flex items-center gap-1.5 text-primary">
          <Sparkles className="size-4.5 text-amber-500" /> Partner Protection
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          Your profile is verified with CareNest escrow protection. You receive payouts directly upon completed shifts.
        </p>
      </div>
    </div>
  );
}
