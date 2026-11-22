"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import {
  Heart,
  ShieldCheck,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  UserCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  PhoneCall,
  Activity,
  Award,
  Lock,
} from "lucide-react";

export default function GettingStartedWithCarePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const steps = [
    {
      num: "01",
      title: "Assess Your Care Needs & Goals",
      desc: "Determine the level of care required—whether it's light companionship, personal daily assistance, memory care, or round-the-clock live-in support.",
      icon: Activity,
      highlights: [
        "Companionship & light housekeeping",
        "Personal care & mobility support",
        "Dementia & specialized medical care",
      ],
    },
    {
      num: "02",
      title: "Search & Connect With Verified Caregivers",
      desc: "Browse detailed profiles of 100% background-checked, vetted independent caregivers. Review qualifications, hourly rates, languages, and verified family ratings.",
      icon: Search,
      highlights: [
        "Transparent hourly rates",
        "Verified credentials & background checks",
        "Direct messaging before booking",
      ],
    },
    {
      num: "03",
      title: "Customize Your Schedule & Care Plan",
      desc: "Design a tailored shift schedule that fits your routine. Book one-time visits, recurring weekly support, or continuous care with transparent billing.",
      icon: Calendar,
      highlights: [
        "Flexible shift scheduling",
        "No long-term lock-in contracts",
        "Custom care instructions & recipient profile",
      ],
    },
    {
      num: "04",
      title: "Secure Escrow Booking & Care Start",
      desc: "Confirm your shift with complete financial safety. Funds are held in Stripe Direct Escrow and released only after timesheet verification on shift completion.",
      icon: ShieldCheck,
      highlights: [
        "100% Stripe Escrow protection",
        "Real-time check-in and timesheets",
        "Dedicated 24/7 customer support",
      ],
    },
  ];

  const services = [
    {
      title: "Personal & Domiciliary Care",
      desc: "Essential assistance with personal hygiene, bathing, dressing, meal preparation, and medication reminders in the comfort of home.",
      icon: Heart,
      color: "bg-rose-50 text-rose-600 border-rose-100",
    },
    {
      title: "Specialized Dementia Care",
      desc: "Compassionate, trained support for loved ones living with Alzheimer's or memory impairment, maintaining a safe and familiar environment.",
      icon: Sparkles,
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      title: "Companionship & Assisted Visits",
      desc: "Social engagement, accompaniment to doctor appointments, grocery shopping, hobbies, and emotional support to prevent isolation.",
      icon: UserCheck,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Physical Disability Support",
      desc: "Personalized complex care for adults with long-term mobility conditions, stroke recovery, or physical disabilities requiring hoist/aid handling.",
      icon: Activity,
      color: "bg-sky-50 text-sky-600 border-sky-100",
    },
    {
      title: "Live-In & 24/7 Overnight Care",
      desc: "Continuous, round-the-clock peace of mind with a dedicated caregiver residing in the home to provide day and night assistance.",
      icon: Clock,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
  ];

  const faqs = [
    {
      q: "How quickly can care start after choosing a caregiver?",
      a: "Care shifts can often be arranged within 24 to 48 hours depending on caregiver availability. You can also schedule recurring shifts or plan care weeks in advance.",
    },
    {
      q: "How does Stripe Direct Escrow payment work?",
      a: "When you request a care shift, funds are held securely in Stripe Escrow. Your payment is held safely and is only released to the caregiver after the shift is completed and the timesheet is verified.",
    },
    {
      q: "Can I message a caregiver before sending a booking request?",
      a: "Yes! CareNest allows you to send direct messages to any caregiver to discuss specific care requirements, daily schedules, and recipient preferences before making a formal request.",
    },
    {
      q: "What background checks do CareNest caregivers undergo?",
      a: "All independent caregivers on CareNest undergo identity verification, DBS/background checks, reference verification, and credential validation before being listed on the platform.",
    },
    {
      q: "Can I adjust or cancel care shifts if my plans change?",
      a: "Yes, CareNest offers flexible shift management. You can adjust or cancel shifts directly through your client dashboard according to our transparent cancellation terms.",
    },
  ];

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col text-slate-900">
      {/* Main Header / Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-slate-50 to-white py-16 md:py-24 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-6">
            <Sparkles className="size-3.5 fill-current" />
            <span>Care Guidance & Setup Guide</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            Getting Started With Care Made Simple
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Arranging care for a loved one should be empowering, safe, and transparent. We guide you step-by-step to find verified caregivers, customize care plans, and manage escrow payments.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/search"
              className="w-full sm:w-auto inline-flex h-13 items-center justify-center rounded-2xl bg-primary px-8 text-sm font-extrabold text-white hover:bg-primary/95 transition-all shadow-md hover:shadow-lg active:scale-[0.98] gap-2"
            >
              <Search className="size-4" />
              <span>Find a Verified Caregiver</span>
            </Link>

            <Link
              href="/auth/signup"
              className="w-full sm:w-auto inline-flex h-13 items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 text-sm font-extrabold text-slate-800 hover:bg-slate-50 transition-all shadow-2xs gap-2"
            >
              <Heart className="size-4 text-rose-500 fill-current" />
              <span>Create Client Account</span>
            </Link>
          </div>

          {/* Quick Value Metrics */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200/60 text-left">
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-100 shadow-2xs">
              <ShieldCheck className="size-5 text-emerald-600 mb-1" />
              <p className="text-xs font-bold text-slate-900">100% Vetted</p>
              <p className="text-[11px] text-slate-500">ID & Background Checked</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-100 shadow-2xs">
              <Lock className="size-5 text-emerald-600 mb-1" />
              <p className="text-xs font-bold text-slate-900">Stripe Escrow</p>
              <p className="text-[11px] text-slate-500">Safe Direct Payment</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-100 shadow-2xs">
              <Clock className="size-5 text-primary mb-1" />
              <p className="text-xs font-bold text-slate-900">Fast Setup</p>
              <p className="text-[11px] text-slate-500">Care in 24–48 Hours</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-100 shadow-2xs">
              <Award className="size-5 text-amber-500 mb-1" />
              <p className="text-xs font-bold text-slate-900">No Upfront Contract</p>
              <p className="text-[11px] text-slate-500">Flexible Hourly Rates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Care Journey */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary">
              Your Guided Care Journey
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Four Steps to Arranging Quality Home Care
            </h3>
            <p className="text-sm text-slate-600 font-medium">
              We make every step of your care journey clear, secure, and stress-free.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={idx}
                  className="relative bg-slate-50/70 rounded-3xl border border-slate-100 p-6 flex flex-col justify-between hover:shadow-xl hover:bg-white transition-all duration-300 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200/60">
                        STEP {step.num}
                      </span>
                      <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <StepIcon className="size-5" />
                      </div>
                    </div>

                    <h4 className="text-lg font-extrabold text-slate-900 mb-2 leading-snug">
                      {step.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
                      {step.desc}
                    </p>
                  </div>

                  <ul className="space-y-1.5 pt-4 border-t border-slate-200/60 text-[11px] font-semibold text-slate-700">
                    {step.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Care Services Overview */}
      <section className="py-16 md:py-24 bg-slate-50 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary">
              Care Specialties
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Tailored Care Solutions for Every Need
            </h3>
            <p className="text-sm text-slate-600 font-medium">
              Explore specialized support categories available through CareNest independent caregiver partners.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((srv, idx) => {
              const SrvIcon = srv.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-slate-100 p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div
                      className={`size-12 rounded-2xl flex items-center justify-center border ${srv.color}`}
                    >
                      <SrvIcon className="size-6" />
                    </div>
                    <h4 className="text-lg font-black text-slate-900">
                      {srv.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {srv.desc}
                    </p>
                  </div>

                  <Link
                    href="/search"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline pt-2"
                  >
                    <span>View Caregivers</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety & Escrow Guarantees */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-extrabold text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="size-4 text-emerald-400" />
                  <span>CareNest Peace-of-Mind Guarantee</span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                  Your Financial & Physical Safety Is Our #1 Priority
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  We built CareNest to eliminate the uncertainty and high agency markups of traditional care. Every transaction is protected with Stripe Direct Escrow, and every caregiver is thoroughly vetted.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <CheckCircle2 className="size-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-white">Stripe Direct Escrow</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Payouts released only after timesheet approval.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <CheckCircle2 className="size-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-white">Verified Caregivers</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        DBS, identity, and background check verified.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6 space-y-4 text-center">
                <Heart className="size-12 text-rose-400 mx-auto fill-current animate-pulse" />
                <h4 className="text-lg font-bold text-white">Need Help Getting Started?</h4>
                <p className="text-xs text-slate-300 font-medium">
                  Our dedicated care coordination team is ready to guide you through setting up care for your loved one.
                </p>
                <Link
                  href="/search"
                  className="w-full inline-flex h-12 items-center justify-center rounded-xl bg-primary text-white font-extrabold text-xs hover:bg-primary/95 transition-all shadow-md"
                >
                  Explore Available Caregivers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary">
              Got Questions?
            </h2>
            <h3 className="text-3xl font-black text-slate-900">
              Frequently Asked Questions About Care Setup
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-bold text-sm text-slate-900">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="size-5 text-primary shrink-0" />
                    ) : (
                      <ChevronDown className="size-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed font-medium border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call To Action Footer Banner */}
      <section className="py-16 bg-primary text-primary-foreground text-center">
        <div className="mx-auto max-w-4xl px-6 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Arrange Care for Your Loved One?
          </h2>
          <p className="text-sm text-primary-foreground/90 font-medium max-w-xl mx-auto">
            Find vetted, compassionate independent caregivers in your area with transparent billing and Stripe Escrow security.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/search"
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-2xl bg-white text-primary font-black text-xs px-8 hover:bg-slate-100 transition-all shadow-md"
            >
              Browse Caregivers Now
            </Link>
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-2xl border border-white/30 text-white font-extrabold text-xs px-8 hover:bg-white/10 transition-all"
            >
              Register Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <Footer />
    </div>
  );
}
