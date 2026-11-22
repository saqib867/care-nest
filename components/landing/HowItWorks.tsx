"use client";

import { Search, CheckCircle2, ShieldCheck } from "lucide-react";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-background scroll-mt-16">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-3 mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight">
            The Modern Way to Find Home Care
          </h2>
          <p className="text-muted-foreground text-lg">
            We cut out costly, traditional agencies, giving you direct access,
            complete control, and ultimate transparency.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Step 1 */}
          <div className="bg-card rounded-2xl border border-border p-8 relative flex flex-col items-center hover:translate-y-[-4px] transition-transform duration-300">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
              <Search className="size-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">1. Search & Match</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Filter caregivers by certifications, languages, rate, gender, and
              live schedules. Review verified background credentials and real
              family feedback.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-card rounded-2xl border border-border p-8 relative flex flex-col items-center hover:translate-y-[-4px] transition-transform duration-300">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary mb-6">
              <CheckCircle2 className="size-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">2. Book & Secure Pay</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Confirm bookings and schedule shifts directly on the caregiver's
              calendar. Make secure digital payments backed by Stripe escrows.
              No onboarding fees.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-card rounded-2xl border border-border p-8 relative flex flex-col items-center hover:translate-y-[-4px] transition-transform duration-300">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-6">
              <ShieldCheck className="size-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">3. Direct Operations</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Coordinate schedules, request timesheet approvals, chat in
              real-time, and manage ongoing medical compliance checklists
              easily.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
