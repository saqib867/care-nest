"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useFeaturedCaregivers } from "@/app/hook/useFeaturedCaregivers";

export default function FeaturedCaregivers() {
  const { data, isLoading } = useFeaturedCaregivers({ limit: 6 });
  const featuredCaregivers = data?.caregivers || [];

  return (
    <section className="py-20 bg-card border-b border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Featured Care Professionals
            </h2>
            <p className="text-muted-foreground mt-2">
              Highly recommended independent caregivers available in your area.
            </p>
          </div>
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline hover:gap-2 transition-all"
          >
            <span>Browse all caregivers</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 className="size-8 text-primary animate-spin" />
              <p className="text-xs font-semibold text-muted-foreground animate-pulse">
                Loading featured caregivers...
              </p>
            </div>
          ) : featuredCaregivers.length === 0 ? (
            <div className="col-span-full text-center py-12 text-xs text-muted-foreground">
              No caregivers found in the database.
            </div>
          ) : (
            featuredCaregivers.map((cg) => (
              <Link
                key={cg.id}
                href={`/caregivers/${cg.id}`}
                className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 animate-in fade-in"
              >
                {/* Profile Avatar Card */}
                <div className="aspect-square relative w-full bg-muted overflow-hidden">
                  <Image
                    src={cg.avatar}
                    alt={cg.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {cg.isPremium && (
                    <span className="absolute top-3 left-3 rounded-full bg-accent text-accent-foreground px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Sparkles className="size-3 fill-current" />
                      Premium
                    </span>
                  )}
                  {cg.isVerified && (
                    <span className="absolute top-3 right-3 rounded-full bg-secondary text-secondary-foreground p-1 shadow-sm">
                      <ShieldCheck className="size-4" />
                    </span>
                  )}
                </div>

                {/* Profile Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                        {cg.name}
                      </h3>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <MapPin className="size-3.5 text-primary shrink-0" />
                      <span>{cg.location}</span>
                    </p>

                    {/* Stars */}
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                      <Star className="size-3.5 fill-current" />
                      <span>{cg.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground font-normal">
                        ({cg.reviewCount} reviews)
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 pt-1">
                      {cg.bio}
                    </p>
                  </div>

                  <div className="border-t border-border mt-4 pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Hourly Rate
                      </p>
                      <p className="text-lg font-extrabold text-primary">
                        {cg.hourlyRate.toFixed(2)}{" "}
                        <span className="text-xs font-semibold text-muted-foreground">
                          {cg.currency}/hr
                        </span>
                      </p>
                    </div>
                    <div className="rounded-lg bg-primary/5 text-primary px-2.5 py-1.5 text-xs font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      View Profile
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
        {/* Brower more button */}
        <div className="flex items-center justify-center mt-12">
          <Link
            href="/search"
            className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
          >
            Browse all caregivers
          </Link>
        </div>
      </div>
    </section>
  );
}
