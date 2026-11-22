"use client";

import { Search, Filter, X } from "lucide-react";

export type BookingFilterTab = "ALL" | "ACCEPTED" | "COMPLETED";

interface BookingsHeaderProps {
  isFamily: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFilter: BookingFilterTab;
  onFilterChange: (filter: BookingFilterTab) => void;
  counts: Record<BookingFilterTab, number>;
}

export function BookingsHeader({
  isFamily,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  counts,
}: BookingsHeaderProps) {
  const tabs: { id: BookingFilterTab; label: string }[] = [
    { id: "ALL", label: "All Bookings" },
    { id: "ACCEPTED", label: "Active / Confirmed" },
    { id: "COMPLETED", label: "Completed" },
  ];

  return (
    <div className="space-y-5">
      {/* Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {isFamily ? "Shift Bookings Log" : "Shift Bookings Ledger"}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {isFamily
              ? "Manage your care appointments, view shift details, and track escrow payments."
              : "Review your active shift appointments, completed visits, and payout ledger."}
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, care type, recipient, city..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-9 py-2 text-xs font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100 scrollbar-none">
        {tabs.map((tab) => {
          const count = counts[tab.id] || 0;
          const isActive = activeFilter === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onFilterChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              {/* <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span> */}
            </button>
          );
        })}
      </div>
    </div>
  );
}
