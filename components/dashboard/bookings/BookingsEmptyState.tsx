"use client";

import { CalendarRange, Search } from "lucide-react";

interface BookingsEmptyStateProps {
  isSearch: boolean;
  onResetSearch?: () => void;
}

export function BookingsEmptyState({ isSearch, onResetSearch }: BookingsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white rounded-3xl border border-slate-100 shadow-xs space-y-3">
      <div className="size-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
        {isSearch ? <Search className="size-7" /> : <CalendarRange className="size-7" />}
      </div>
      <h3 className="text-base font-extrabold text-slate-800">
        {isSearch ? "No Matching Bookings Found" : "No Shift Appointments Yet"}
      </h3>
      <p className="text-xs text-slate-400 max-w-sm font-medium leading-relaxed">
        {isSearch
          ? "We couldn't find any booking records matching your search query or filter."
          : "When shift appointments are requested or confirmed, your full schedule and transaction ledger will appear here."}
      </p>
      {isSearch && onResetSearch && (
        <button
          type="button"
          onClick={onResetSearch}
          className="mt-2 inline-flex h-9 px-4 items-center justify-center rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
        >
          Clear Filter
        </button>
      )}
    </div>
  );
}
