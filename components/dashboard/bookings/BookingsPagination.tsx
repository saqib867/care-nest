"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookingsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function BookingsPagination({
  currentPage,
  totalPages,
  totalCount,
  limit,
  onPageChange,
}: BookingsPaginationProps) {
  if (totalCount === 0 || totalPages <= 1) return null;

  const startEntry = (currentPage - 1) * limit + 1;
  const endEntry = Math.min(currentPage * limit, totalCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
      <p className="text-xs font-semibold text-slate-500">
        Showing <span className="font-extrabold text-slate-900">{startEntry}</span> to{" "}
        <span className="font-extrabold text-slate-900">{endEntry}</span> of{" "}
        <span className="font-extrabold text-slate-900">{totalCount}</span> bookings
      </p>

      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex h-9 px-3 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-extrabold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs gap-1"
        >
          <ChevronLeft className="size-4" />
          <span>Previous</span>
        </button>

        {/* Page Indicator */}
        <span className="text-xs font-extrabold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          Page {currentPage} of {totalPages}
        </span>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex h-9 px-3 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-extrabold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs gap-1"
        >
          <span>Next</span>
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
