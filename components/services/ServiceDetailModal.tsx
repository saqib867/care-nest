"use client";

import Link from "next/link";
import { format, parseISO, isValid } from "date-fns";
import { X, Calendar, Sparkles, Heart, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { ServiceItem } from "@/app/actions/services";

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
}

export function ServiceDetailModal({ service, onClose }: ServiceDetailModalProps) {
  if (!service) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Recently Added";
    try {
      const parsed = parseISO(dateStr);
      if (isValid(parsed)) {
        return format(parsed, "MMMM d, yyyy 'at' h:mm a");
      }
      return dateStr;
    } catch {
      return dateStr || "Recently Added";
    }
  };

  const isLoremIpsum = service.content.toLowerCase().includes("lorem ipsum");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="size-5" />
        </button>

        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2 pr-8">
          <span className="inline-flex items-center gap-1 text-xs font-extrabold text-primary bg-primary/10 px-3 py-1 rounded-full">
            <Sparkles className="size-3.5 fill-current" />
            <span>Service ID: {service.id}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            <Calendar className="size-3.5" />
            <span>Created: {formatDate(service.createdAt)}</span>
          </span>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            {service.name}
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Verified CareNest Service Offerings
          </p>
        </div>

        {/* Service Content */}
        <div className="space-y-3 bg-slate-50/80 rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <FileText className="size-4 text-primary" />
              Service Overview & Specifications
            </span>
            {isLoremIpsum && (
              <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold">
                Default Content Applied
              </span>
            )}
          </div>

          <p className="text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-line">
            {service.content}
          </p>
        </div>

        {/* Key Features */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            Standard Included Service Benefits
          </h4>
          <ul className="grid sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
            <li className="flex items-center gap-2 bg-emerald-50/60 text-emerald-800 p-2.5 rounded-xl border border-emerald-100">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span>100% Background-Checked Staff</span>
            </li>
            <li className="flex items-center gap-2 bg-emerald-50/60 text-emerald-800 p-2.5 rounded-xl border border-emerald-100">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span>Stripe Direct Escrow Protection</span>
            </li>
            <li className="flex items-center gap-2 bg-emerald-50/60 text-emerald-800 p-2.5 rounded-xl border border-emerald-100">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span>Custom Daily Schedules</span>
            </li>
            <li className="flex items-center gap-2 bg-emerald-50/60 text-emerald-800 p-2.5 rounded-xl border border-emerald-100">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span>24/7 Verified Support Logs</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto h-11 px-6 rounded-2xl border border-slate-200 text-slate-700 font-extrabold text-xs hover:bg-slate-50 transition-colors"
          >
            Close Window
          </button>

          <Link
            href="/search"
            className="w-full sm:w-auto inline-flex h-11 items-center justify-center rounded-2xl bg-primary text-white font-extrabold text-xs px-6 hover:bg-primary/95 transition-all shadow-md gap-2"
          >
            <span>Book Caregivers For This Service</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
