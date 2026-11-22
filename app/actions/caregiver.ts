"use server";

import { supabase } from "@/lib/supabase";
import { SearchResponse } from "./search";

export interface GetApprovedCaregiversParams {
  limit?: number;
  page?: number;
  searchTerm?: string;
  location?: string;
  language?: string;
  specialty?: string;
  experience?: number | "";
  gender?: string;
  maxRate?: number;
  selectedDay?: number | "";
}

export async function getApprovedCaregivers(params?: GetApprovedCaregiversParams): Promise<SearchResponse> {
  try {
    const page = params?.page || 1;
    const limit = params?.limit || 8;
    const offset = (page - 1) * limit;

    // 2. Build the main query
    let query = supabase
      .from("CaregiverProfile")
      .select("*", { count: "exact" })
      .eq("verificationStatus", "APPROVED");

    // Filter by availability directly using jsonb array containment
    if (params?.selectedDay !== undefined && params?.selectedDay !== "") {
      query = query.contains("availability", JSON.stringify([{ day: Number(params.selectedDay) }]));
    }

    // Apply location (city) filter
    if (params?.location) {
      query = query.ilike("city", `%${params.location}%`);
    }

    // Apply language filter (checking array contains with formatted case normalization)
    if (params?.language) {
  // Extract the first language term from the comma-separated string (e.g., "Ger")
  const searchTerms = params.language.split(",").map(l => l.trim()).filter(Boolean);
  
  if (searchTerms.length > 0) {
    const mainTerm = searchTerms[0]; 
    console.log("Searching partial language => ", mainTerm);
    
    // REPLACE the standard .from() chain with the .rpc() chain
    query = supabase.rpc('search_caregiver_languages', {
      search_term: mainTerm
    }) as any;
  }
}


    // Apply specialty / specialization filter (overlap with formatted case normalization)
    if (params?.specialty) {
      const specList = params.specialty
        .split(",")
        .map(s => s.trim())
        .filter(Boolean)
        .map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase());
      
      if (specList.length > 0) {
        query = query.overlaps("specializations", specList);
      }
    }

    // Apply gender filter
    if (params?.gender && params.gender !== "Any" && params.gender !== "") {
      query = query.eq("gender", params.gender);
    }

    // Apply max rate filter
    if (params?.maxRate) {
      query = query.lte("hourlyRate", params.maxRate);
    }

    // Apply experience filter
    if (params?.experience !== undefined && params.experience !== "") {
      query = query.gte("experienceYears", Number(params.experience));
    }

    // Apply search term filter (matches first/last name, bio, or certifications array)
    if (params?.searchTerm) {
      const term = `%${params.searchTerm}%`;
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
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    };

  } catch (err: any) {
    console.error("getApprovedCaregivers server action error:", err);
    return {
      success: false,
      caregivers: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      error: err.message || "Failed to fetch approved caregivers."
    };
  }
}
