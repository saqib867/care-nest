import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface UserMeResult {
  id: string;
  email?: string;
  user: any;
  profile: any;
  role: "CAREGIVER" | "FAMILY";
  isCaregiver: boolean;
  isFamily: boolean;
  [key: string]: any;
}

export function useMe() {
  return useQuery<UserMeResult | null>({
    queryKey: ["me"],
    queryFn: async () => {
      // 1. Get authenticated user from Supabase auth
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return null;
      }

      // 2. Determine role from user_metadata (or app_metadata)
      const userMetadataRole =
        user.user_metadata?.role || user.app_metadata?.role;

      let isCaregiver = false;

      if (userMetadataRole) {
        isCaregiver = String(userMetadataRole).toUpperCase() === "CAREGIVER";
      } else {
        // Fallback: check if profile exists in CaregiverProfile table
        const { data: cgCheck } = await supabase
          .from("CaregiverProfile")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        isCaregiver = !!cgCheck;
      }

      const role: "CAREGIVER" | "FAMILY" = isCaregiver ? "CAREGIVER" : "FAMILY";
      const tableName = isCaregiver ? "CaregiverProfile" : "FamilyProfile";

      // 3. Fetch profile from CaregiverProfile or FamilyProfile table
      const { data: profile, error: profileError } = await supabase
        .from(tableName)
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error(`Error fetching profile from ${tableName}:`, profileError);
      }

      console.log(`[useMe] Cached current profile (${role}):`, profile || user);

      const profileData = profile || {};
      

      return {
        id: user.id,
        email: user.email,
        ...profileData,
        user,
        profile,
        role,
        isCaregiver,
        isFamily: !isCaregiver,
      };
    },
    staleTime: 1000 * 60 * 15, // Cache stale time: 15 minutes
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
    refetchOnWindowFocus: false,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
      table,
    }: {
      id: string;
      data: any;
      table?: "CaregiverProfile" | "FamilyProfile";
    }) => {
      const cachedMe = queryClient.getQueryData<UserMeResult>(["me"]);
      const targetTable =
        table || (cachedMe?.isCaregiver ? "CaregiverProfile" : "FamilyProfile");

      const { error } = await supabase
        .from(targetTable)
        .update(data)
        .eq("id", id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return async (router?: any) => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      queryClient.setQueryData(["me"], null);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      if (router && typeof router.push === "function") {
        router.push("/auth/signin");
      } else if (typeof window !== "undefined") {
        window.location.href = "/auth/signin";
      }
    }
  };
}


