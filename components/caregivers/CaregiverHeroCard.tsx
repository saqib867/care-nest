"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Star,
  MapPin,
  Heart,
  MessageSquare,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface CaregiverHeroCardProps {
  cg: any;
  isFavorite: boolean;
  setIsFavorite: (val: boolean) => void;
}

export function CaregiverHeroCard({
  cg,
  isFavorite,
  setIsFavorite,
}: CaregiverHeroCardProps) {
  return (
    <div className="bg-card rounded-3xl border border-border p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative overflow-hidden">
      {cg.isPremium && (
        <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-4 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 rounded-bl-2xl">
          <Sparkles className="size-3 fill-current" />
          Premium Caregiver
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
        <div className="size-28 rounded-2xl overflow-hidden relative bg-muted border border-border shadow-sm">
          <Image src={cg.avatar} alt={cg.name} fill className="object-cover" />
        </div>
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center md:justify-start">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {cg.name}
            </h1>
            {cg.isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-0.5 text-[10px] font-bold text-secondary mx-auto sm:mx-0">
                <ShieldCheck className="size-3.5" />
                Verified Partner
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-muted-foreground flex items-center justify-center md:justify-start gap-1">
            <MapPin className="size-4 text-primary shrink-0" />
            <span>{cg.location}</span>
          </p>

          <div className="flex items-center justify-center md:justify-start gap-1 text-amber-500 text-sm font-semibold">
            <Star className="size-4 fill-current" />
            <span>{cg.rating.toFixed(1)}</span>
            <span className="text-muted-foreground font-normal">
              ({cg.reviewCount} verified reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 border-border pt-6 md:pt-0">
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`flex-1 md:w-44 inline-flex py-3 h-10 items-center justify-center rounded-xl border border-border bg-background text-xs font-bold transition-all gap-1.5 ${
            isFavorite
              ? "text-rose-500 border-rose-100 bg-rose-50/50"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <Heart className={`size-4 ${isFavorite ? "fill-current" : ""}`} />
          <span>{isFavorite ? "Favorited" : "Save Favorite"}</span>
        </button>
        <Link
          href={`/messages?userId=${cg.id}&userName=${encodeURIComponent(cg.name)}`}
          className="flex-1 md:w-44 py-3 inline-flex h-14 items-center justify-center rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/95 transition-colors gap-1.5 shadow-sm"
        >
          <MessageSquare className="size-4" />
          <span>Direct Message</span>
        </Link>
      </div>
    </div>
  );
}
