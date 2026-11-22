"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

import { useBookings } from "@/app/hook/useBookings";
import { useDebounce } from "@/app/hook/useDebounce";

import {
  BookingsHeader,
  BookingFilterTab,
} from "@/components/dashboard/bookings/BookingsHeader";
import { BookingsTable } from "@/components/dashboard/bookings/BookingsTable";
import { BookingsEmptyState } from "@/components/dashboard/bookings/BookingsEmptyState";

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const [activeFilter, setActiveFilter] = useState<BookingFilterTab>("ALL");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  const { data, isLoading, error } = useBookings({
    queryKeyPrefix: "bookings-page",
    status: activeFilter,
    search: debouncedSearchQuery,
    page,
    limit: 20,
  });

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-600">Failed to load bookings.</p>
          <p className="mt-2 text-sm text-red-500">
            {error.message || "Please try again later."}
          </p>
        </div>
      </div>
    );
  }

  const { bookings = [], role, totalCount = 0 } = (data ?? {}) as any;
  const isFamily = role === "FAMILY";
  const hasBookings = bookings.length > 0;

  return (
    <div className="max-w-6xl space-y-6 font-sans animate-in fade-in slide-in-from-bottom-3 duration-300">
      <BookingsHeader
        isFamily={isFamily}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={(filter) => {
          setActiveFilter(filter);
          setPage(1);
        }}
        counts={{
          ALL: totalCount,
          ACCEPTED: 0,
          COMPLETED: 0,
        }}
      />

      <div className="min-h-[450px]">
        {isLoading ? (
          <div className="flex h-full flex-col items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="mt-4 text-sm font-medium text-muted-foreground">
              Loading bookings...
            </p>
          </div>
        ) : hasBookings ? (
          <BookingsTable bookings={bookings} isFamily={isFamily} />
        ) : (
          <BookingsEmptyState
            isSearch={searchQuery.trim().length > 0}
            onResetSearch={() => {
              setSearchQuery("");
              setActiveFilter("ALL");
              setPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
}
