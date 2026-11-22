"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Loader2,
  SearchCheckIcon,
  Sparkles,
  ShieldCheck,
  Star,
  MapPin,
  Award,
} from "lucide-react";
import { SearchCaregiverResult } from "@/app/actions/search";

interface CaregiverListingsProps {
  loading: boolean;
  caregivers: SearchCaregiverResult[];
  clearFilters: () => void;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

export function CaregiverListings({
  loading,
  caregivers,
  clearFilters,
  page,
  setPage,
  totalPages,
}: CaregiverListingsProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 bg-card rounded-3xl border border-border space-y-4 shadow-sm animate-pulse">
        <Loader2 className="size-8 text-primary animate-spin" />
        <p className="text-xs font-bold text-muted-foreground">
          Querying local caregiver profiles...
        </p>
      </div>
    );
  }

  if (caregivers.length === 0) {
    return (
      <div className="text-center py-20 bg-card rounded-3xl border border-border animate-in fade-in duration-300 shadow-sm">
        <SearchCheckIcon className="size-12 text-muted-foreground mx-auto mb-4 stroke-1" />
        <h3 className="text-lg font-bold text-gray-900">No matching caregivers found</h3>
        <p className="text-xs text-muted-foreground mt-1.5 px-6 max-w-sm mx-auto leading-relaxed">
          Try widening your experience filter, adjusting the maximum hourly rate slider, or selecting another weekday.
        </p>
        <button
          onClick={clearFilters}
          className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/95 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 2-Column Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {caregivers.map((cg) => (
          <div
            key={cg.id}
            className={`bg-card rounded-3xl border p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group hover:-translate-y-0.5 ${
              cg.isPremium
                ? "border-primary/25 bg-gradient-to-br from-primary/[0.02] to-card"
                : "border-border/80"
            }`}
          >
            {/* Premium Corner Tag */}
            {cg.isPremium && (
              <div className="absolute top-0 right-0 rounded-bl-2xl bg-accent text-accent-foreground px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Sparkles className="size-3 fill-current" />
                Premium Partner
              </div>
            )}

            <div className="space-y-4">
              {/* Avatar & Basic Info */}
              <div className="flex gap-4 items-start">
                <div className="size-16 rounded-2xl overflow-hidden relative bg-muted border border-border shadow-sm shrink-0">
                  <Image src={cg.avatar} alt={cg.name} fill className="object-cover" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-extrabold text-base text-gray-900 leading-tight group-hover:text-primary transition-colors">
                      {cg.name}
                    </h3>
                    {cg.isVerified && (
                      <ShieldCheck className="size-4 text-secondary shrink-0" />
                    )}
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="size-3.5 fill-current" />
                    <span>{cg.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground font-normal">
                      ({cg.reviewCount})
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges Info Row */}
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-muted-foreground font-semibold">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-primary shrink-0" />
                  {cg.location}
                </span>
                <span className="flex items-center gap-1">
                  <Award className="size-3.5 text-secondary shrink-0" />
                  {cg.experienceYears} Years Exp
                </span>
              </div>

              {/* Bio statement */}
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {cg.bio}
              </p>

              {/* Languages & Skills list */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {cg.languages.slice(0, 2).map((l) => (
                  <span
                    key={l}
                    className="rounded-lg bg-gray-50 border border-gray-100 px-2 py-0.5 text-[10px] text-gray-500 font-semibold"
                  >
                    {l}
                  </span>
                ))}
                {cg.certifications.slice(0, 2).map((c) => (
                  <span
                    key={c}
                    className="rounded-lg bg-primary/5 text-primary px-2.5 py-0.5 text-[10px] font-bold border border-primary/10"
                  >
                    {c}
                  </span>
                ))}
                {cg.certifications.length > 2 && (
                  <span className="text-[10px] text-muted-foreground font-bold pt-0.5">
                    +{cg.certifications.length - 2} more
                  </span>
                )}
              </div>
            </div>

            {/* Pricing & CTA Action Footer */}
            <div className="border-t border-border/60 mt-4 pt-4 flex items-center justify-between gap-4">
              <div className="text-left shrink-0">
                <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest leading-none">
                  Hourly Rate
                </p>
                <p className="text-lg font-black text-primary mt-1">
                  {cg.hourlyRate.toFixed(2)}{" "}
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    {cg.currency}/hr
                  </span>
                </p>
              </div>

              <div className="flex gap-2 w-full max-w-[180px]">
                <Link
                  href={`/caregivers/${cg.id}`}
                  className="flex-1 inline-flex h-8 items-center justify-center rounded-xl bg-primary text-primary-foreground text-[11px] font-bold hover:bg-primary/95 transition-all shadow-sm active:scale-[0.98]"
                >
                  Profile
                </Link>
                <Link
                  href={`/caregivers/${cg.id}?book=true`}
                  className="flex-1 inline-flex h-8 items-center justify-center rounded-xl border border-border/80 bg-background text-[11px] font-bold text-muted-foreground hover:bg-muted transition-all active:scale-[0.98]"
                >
                  Quick Book
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6 border-t border-border">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-sm font-semibold text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-card cursor-pointer transition-all"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }).map((_, index) => {
            const pNum = index + 1;
            return (
              <button
                key={pNum}
                onClick={() => setPage(pNum)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  page === pNum
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {pNum}
              </button>
            );
          })}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-sm font-semibold text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-card cursor-pointer transition-all"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
