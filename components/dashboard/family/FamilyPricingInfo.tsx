import { TrendingUp } from "lucide-react";

export function FamilyPricingInfo() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-gray-100/45 space-y-4">
      <h3 className="font-extrabold text-base flex items-center gap-2 text-primary">
        <TrendingUp className="size-4.5" /> Direct Pricing & Escrow
      </h3>
      <p className="text-xs text-gray-500 leading-relaxed">
        We offer a transparent <strong>100% direct-to-caregiver rate structure</strong>. You pay the exact caregiver's rate, and we apply a flat 15% platform matching fee on top to manage safety background checks, insurance support, and escrow guarantees.
      </p>
      <div className="rounded-xl bg-gray-50 p-4 border border-gray-100 space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-gray-500">Caregiver Payout</span>
          <span className="text-gray-900">85%</span>
        </div>
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-gray-500">CareNest Fee</span>
          <span className="text-gray-900">15%</span>
        </div>
      </div>
    </div>
  );
}
