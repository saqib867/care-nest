import Link from "next/link";
import { Heart, ShieldCheck, HeartHandshake, ArrowRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Navbar />

      {/* Main Container */}
      <main className="mx-auto max-w-4xl px-6 py-16 space-y-12">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-gray-900">
            About <span className="text-primary">CareNest</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We are dedicated to redefining home care by connecting families with vetted, premium caregivers through direct, transparent escrow payments.
          </p>
        </div>

        {/* Mission Grid */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Heart className="size-6 fill-current" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              CareNest was founded on a simple belief: finding compassionate, qualified care for loved ones should be simple, safe, and transparent. We bridge the gap between families seeking certified caregiver partners and professional caregivers wanting direct control over their schedules, services, and earnings.
            </p>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="border border-border bg-card rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Premium Verification</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every caregiver partner on our platform undergoes rigorous identity verification, reference calls, and criminal record screening to ensure total peace of mind.
            </p>
          </div>

          <div className="border border-border bg-card rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <HeartHandshake className="size-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Direct Stripe Escrow</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Say goodbye to administrative headaches. Payments are secured in a smart escrow system and released automatically upon timesheet approval, protecting both families and caregivers.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 rounded-3xl border border-primary/10 p-8 text-center space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Ready to find local, premium care?</h3>
          <p className="text-xs text-muted-foreground">Search and message approved caregivers in your community today.</p>
          <div className="pt-2">
            <Link 
              href="/search"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-xs font-bold text-primary-foreground hover:bg-primary/95 transition-all shadow-md gap-1.5"
            >
              <span>Explore Directory</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
