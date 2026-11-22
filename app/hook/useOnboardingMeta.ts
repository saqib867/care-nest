import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface DBService {
  id: string;
  name: string;
  createdAt: string;
}

export interface DBSpecialization {
  id: string;
  name: string;
  createdAt: string;
}

interface OnboardingMetaResponse {
  services: DBService[];
  specializations: DBSpecialization[];
}

export function useOnboardingMeta() {
  const { data, isLoading, error } = useQuery<OnboardingMetaResponse>({
    queryKey: ["onboarding-meta"],
    queryFn: async () => {
      try {
        // Fetch services from public.Service table
        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("*")
          .order("name", { ascending: true });

        if (servicesError) throw servicesError;

        // Fetch specializations from public.Specialization table
        const { data: specsData, error: specsError } = await supabase
          .from("specializations")
          .select("*")
          .order("name", { ascending: true });

        if (specsError) throw specsError;

        return {
          services: (servicesData || []) as DBService[],
          specializations: (specsData || []) as DBSpecialization[],
        };
      } catch (err: any) {
        console.warn("Could not load database tables from Supabase, falling back to local mocks. Details:", err.message);
        
        // Return default fallback lists in mock mode to keep development unblocked
        return {
          services: [
            { id: "s1", name: "Elderly Companionship", createdAt: "" },
            { id: "s2", name: "Dementia & Alzheimer Care", createdAt: "" },
            { id: "s3", name: "Meal Preparation & Nutrition", createdAt: "" },
            { id: "s4", name: "Medication & Vitals Tracking", createdAt: "" },
            { id: "s5", name: "Mobility & Transfer Assistance", createdAt: "" },
            { id: "s6", name: "Personal Hygiene & Grooming", createdAt: "" },
            { id: "s7", name: "Pediatric Home Care", createdAt: "" }
          ],
          specializations: [
            { id: "sp1", name: "Certified Nursing Assistant (CNA)", createdAt: "" },
            { id: "sp2", name: "Registered Nurse (RN)", createdAt: "" },
            { id: "sp3", name: "Physical Therapist Helper", createdAt: "" },
            { id: "sp4", name: "Hospice & Palliative Care", createdAt: "" },
            { id: "sp5", name: "Dementia Specialist", createdAt: "" },
            { id: "sp6", name: "Nutritional Specialist", createdAt: "" }
          ]
        };
      }
    },
    // Cache the onboarding metadata so it doesn't refetch on tab focus or mount transitions
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    services: data?.services || [],
    specializations: data?.specializations || [],
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
