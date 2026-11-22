"use client";

import { format, parseISO, isValid } from "date-fns";
import { Heart, Calendar, ArrowRight, Sparkles, Clock, FileText } from "lucide-react";
import { ServiceItem } from "@/app/actions/services";

interface ServiceCardProps {
  service: ServiceItem;
  onSelect: (service: ServiceItem) => void;
}

export function ServiceCard({ service, onSelect }: ServiceCardProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Recently Added";
    try {
      const parsed = parseISO(dateStr);
      if (isValid(parsed)) {
        return format(parsed, "MMM d, yyyy");
      }
      return dateStr;
    } catch {
      return dateStr || "Recently Added";
    }
  };

  const isLoremIpsum = service.content.toLowerCase().includes("lorem ipsum");

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-7 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
      {/* Top Accent Pill */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
          <Sparkles className="size-3 fill-current" />
          <span>ID: {service.id.length > 12 ? `${service.id.slice(0, 8)}...` : service.id}</span>
        </span>

        <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
          <Calendar className="size-3.5 text-slate-400 shrink-0" />
          <span>{formatDate(service.createdAt)}</span>
        </span>
      </div>

      {/* Title & Body */}
      <div className="space-y-3 mb-6">
        <h3 className="text-lg font-black text-slate-900 leading-snug group-hover:text-primary transition-colors">
          {service.name}
        </h3>

        <div className="relative">
          <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
            {service.content}
          </p>

          {isLoremIpsum && (
            <span className="inline-block mt-2 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
              Sample Overview (Lorem Ipsum)
            </span>
          )}
        </div>
      </div>

      {/* Footer Action Button */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onSelect(service)}
          className="w-full inline-flex h-11 items-center justify-center rounded-2xl bg-slate-50 hover:bg-primary hover:text-white text-slate-800 font-extrabold text-xs transition-all duration-200 cursor-pointer gap-2 group-hover:bg-primary group-hover:text-white shadow-2xs"
        >
          <span>View Details & Content</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
