"use client";

import Image from "next/image";
import {
  Loader2,
  Sparkles,
  Globe,
  Calendar,
  HeartHandshake,
  Award,
  Clock,
} from "lucide-react";
import { useMe } from "@/app/hook/useMe";
import { format, parse, isValid } from "date-fns";
import { PersonalInfoCard } from "./caregiver-profile/PersonalInfoCard";

const formatTime12h = (timeStr?: string) => {
  if (!timeStr) return "";
  const cleaned = String(timeStr).trim();
  if (!cleaned) return "";

  if (/am|pm/i.test(cleaned)) return cleaned;

  const formatsToTry = ["HH:mm:ss", "HH:mm", "H:mm", "HH:mm:ss.SSS"];
  for (const fmt of formatsToTry) {
    try {
      const parsed = parse(cleaned, fmt, new Date(0));
      if (isValid(parsed)) {
        return format(parsed, "h:mm a");
      }
    } catch {
      // continue
    }
  }

  return cleaned;
};
import { ProfessionalDetailsCard } from "./caregiver-profile/ProfessionalDetailsCard";
import { ServicesSpecialtiesCard } from "./caregiver-profile/ServicesSpecialtiesCard";
import { AvailabilitySchedulerCard } from "./caregiver-profile/AvailabilitySchedulerCard";
import { ProfessionalBioCard } from "./caregiver-profile/ProfessionalBioCard";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function CaregiverProfile() {
  const { data: me, isLoading } = useMe();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="size-8 text-primary animate-spin" />
        <p className="text-sm text-gray-500 font-medium animate-pulse">
          Loading profile settings...
        </p>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="bg-red-50 border border-red-100 text-red-600 font-semibold p-6 rounded-2xl text-xs text-center max-w-xl mx-auto my-8">
        Failed to load profile. Please make sure you are logged in.
      </div>
    );
  }

  const avatar =
    me.avatar ||
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200";

  const primaryTitle =
    me.specializations && me.specializations.length > 0
      ? me.specializations[0]
      : me.services && me.services.length > 0
        ? me.services[0]
        : "Caregiver Partner";

  // Parse Supabase columns safely
  const languagesList: string[] = Array.isArray(me.languages)
    ? me.languages
    : typeof me.languages === "string"
      ? me.languages
          .split(",")
          .map((l: string) => l.trim())
          .filter(Boolean)
      : [];

  const servicesList: string[] = Array.isArray(me.services) ? me.services : [];
  const specializationsList: string[] = Array.isArray(me.specializations)
    ? me.specializations
    : [];
  console.log("specializations => ", me);

  const availabilityList: Array<{
    day: number;
    startTime: string;
    endTime: string;
  }> = Array.isArray(me.availability) ? me.availability : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Profile Settings
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage your personal credentials, professional services, and weekly
          calendar hours.
        </p>
      </div>

      <div className="flex flex-col-reverse lg:flex-row relative items-start gap-6 max-w-6xl">
        {/* Modular, standalone form sections (Main section taking ~63-65% desktop width) */}
        <div className="flex flex-col gap-5 w-full lg:w-[60%] shrink-0">
          <PersonalInfoCard />
          <ProfessionalDetailsCard />
          <ProfessionalBioCard />
          <ServicesSpecialtiesCard />
          <AvailabilitySchedulerCard />
        </div>

        {/* Profile Summary Card (Takes remaining ~40% desktop width, sticky on scroll with max height) */}
        <div className="w-full lg:w-[40%] lg:sticky lg:top-[84px] z-20 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 lg:max-h-[calc(100vh-104px)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
          {/* User Header */}
          <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
            <div className="size-14 rounded-2xl overflow-hidden relative border border-gray-200 bg-muted shrink-0 shadow-xs">
              <Image
                src={avatar}
                alt={`${me.firstName || "Caregiver"} profile`}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-gray-900 truncate">
                {me.firstName} {me.lastName}
              </h3>
              <p className="text-xs text-secondary font-semibold flex items-center gap-1 truncate mt-0.5">
                <Sparkles className="size-3 text-secondary fill-current shrink-0" />
                <span className="truncate">{primaryTitle}</span>
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] font-medium text-gray-500">
                {me.hourlyRate && (
                  <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-100">
                    ${me.hourlyRate}/hr
                  </span>
                )}
                {me.experienceYears !== undefined && (
                  <span className="bg-gray-100 text-gray-700 font-medium px-2 py-0.5 rounded-md">
                    {me.experienceYears} yrs exp
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Languages Column */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider">
              <Globe className="size-3.5 text-primary" />
              <span>Languages</span>
            </div>
            {languagesList.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                {languagesList.map((lang, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 italic font-medium">
                No languages specified
              </p>
            )}
          </div>

          {/* Services Column */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider">
              <HeartHandshake className="size-3.5 text-rose-500" />
              <span>Services</span>
            </div>
            {servicesList.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                {servicesList.map((srv, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold bg-rose-50/80 text-rose-700 border border-rose-100 px-2.5 py-1 rounded-lg"
                  >
                    {srv}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 italic font-medium">
                No services selected
              </p>
            )}
          </div>

          {/* Specializations Column */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider">
              <Award className="size-3.5 text-amber-500" />
              <span>Specializations</span>
            </div>
            {specializationsList.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                {specializationsList.map((spec, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold bg-amber-50/80 text-amber-800 border border-amber-200/60 px-2.5 py-1 rounded-lg"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 italic font-medium">
                No specializations selected
              </p>
            )}
          </div>

          {/* Availability Column */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <Calendar className="size-3.5 text-emerald-600" />
                <span>Availability</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                {availabilityList.length} Days Set
              </span>
            </div>
            {availabilityList.length > 0 ? (
              <div className="grid grid-cols-1 gap-1.5 pt-0.5 max-h-40 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-emerald-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                {availabilityList.map((item, idx) => {
                  const dayName = DAY_NAMES[item.day] || `Day ${item.day}`;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-50/40 border border-emerald-100/80 text-[11px]"
                    >
                      <span className="font-bold text-xs text-gray-800">
                        {dayName}
                      </span>
                      <span className="font-semibold text-xs text-emerald-700 flex items-center gap-1">
                        <Clock className="size-3" />
                        {formatTime12h(item.startTime)} - {formatTime12h(item.endTime)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 italic font-medium">
                No availability set
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
