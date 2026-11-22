"use client";

import { Check, ShieldCheck } from "lucide-react";

interface CredentialsTabProps {
  cg: any;
}

export function CredentialsTab({ cg }: CredentialsTabProps) {
  const certifications = cg?.certifications || [];

  return (
    <div className="space-y-6">
      <h2 className="font-bold text-lg text-primary">
        Certifications & Licenses
      </h2>

      {certifications.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {certifications.map((cert: string, index: number) => (
            <div
              key={cert + index}
              className="flex items-center gap-3 border border-border/60 rounded-xl p-4 bg-background/50"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                <Check className="size-4" />
              </div>
              <span className="text-sm font-bold text-foreground">{cert}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          No verified certifications listed.
        </p>
      )}

      <div className="border-t border-border mt-6 pt-6 space-y-4">
        <h3 className="font-bold text-sm text-foreground">
          Verification Check
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-secondary" /> Criminal Record
              Check (CRB)
            </span>
            <span className="font-bold text-secondary">Vetted & Approved</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-secondary" /> ID Verification
            </span>
            <span className="font-bold text-secondary">Verified</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-secondary" /> Reference
              Verification
            </span>
            <span className="font-bold text-secondary">
              3 Reference Calls Confirmed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
