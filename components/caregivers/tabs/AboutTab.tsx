"use client";

import { HeartHandshake, Award, Check } from "lucide-react";

interface AboutTabProps {
  cg: any;
}

export function AboutTab({ cg }: AboutTabProps) {
  const servicesList: string[] = Array.isArray(cg?.services) ? cg.services : [];
  const specializationsList: string[] = Array.isArray(cg?.specializations)
    ? cg.specializations
    : [];

  return (
    <div className="space-y-6">
      {/* Professional Statement */}
      <div className="space-y-3">
        <h2 className="font-bold text-lg text-primary">
          Professional Statement
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {cg?.bio || "No professional statement provided."}
        </p>
      </div>

      {/* Services & Specializations */}
      <div className="grid gap-6 sm:grid-cols-2 pt-5 border-t border-border">
        {/* Services Provided */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <HeartHandshake className="size-4 text-rose-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Services Offered
            </h3>
          </div>
          {servicesList.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {servicesList.map((srv: string, idx: number) => (
                <span
                  key={srv + idx}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 text-primary border border-primary-100 px-3 py-1 text-xs font-semibold"
                >
                  <Check className="size-3 text-primary shrink-0" />
                  {srv}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No services listed
            </p>
          )}
        </div>

        {/* Specializations */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Award className="size-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Specialities & Focus Areas
            </h3>
          </div>
          {specializationsList.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {specializationsList.map((spec: string, idx: number) => (
                <span
                  key={spec + idx}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50/80 text-amber-800 border border-amber-200/60 px-3 py-1 text-xs font-semibold"
                >
                  <Check className="size-3 text-amber-600 shrink-0" />
                  {spec}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No specializations listed
            </p>
          )}
        </div>
      </div>

      {/* Languages & Statistics */}
      <div className="grid gap-6 sm:grid-cols-2 pt-5 border-t border-border">
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Languages
          </h4>
          <div className="flex flex-wrap gap-2">
            {cg?.languages && cg.languages.length > 0 ? (
              cg.languages.map((l: string) => (
                <span
                  key={l}
                  className="rounded-lg bg-muted px-3 py-1 text-xs font-medium text-foreground"
                >
                  {l}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground italic">
                None specified
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Profile Statistics
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="border border-border/60 rounded-lg p-2.5 bg-background/50">
              <p className="text-muted-foreground font-medium">Experience</p>
              <p className="font-bold text-foreground text-sm mt-0.5">
                {cg?.experienceYears ?? 0} Years
              </p>
            </div>
            <div className="border border-border/60 rounded-lg p-2.5 bg-background/50">
              <p className="text-muted-foreground font-medium">Gender</p>
              <p className="font-bold text-foreground text-sm mt-0.5">
                {cg?.gender || "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
