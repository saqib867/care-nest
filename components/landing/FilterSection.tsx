"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Globe, Award, Search } from "lucide-react";

export default function FilterSection() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("");
  const [specialty, setSpecialty] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (language) params.append("language", language);
    if (specialty) params.append("specialty", specialty);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="py-8 bg-white relative">
      <div className="mx-auto max-w-7xl px-6">
        <form
          onSubmit={handleSearch}
          className="mx-auto w-full rounded-3xl bg-card border border-border p-4 shadow-2xl flex flex-col md:flex-row gap-4 items-center"
        >
          {/* Location Input */}
          <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 border-b md:border-b-0 md:border-r border-border/60">
            <MapPin className="size-5 text-primary shrink-0" />
            <div className="w-full text-left">
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Munich, Berlin..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none text-foreground placeholder:text-muted-foreground/60 font-medium"
              />
            </div>
          </div>

          {/* Language Input */}
          <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 border-b md:border-b-0 md:border-r border-border/60">
            <Globe className="size-5 text-secondary shrink-0" />
            <div className="w-full text-left">
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Language
              </label>
              <input
                type="text"
                placeholder="e.g. English, German..."
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none text-foreground placeholder:text-muted-foreground/60 font-medium"
              />
            </div>
          </div>

          {/* Specialty Select */}
          <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 border-b md:border-b-0 md:border-r border-border/60 md:border-r-0">
            <Award className="size-5 text-accent shrink-0" />
            <div className="w-full text-left">
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Specialty
              </label>
              <input
                type="text"
                placeholder="e.g. Dementia, CNA..."
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none text-foreground placeholder:text-muted-foreground/60 font-medium"
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full md:w-auto rounded-2xl bg-primary text-primary-foreground px-8 py-4 font-semibold hover:bg-primary/95 transition-all flex items-center justify-center gap-2 shadow-md shrink-0 cursor-pointer active:scale-[0.98]"
          >
            <Search className="size-4" />
            <span>Find Care</span>
          </button>
        </form>
      </div>
    </section>
  );
}
