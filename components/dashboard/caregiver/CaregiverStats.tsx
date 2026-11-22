import { ShieldCheck } from "lucide-react";

interface CaregiverStatsProps {
  grossEarnings: number;
  commission: number;
  netPayout: number;
  isVerified: boolean;
}

export function CaregiverStats({
  grossEarnings,
  commission,
  netPayout,
  isVerified,
}: CaregiverStatsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xl shadow-gray-100/40">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Gross Earnings
        </p>
        <p className="text-2xl font-black text-primary mt-1">
          ${grossEarnings.toFixed(2)}
        </p>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xl shadow-gray-100/40">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Platform Commissions (15%)
        </p>
        <p className="text-2xl font-black text-rose-500 mt-1">
          ${commission.toFixed(2)}
        </p>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xl shadow-gray-100/40">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Net Payout (Stripe Direct)
        </p>
        <p className="text-2xl font-black text-secondary mt-1">
          ${netPayout.toFixed(2)}
        </p>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xl shadow-gray-100/40">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Verification status
        </p>
        <div className="flex items-center gap-1.5 mt-2">
          <ShieldCheck className="size-5 text-emerald-600" />
          <span className="text-sm font-bold text-emerald-600">
            {isVerified ? "Verified Care Partner" : "Pending Verification"}
          </span>
        </div>
      </div>
    </div>
  );
}
