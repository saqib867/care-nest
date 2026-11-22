import { useDashboardStore } from "@/app/hook/useDashboardStore";

export default function CaregiverEarnings() {
  const bookings = useDashboardStore((state) => state.bookings);

  // Stats calculations
  const grossEarnings = bookings.filter(b => b.status === "COMPLETED" || b.status === "ACCEPTED").reduce((acc, curr: any) => acc + Number(curr.payment || curr.totalAmount || curr.content?.payment || curr.content?.totalAmount || 0), 0);
  const commission = 0;
  const netPayout = grossEarnings;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Earnings & Stripe Payouts</h1>
        <p className="text-xs text-gray-500 mt-1">Direct payout transactions ledger showing commission deductions.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xl shadow-gray-100/40">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Billed</p>
          <p className="text-2xl font-black text-gray-900 mt-1">${grossEarnings.toFixed(2)}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xl shadow-gray-100/40">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Platform commissions (15%)</p>
          <p className="text-2xl font-black text-rose-500 mt-1">${commission.toFixed(2)}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xl shadow-gray-100/40">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Paid to Stripe Account</p>
          <p className="text-2xl font-black text-secondary mt-1">${netPayout.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xl shadow-gray-100/45 space-y-4">
        <h3 className="font-extrabold text-sm text-gray-900">Stripe Payout Transactions</h3>
        <div className="space-y-3">
          {bookings.filter(b => b.status === "COMPLETED").length === 0 ? (
            <p className="text-xs text-gray-400 py-2">No Stripe payout transactions recorded.</p>
          ) : (
            bookings.filter(b => b.status === "COMPLETED").map((bk) => (
              <div key={bk.id} className="border border-gray-100 rounded-xl p-4 flex justify-between items-center text-xs bg-gray-50/50">
                <div>
                  <p className="font-bold text-gray-950">Payout for Shift with {bk.familyName}</p>
                  <p className="text-[10px] text-gray-400">{bk.dateString} &bull; Ref: payout_{bk.id.substring(0, 6)}</p>
                </div>
                <span className="font-black text-secondary">+${(bk.totalAmount - bk.commissionFee).toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
