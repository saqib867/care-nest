"use client";

import { Filter, Search, MapPin, Globe } from "lucide-react";

interface SearchFilterSidebarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  language: string;
  setLanguage: (val: string) => void;
  experience: number | "";
  setExperience: (val: number | "") => void;
  gender: string;
  setGender: (val: string) => void;
  maxRate: number;
  setMaxRate: (val: number) => void;
  selectedDay: number | "";
  setSelectedDay: (val: number | "") => void;
}

export function SearchFilterSidebar({
  searchTerm,
  setSearchTerm,
  location,
  setLocation,
  language,
  setLanguage,
  experience,
  setExperience,
  gender,
  setGender,
  maxRate,
  setMaxRate,
  selectedDay,
  setSelectedDay,
}: SearchFilterSidebarProps) {
  return (
    <aside className="lg:col-span-4 bg-card rounded-3xl border border-border/80 p-6 shadow-sm sticky top-24 space-y-6">
      <div className="flex items-center gap-2 border-b border-border/60 pb-4">
        <Filter className="size-5 text-primary" />
        <h2 className="font-extrabold text-lg text-gray-900">Search Filters</h2>
      </div>

      {/* Keyword Search */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
          Keyword / Specialty
        </label>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/85" />
          <input
            type="text"
            placeholder="e.g. Dementia, Alzheimer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border border-border/80 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
          Location (City)
        </label>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/85" />
          <input
            type="text"
            placeholder="e.g. Munich, Zurich..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-background border border-border/80 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
          />
        </div>
      </div>

      {/* Language */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
          Language Spoken
        </label>
        <div className="relative">
          <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/85" />
          <input
            type="text"
            placeholder="e.g. German, English..."
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-background border border-border/80 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
          />
        </div>
      </div>

      {/* Minimum Experience */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
          Min Experience (Years)
        </label>
        <input
          type="number"
          min="0"
          placeholder="e.g. 5"
          value={experience}
          onChange={(e) =>
            setExperience(e.target.value ? Number(e.target.value) : "")
          }
          className="w-full bg-background border border-border/80 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
        />
      </div>

      {/* Gender Selection */}
      <div className="space-y-2">
        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
          Preferred Gender
        </label>
        <div className="flex gap-2 flex-wrap">
          {["Any", "Female", "Male"].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g === "Any" ? "" : g)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                (g === "Any" && !gender) || gender === g
                  ? "bg-primary border-primary text-primary-foreground font-bold shadow-sm"
                  : "bg-background border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Max Hourly Rate */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
          <span>Max Hourly Rate</span>
          <span className="text-primary text-xs font-black">
            ${maxRate}/hr
          </span>
        </div>
        <input
          type="range"
          min="20"
          max="80"
          step="5"
          value={maxRate}
          onChange={(e) => setMaxRate(Number(e.target.value))}
          className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      {/* Availability */}
      {/* <div className="space-y-1.5">
        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
          Available on Day
        </label>
        <select
          value={selectedDay}
          onChange={(e) =>
            setSelectedDay(
              e.target.value !== "" ? Number(e.target.value) : "",
            )
          }
          className="w-full bg-background border border-border/80 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-bold text-gray-700 cursor-pointer"
        >
          <option value="">Any Day</option>
          <option value="1">Monday</option>
          <option value="2">Tuesday</option>
          <option value="3">Wednesday</option>
          <option value="4">Thursday</option>
          <option value="5">Friday</option>
          <option value="6">Saturday</option>
          <option value="0">Sunday</option>
        </select>
      </div> */}
    </aside>
  );
}
