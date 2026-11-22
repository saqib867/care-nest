import { useDashboardStore } from "@/app/hook/useDashboardStore";

export default function FamilyBookings() {
  const bookings = useDashboardStore((state) => state.bookings);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Shift Bookings Log</h1>
        <p className="text-xs text-gray-500 mt-1">Review all shift booking requests, completed visits, and escrow transaction fees.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-100/40 overflow-hidden">
        {bookings.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-10">No shift bookings found.</p>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                <th className="p-4">Caregiver</th>
                <th className="p-4">Date</th>
                <th className="p-4">Time Window</th>
                <th className="p-4 text-right">Hourly Rate</th>
                <th className="p-4 text-right">Cost (Escrow Hold)</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((bk) => {
                const b = bk as any;
                const content = typeof b.content === "object" && b.content !== null ? b.content : {};
                const rate = content.hourlyRate || b.hourlyRate || 30;
                return (
                  <tr key={bk.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold text-gray-900">{bk.caregiverName}</td>
                    <td className="p-4 text-gray-500">{bk.dateString}</td>
                    <td className="p-4 text-gray-500">{bk.startTime} - {bk.endTime}</td>
                    <td className="p-4 text-right font-bold text-slate-900">${Number(rate).toFixed(2)}/hr</td>
                    <td className="p-4 text-right font-black text-gray-900">${bk.totalAmount.toFixed(2)}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        bk.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                        bk.status === "ACCEPTED" ? "bg-secondary/15 text-secondary" :
                        bk.status === "PENDING" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                      }`}>
                        {bk.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
