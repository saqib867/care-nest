"use client";

import { Calendar, DollarSign, CheckCircle2, Clock } from "lucide-react";
import { useBookings } from "@/app/hook/useBookings";

export function FamilyStats() {
  const { data } = useBookings({ queryKeyPrefix: "dashboard" });

  const rawBookings: any[] = data?.bookings || [];

  const totalBookings = data?.totalCount ?? rawBookings.length;

  const activeCount = rawBookings.filter(
    (b) => b.status === "ACCEPTED" || b.status === "APPROVED",
  ).length;

  const completedCount = rawBookings.filter(
    (b) => b.status === "COMPLETED",
  ).length;

  const totalSpent = rawBookings.reduce((acc, curr) => {
    const total = Number(
      curr.payment ||
        curr.totalAmount ||
        curr.content?.payment ||
        curr.content?.totalAmount ||
        0,
    );
    return acc + total;
  }, 0);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Bookings */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xl shadow-gray-100/40 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Total Bookings
          </p>
          <p className="text-2xl font-black text-gray-900">{totalBookings}</p>
        </div>
        <div className="size-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
          <Calendar className="size-5" />
        </div>
      </div>

      {/* Active Shifts */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xl shadow-gray-100/40 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Active Shifts
          </p>
          <p className="text-2xl font-black text-emerald-600">{activeCount}</p>
        </div>
        <div className="size-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
          <CheckCircle2 className="size-5" />
        </div>
      </div>

      {/* Completed Visits */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xl shadow-gray-100/40 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Completed Visits
          </p>
          <p className="text-2xl font-black text-primary">{completedCount}</p>
        </div>
        <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
          <Clock className="size-5" />
        </div>
      </div>

      {/* Total Escrow Spent */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xl shadow-gray-100/40 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Total Escrow Spent
          </p>
          <p className="text-2xl font-black text-slate-900">
            ${totalSpent.toFixed(2)}
          </p>
        </div>
        <div className="size-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
          <DollarSign className="size-5" />
        </div>
      </div>
    </div>
  );
}
