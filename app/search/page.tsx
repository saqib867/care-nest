"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useFeaturedCaregivers } from "@/app/hook/useFeaturedCaregivers";
import { useDebounce } from "@/app/hook/useDebounce";
import Navbar from "@/components/landing/Navbar";
import { SearchFilterSidebar } from "@/components/search/SearchFilterSidebar";
import { CaregiverListings } from "@/components/search/CaregiverListings";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from search parameters (support both singular and plural names)
  const initialParams = {
    location: searchParams.get("location") || "",
    language: searchParams.get("language") || searchParams.get("languages") || "",
    specialty: searchParams.get("specialty") || searchParams.get("specializations") || "",
  };

  const [searchTerm, setSearchTerm] = useState(initialParams.specialty || "");
  const [location, setLocation] = useState(initialParams.location || "");
  const [language, setLanguage] = useState(initialParams.language || "");
  const [experience, setExperience] = useState<number | "">("");
  const [gender, setGender] = useState("");
  const [maxRate, setMaxRate] = useState<number>(60);
  const [selectedDay, setSelectedDay] = useState<number | "">("");
  const [page, setPage] = useState<number>(1);

  // Debounce the state values that involve text typing or slider dragging
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const debouncedLocation = useDebounce(location, 400);
  const debouncedLanguage = useDebounce(language, 400);
  const debouncedExperience = useDebounce(experience, 400);
  const debouncedMaxRate = useDebounce(maxRate, 400);

  // Reset page to 1 when filters change (so we don't get stuck on empty page ranges)
  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearchTerm,
    debouncedLocation,
    debouncedLanguage,
    debouncedExperience,
    gender,
    debouncedMaxRate,
    selectedDay,
  ]);

  const { data, isLoading } = useFeaturedCaregivers({
    searchTerm: debouncedSearchTerm,
    location: debouncedLocation,
    language: debouncedLanguage,
    experience: debouncedExperience,
    gender,
    maxRate: debouncedMaxRate,
    selectedDay,
    page,
    limit: 8, // Limit to 8 caregivers per page
  });

  const caregivers = data?.caregivers || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 0;
  const loading = isLoading;

  const clearFilters = () => {
    setSearchTerm("");
    setLocation("");
    setLanguage("");
    setExperience("");
    setGender("");
    setMaxRate(60);
    setSelectedDay("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Header */}
      <Navbar />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Search Caregivers
            </h1>
            <p className="text-muted-foreground mt-1">
              Found {totalCount} verified care professional matches.
            </p>
          </div>
          <button
            onClick={clearFilters}
            className="text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* LEFT: Filter Sidebar */}
          <SearchFilterSidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            location={location}
            setLocation={setLocation}
            language={language}
            setLanguage={setLanguage}
            experience={experience}
            setExperience={setExperience}
            gender={gender}
            setGender={setGender}
            maxRate={maxRate}
            setMaxRate={setMaxRate}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />

          {/* RIGHT: Caregiver Listings Grid */}
          <div className="lg:col-span-8 space-y-6">
            <CaregiverListings
              loading={loading}
              caregivers={caregivers}
              clearFilters={clearFilters}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Search() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center font-sans">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm font-semibold text-muted-foreground">
            Loading marketplace listings...
          </p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
