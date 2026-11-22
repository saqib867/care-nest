import Image from "next/image";

interface CaregiverDashboardHeaderProps {
  userName: string;
  avatar: string;
  isVerified: boolean;
  isPremium?: boolean;
  hourlyRate?: number;
}

export function CaregiverDashboardHeader({
  userName,
  avatar,
  isVerified,
  isPremium,
  hourlyRate = 25,
}: CaregiverDashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="size-14 rounded-2xl overflow-hidden relative bg-muted border border-gray-200 shadow-xs">
          <Image src={avatar} alt={userName} fill className="object-cover" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
              {userName}
            </h1>
            {isPremium && (
              <span className="rounded-full bg-accent text-accent-foreground px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-2xs">
                Premium Partner
              </span>
            )}
          </div>
          <p className="text-gray-500 text-xs mt-0.5">
            Account Status:{" "}
            <span className="text-emerald-600 font-bold">
              {isVerified ? "Vetted & Active Partner" : "Pending Verification"}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60">
          ${hourlyRate}/hr Standard Rate
        </span>
      </div>
    </div>
  );
}
