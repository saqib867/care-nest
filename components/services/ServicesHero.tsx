"use client";

import Link from "next/link";
import { Search, Sparkles, Heart, ArrowRight } from "lucide-react";

interface ServicesHeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalServices: number;
}

export function ServicesHero({
  searchQuery,
  onSearchChange,
  totalServices,
}: ServicesHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-slate-50 to-white py-14 md:py-20 border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-5">
          <Sparkles className="size-3.5 fill-current" />
          <span>CareNest Services Directory</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
          Explore Our Care Services
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
          Comprehensive, compassionate, and professional home care services tailored to your family's unique needs.
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search services by name, keywords, or ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-md"
          />
          {totalServices > 0 && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              {totalServices} Available
            </span>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-6 flex items-center justify-center gap-3 text-xs font-bold text-slate-500">
          <span>Looking for custom care?</span>
          <Link
            href="/search"
            className="text-primary hover:underline flex items-center gap-1"
          >
            <span>Find a Caregiver Now</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
