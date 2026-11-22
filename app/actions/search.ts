"use server";

import { supabase } from "@/lib/supabase";

export interface SearchCaregiverResult {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  gender: string;
  experienceYears: number;
  hourlyRate: number;
  currency: string;
  languages: string[];
  certifications: string[];
  rating: number;
  reviewCount: number;
  isPremium: boolean;
  isVerified: boolean;
  location: string;
}

export interface SearchResponse {
  success: boolean;
  caregivers: SearchCaregiverResult[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  error?: string;
}

export async function searchCaregivers(filters: {
  searchTerm?: string;
  location?: string;
  language?: string;
  experience?: number | "";
  gender?: string;
  maxRate?: number;
  selectedDay?: number | "";
  page?: number;
  limit?: number;
}): Promise<SearchResponse> {
  try {
    const page = filters.page || 1;
    const limit = filters.limit || 3; // Paginate with 3 caregivers per page to demonstrate pagination
    const offset = (page - 1) * limit;

    // 2. Build the main query
    let query = supabase
      .from("CaregiverProfile")
      .select("*", { count: "exact" })
      .eq("verificationStatus", "APPROVED")
      .limit(3);

    // Filter by availability directly using jsonb array containment
    if (filters.selectedDay !== undefined && filters.selectedDay !== "") {
      query = query.contains("availability", JSON.stringify([{ day: Number(filters.selectedDay) }]));
    }

    // Apply gender filter
    if (filters.gender && filters.gender !== "Any" && filters.gender !== "") {
      query = query.eq("gender", filters.gender);
    }

    // Apply max rate filter
    if (filters.maxRate) {
      query = query.lte("hourlyRate", filters.maxRate);
    }

    // Apply experience filter
    if (filters.experience !== undefined && filters.experience !== "") {
      query = query.gte("experienceYears", Number(filters.experience));
    }

    // Apply location (city) filter
    if (filters.location) {
      query = query.ilike("city", `%${filters.location}%`);
    }

    // Apply language filter (checking array contains)
    if (filters.language) {
      // In Supabase we check if languages array contains the specified language
      // Note: we can use a case-insensitive check by matching on the array elements,
      // or using Postgres contains (cs) operator
      query = query.contains("languages", [filters.language]);
    }

    // Apply search term filter (matches first/last name, bio, or certifications array)
    if (filters.searchTerm) {
      const term = `%${filters.searchTerm}%`;
      // We can query with OR using Supabase syntax
      query = query.or(`firstName.ilike.${term},lastName.ilike.${term},bio.ilike.${term}`);
    }

    // Apply sorting: Premium first, then by rating
    query = query
      .order("isPremium", { ascending: false })
      .order("rating", { ascending: false });

    // Fetch data with range bounds
    const { data: dbProfiles, count, error } = await query.range(offset, offset + limit - 1);
    if (error) throw error;

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // Map DB profiles to SearchCaregiverResult
    const caregivers = (dbProfiles || []).map((p: any) => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
      bio: p.bio || "",
      gender: p.gender || "Female",
      experienceYears: Number(p.experienceYears || 0),
      hourlyRate: Number(p.hourlyRate || 30),
      currency: p.currency || "USD",
      languages: p.languages || [],
      certifications: p.certifications || [],
      rating: Number(p.rating || 5.0),
      reviewCount: Number(p.reviewCount || 0),
      isPremium: !!p.isPremium,
      isVerified: p.verificationStatus === "APPROVED",
      location: p.city || "Munich"
    }));

    return {
      success: true,
      caregivers,
      totalCount,
      totalPages,
      currentPage: page
    };

  } catch (err: any) {
    console.error("Search server action error:", err);
    return {
      success: false,
      caregivers: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      error: err.message || "Failed to search caregivers."
    };
  }
}

export async function getCaregiverById(id: string): Promise<{
  success: boolean;
  caregiver?: any;
  error?: string;
}> {
  try {
    const { data: profile, error: profileError } = await supabase
      .from("CaregiverProfile")
      .select("*")
      .eq("id", id)
      .single();

    if (profileError) throw profileError;

    const availability = (profile.availability || []).map((av: any) => ({
      dayOfWeek: av.day !== undefined ? av.day : av.dayOfWeek,
      hours: `${av.startTime} - ${av.endTime}`
    }));

    return {
      success: true,
      caregiver: {
        id: profile.id,
        name: `${profile.firstName} ${profile.lastName}`,
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
        bio: profile.bio || "",
        gender: profile.gender || "Female",
        experienceYears: Number(profile.experienceYears || 0),
        hourlyRate: Number(profile.hourlyRate || 30),
        currency: profile.currency || "USD",
        languages: profile.languages || [],
        certifications: profile.certifications || [],
        rating: Number(profile.rating || 5.0),
        specializations:profile?.specializations,
        services:profile?.services,
        reviewCount: Number(profile.reviewCount || 0),
        isPremium: !!profile.isPremium,
        isVerified: profile.verificationStatus === "APPROVED",
        location: profile.city || "Munich",
        availability
      }
    };
  } catch (err: any) {
    console.error("getCaregiverById error:", err);
    return {
      success: false,
      error: err.message || "Failed to load caregiver profile."
    };
  }
}


