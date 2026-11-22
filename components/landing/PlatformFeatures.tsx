"use client";

import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";

export default function PlatformFeatures() {
  return (
    <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_50%)]" />
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Empowering Caregivers, Supporting Families
            </h2>
            <p className="text-primary-foreground/80 text-lg leading-relaxed">
              Traditional agencies mark up caregiver rates by up to 50%. Care Nest connects you directly, ensuring caregivers earn more while families pay less.
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-secondary shrink-0 mt-0.5 fill-current text-white/90" />
                <div>
                  <strong className="font-semibold block text-white">Full Autonomy for Caregivers</strong>
                  <span className="text-sm text-primary-foreground/70">Set your own rates, choose your clients, and manage your hours.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-secondary shrink-0 mt-0.5 fill-current text-white/90" />
                <div>
                  <strong className="font-semibold block text-white">Transparent Booking History</strong>
                  <span className="text-sm text-primary-foreground/70">Track work timesheets, invoices, and payments in one clean dashboard.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-secondary shrink-0 mt-0.5 fill-current text-white/90" />
                <div>
                  <strong className="font-semibold block text-white">Stripe Integrated Escrow</strong>
                  <span className="text-sm text-primary-foreground/70">Securely release funds only after caregiver shifts are completed.</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-card text-foreground rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Sparkles className="size-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-primary">Earn More, Keep More</h3>
                <p className="text-xs text-muted-foreground">Standard platforms take massive percentages. We keep it simple.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-border rounded-2xl p-5 bg-background text-center">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Platform Commission</p>
                <p className="text-3xl font-black text-secondary mt-1">15%</p>
                <p className="text-[10px] text-muted-foreground mt-1">Per Booking</p>
              </div>
              <div className="border border-border rounded-2xl p-5 bg-background text-center">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Caregiver Profiles</p>
                <p className="text-3xl font-black text-primary mt-1">100%</p>
                <p className="text-[10px] text-muted-foreground mt-1">Independent Rates</p>
              </div>
            </div>

            <div className="rounded-2xl bg-muted p-4 text-center">
              <p className="text-xs text-muted-foreground">
                Want to boost your listings? Upgrade to a <strong>Premium Caregiver Profile</strong> to gain priority rankings in search listings.
              </p>
            </div>

            <Link 
              href="/auth/signup"
              className="w-full inline-flex h-11 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-colors"
            >
              Become a Caregiver Today
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
