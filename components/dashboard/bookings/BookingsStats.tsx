"use client";

import { Calendar, DollarSign, CheckCircle2, Clock } from "lucide-react";

interface BookingsStatsProps {
  bookings: any[];
  isFamily: boolean;
}

export function BookingsStats({ bookings, isFamily }: BookingsStatsProps) {
  const totalBookings = bookings.length;
  
  const acceptedCount = bookings.filter(
    (b) => b.status === "ACCEPTED" || b.status === "APPROVED"
  ).length;

  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;

  const totalFinancials = bookings.reduce((acc, curr) => {
    const total = Number(curr.payment || curr.totalAmount || curr.content?.payment || curr.content?.totalAmount || 0);
    const fee = Number(curr.commissionFee || curr.content?.commissionFee || total * 0.15);
    return acc + (isFamily ? total : total - fee);
  }, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Bookings */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Total Bookings
          </p>
          <p className="text-2xl font-black text-slate-900">{totalBookings}</p>
        </div>
        <div className="size-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
          <Calendar className="size-5" />
        </div>
      </div>

      {/* Active / Confirmed */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Active Shifts
          </p>
          <p className="text-2xl font-black text-emerald-600">{acceptedCount}</p>
        </div>
        <div className="size-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
          <CheckCircle2 className="size-5" />
        </div>
      </div>

      {/* Completed Visits */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Completed Visits
          </p>
          <p className="text-2xl font-black text-primary">{completedCount}</p>
        </div>
        <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
          <Clock className="size-5" />
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            {isFamily ? "Total Escrow Spent" : "Total Net Payout"}
          </p>
          <p className="text-2xl font-black text-slate-900">
            ${totalFinancials.toFixed(2)}
          </p>
        </div>
        <div className="size-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
          <DollarSign className="size-5" />
        </div>
      </div>
    </div>
  );
}
