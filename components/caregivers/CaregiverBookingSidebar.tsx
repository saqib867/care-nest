"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Clock,
  Lock,
} from "lucide-react";
import { ModalType } from "@/components/modals/useModalStore";
import { useMe } from "@/app/hook/useMe";

interface CaregiverBookingSidebarProps {
  cg: any;
  openModal: (type: ModalType, data?: any) => void;
}

export function CaregiverBookingSidebar({
  cg,
  openModal,
}: CaregiverBookingSidebarProps) {
  const router = useRouter();
  const { data: me } = useMe();

  const name =
    cg?.name ||
    `${cg?.firstName || "Caregiver"} ${cg?.lastName || ""}`.trim() ||
    "Caregiver Partner";

  const caregiverId = cg?.id || "";
  const hourlyRate = Number(cg?.hourlyRate || 25);
  const currency = cg?.currency || "USD";

  const handleRequestCare = () => {
    if (!me?.id) {
      router.push(`/auth/signin?redirect=/caregivers/${caregiverId}`);
      return;
    }

    openModal("requestCare", { caregiver: cg });
  };

  return (
    <aside className="lg:col-span-4 lg:mt-[69px] sticky top-24 space-y-4">
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-xl shadow-slate-200/50 space-y-6">
        {/* Billing Rate Header */}
        <div>
          {/* <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Standard Billing Rate
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              <ShieldCheck className="size-3 text-emerald-600" />
              Escrow Protected
            </span>
          </div> */}

          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl flex items-center gap-2 font-black text-slate-900 tracking-tight">
              <> {currency}</>
              <> {hourlyRate.toFixed(2)}</>
            </span>
            <span className="text-xs font-extrabold text-slate-400">/hr</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-2 pt-2 border-t border-slate-100">
            <Clock className="size-3.5 text-primary shrink-0" />
            <span>Typically responds in &lt; 1 hour</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleRequestCare}
            className="w-full inline-flex h-12 items-center justify-center rounded-2xl bg-primary hover:bg-primary/95 text-white font-extrabold text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer gap-2"
          >
            <Calendar className="size-4.5" />
            <span>Request Care Shift</span>
          </button>

          {/* {caregiverId && (
            <Link
              href={`/messages?userId=${caregiverId}&userName=${encodeURIComponent(
                name,
              )}`}
              className="w-full inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all gap-2 shadow-2xs"
            >
              <MessageSquare className="size-4 text-primary" />
              <span>Message Caregiver</span>
            </Link>
          )} */}
        </div>

        {/* Available Care Modes */}
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Supported Care Modes
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold bg-sky-50 text-sky-700 border border-sky-200/80">
              One-time Care
            </span>
            <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200/80">
              Recurring Care
            </span>
            <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200/80">
              Live-in Care
            </span>
          </div>
        </div>

        {/* CareNest Booking Guarantee Card */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/30 border border-slate-100 p-4 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-extrabold">
            <Lock className="size-4 text-emerald-600 shrink-0" />
            <span>CareNest Booking Guarantee</span>
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-600 font-medium">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
              <span>Funds securely held in Stripe Escrow</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
              <span>100% Verified background & ID checks</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
              <span>Payout released only after timesheet approval</span>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
