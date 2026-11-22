"use client";

import { Loader2, Search, Heart } from "lucide-react";
import { ServiceItem } from "@/app/actions/services";
import { ServiceCard } from "./ServiceCard";

interface ServicesGridProps {
  services: ServiceItem[];
  isLoading: boolean;
  searchQuery: string;
  onResetSearch: () => void;
  onSelectService: (service: ServiceItem) => void;
}

export function ServicesGrid({
  services,
  isLoading,
  searchQuery,
  onResetSearch,
  onSelectService,
}: ServicesGridProps) {
  if (isLoading) {
    return (
      <div className="py-16 text-center space-y-4">
        <Loader2 className="size-8 text-primary animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-500 animate-pulse">
          Loading care services from database...
        </p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="bg-slate-50 rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto space-y-4">
        <div className="size-12 rounded-2xl bg-white text-slate-400 flex items-center justify-center mx-auto shadow-2xs">
          <Search className="size-6" />
        </div>
        <h3 className="text-lg font-black text-slate-900">
          No Care Services Found
        </h3>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          {searchQuery
            ? `No services matched "${searchQuery}". Try adjusting your search term.`
            : "No services are currently listed in the directory."}
        </p>
        {searchQuery && (
          <button
            type="button"
            onClick={onResetSearch}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 text-white font-extrabold text-xs px-5 hover:bg-slate-800 transition-colors"
          >
            Clear Search Filter
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onSelect={onSelectService}
        />
      ))}
    </div>
  );
}
