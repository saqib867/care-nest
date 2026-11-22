"use client";

import Image from "next/image";
import { Sparkles, ShieldCheck, Star, CheckCircle2 } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 bg-gradient-to-b from-primary/5 via-transparent to-background">
      {/* Ambient background accents */}
      <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 size-96 rounded-full bg-secondary/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 relative">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          {/* Hero Text */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20">
              <Sparkles className="size-3.5" />
              <span>Premium AI-Assisted Care Matching</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight md:leading-[1.05]">
              Professional Care You Can{" "}
              <span className="relative inline-block text-primary">
                Trust
                <svg
                  className="absolute -bottom-1 left-0 w-full text-primary/40"
                  viewBox="0 0 100 8"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 5 Q 25 0, 50 4 T 100 3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              , Right at Home
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Find, book, and manage certified independent caregivers. Designed
              for families who refuse to compromise on dignity, quality, and
              safety.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button className="w-full sm:w-auto rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                Find a Caregiver
              </button>
              <button className="w-full sm:w-auto rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                How It Works
              </button>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <span className="font-medium text-foreground">4.9/5</span>
                <span>from 2,300+ families</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-primary" />
                <span>No booking fees</span>
              </div>
            </div>
          </div>

          {/* Hero Graphic Column */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-2xl relative border-4 border-card bg-muted">
              <Image
                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=600&h=750"
                alt="Friendly home caregiver assisting elderly lady"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Floating Badge - verified */}
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-card/95 backdrop-blur-sm p-4 border border-border shadow-lg flex items-center gap-3 animate-bounce-slow">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    100% Verified Caregivers
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    DBS checked, certified, and fully references vetted.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating stat card */}
            <div className="absolute -top-5 -left-8 rounded-2xl bg-card p-4 border border-border shadow-xl">
              <p className="text-2xl font-extrabold text-primary leading-none">
                12k+
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Care hours matched
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
