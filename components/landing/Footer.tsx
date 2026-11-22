"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-6 grid gap-8 md:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Heart className="size-4 fill-current" />
            </div>
            <span className="text-lg font-bold tracking-tight text-primary">CareNest</span>
          </Link>
          <p className="text-xs text-muted-foreground">
            The premium, AI-powered operating system and marketplace for independent home care businesses and families.
          </p>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} CareNest Inc. All rights reserved.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-sm text-foreground uppercase tracking-wider mb-4">For Families</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><Link href="/getting-started-with-care" className="hover:text-primary transition-colors">Getting Started with Care</Link></li>
            <li><Link href="/search" className="hover:text-primary transition-colors">Find a Caregiver</Link></li>
            <li><Link href="/auth/signup" className="hover:text-primary transition-colors">Client Portal</Link></li>
            <li><a href="#" className="hover:text-primary transition-colors">Payment Escrows</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Dementia Specialist Care</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm text-foreground uppercase tracking-wider mb-4">For Caregivers</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><Link href="/auth/signup" className="hover:text-primary transition-colors">Register as Caregiver</Link></li>
            <li><Link href="/dashboard?role=caregiver" className="hover:text-primary transition-colors">Earnings Dashboard</Link></li>
            <li><a href="#" className="hover:text-primary transition-colors">Premium Profiles</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Verification Services</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm text-foreground uppercase tracking-wider mb-4">Global Network</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex gap-2">🇩🇪 <span>Germany</span></li>
            <li className="flex gap-2">🇦🇹 <span>Austria</span></li>
            <li className="flex gap-2">🇨🇭 <span>Switzerland</span></li>
            <li className="flex gap-2">🇺🇸 <span>United States (Beta)</span></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
