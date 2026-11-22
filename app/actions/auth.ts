"use server";

import { supabase } from "@/lib/supabase";
import { z } from "zod";

// Helper schema for Age >= 18 validation
const dateOfBirthSchema = z.string().refine((val) => {
  if (!val) return false;
  const dobDate = new Date(val);
  if (isNaN(dobDate.getTime())) return false;
  
  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }
  return age >= 18;
}, "You must be at least 18 years old to join CareNest.");

// Zod validation schemas
const basicSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  role: z.enum(["FAMILY", "CAREGIVER"]),
});

const familySchema = z.object({
  dateOfBirth: dateOfBirthSchema,
  address: z.string().optional(),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().min(2, "Postal code is required"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
});

const caregiverSchema = z.object({
  dateOfBirth: dateOfBirthSchema,
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  gender: z.string().min(3, "Gender is required"),
  experienceYears: z.number().min(0, "Experience years must be positive"),
  hourlyRate: z.number().min(10, "Minimum hourly rate is 10"),
  currency: z.string().default("USD"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  certifications: z.array(z.string()),
});

export type ActionResponse = {
  success: boolean;
  error?: string;
  stepsCompleted?: number;
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
};

function formatAuthError(err: any): string {
  if (!err) return "An unknown error occurred.";
  if (err.code === "23505") {
    return "An account profile with this user ID or email already exists. Please sign in instead.";
  }
  if (err.code === "23503") {
    return "Referenced account profile does not exist.";
  }
  return err.message || "Operation failed.";
}

/**
 * Step 2: Write the initial profile row to FamilyProfile or CaregiverProfile with stepsCompleted: 1.
 * Expects the user has already been registered and authenticated client-side via Supabase.
 */
export async function createInitialProfile(
  userId: string,
  email: string,
  firstName: string,
  lastName: string,
  role: "FAMILY" | "CAREGIVER"
): Promise<{ success: boolean; error?: string }> {
  try {
    // Upsert initial profile with stepsCompleted = 1 to prevent duplicate key constraint violations (code 23505)
    if (role === "FAMILY") {
      const { error: profileError } = await supabase
        .from("FamilyProfile")
        .upsert(
          {
            id: userId,
            email,
            firstName,
            lastName,
            stepsCompleted: 1, // Step 2 (Account details) completed successfully
          },
          { onConflict: "id" }
        );

      if (profileError) {
        console.error("Family profile creation failed:", profileError);
        if (profileError.code === "23505") {
          return { success: true };
        }
        return { success: false, error: formatAuthError(profileError) };
      }
    } else {
      const { error: profileError } = await supabase
        .from("CaregiverProfile")
        .upsert(
          {
            id: userId,
            email,
            firstName,
            lastName,
            stepsCompleted: 1, // Step 2 (Account details) completed successfully
          },
          { onConflict: "id" }
        );

      if (profileError) {
        console.error("Caregiver profile creation failed:", profileError);
        if (profileError.code === "23505") {
          return { success: true };
        }
        return { success: false, error: formatAuthError(profileError) };
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error("Onboarding Step 2 DB write error:", err);
    return {
      success: false,
      error: err.message || "An unexpected error occurred during database registration.",
    };
  }
}

/**
 * Step 3 (Caregiver Only): Save services and specializations selections (updates stepsCompleted to 2).
 */
export async function saveCaregiverServices(
  userId: string,
  services: string[],
  specializations: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("CaregiverProfile")
      .update({
        services,
        specializations,
        stepsCompleted: 2, // Step 3 (Services Selection) completed successfully
      })
      .eq("id", userId);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("Failed to save caregiver services:", err);
    return { success: false, error: err.message || "Failed to save selected services." };
  }
}

/**
 * Step 3 (Family Final): Save location details and DOB to complete onboarding (updates stepsCompleted to 3).
 */
export async function completeFamilyProfile(
  userId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const country = formData.get("country") as string;
    const postalCode = formData.get("postalCode") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;

    const languagesRaw = formData.get("languages") as string;
    const languages = languagesRaw ? languagesRaw.split(",").map(l => l.trim()).filter(Boolean) : ["English"];

    const familyValidation = familySchema.safeParse({
      dateOfBirth,
      address,
      city,
      country,
      postalCode,
      languages,
    });

    if (!familyValidation.success) {
      return {
        success: false,
        error: familyValidation.error.issues[0].message,
      };
    }

    const { error } = await supabase
      .from("FamilyProfile")
      .upsert(
        {
          id: userId,
          dateOfBirth,
          address,
          city,
          country,
          postalCode,
          languages,
          stepsCompleted: 3, // Onboarding fully completed for families
        },
        { onConflict: "id" }
      );

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("Failed to complete family profile:", err);
    return { success: false, error: formatAuthError(err) };
  }
}

/**
 * Step 4 (Caregiver Final): Save bio, rate, DOB, and certifications to complete onboarding (updates stepsCompleted to 3).
 */
export async function completeCaregiverProfile(
  userId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const bio = formData.get("bio") as string;
    const gender = formData.get("gender") as string;
    const experienceYears = Number(formData.get("experienceYears") || 0);
    const hourlyRate = Number(formData.get("hourlyRate") || 30);
    const currency = formData.get("currency") as string || "USD";
    const dateOfBirth = formData.get("dateOfBirth") as string;
    
    const languagesRaw = formData.get("languages") as string;
    const languages = languagesRaw ? languagesRaw.split(",").map(l => l.trim()).filter(Boolean) : ["English"];
    
    const certificationsRaw = formData.get("certifications") as string;
    const certifications = certificationsRaw ? certificationsRaw.split(",").map(c => c.trim()).filter(Boolean) : [];

    const caregiverValidation = caregiverSchema.safeParse({
      dateOfBirth,
      bio,
      gender,
      experienceYears,
      hourlyRate,
      currency,
      languages,
      certifications,
    });

    if (!caregiverValidation.success) {
      return {
        success: false,
        error: caregiverValidation.error.issues[0].message,
      };
    }

    // Parse availability JSON list from form data
    let availabilityList: any[] = [];
    const availabilityRaw = formData.get("availability") as string;
    if (availabilityRaw) {
      availabilityList = JSON.parse(availabilityRaw);
    }

    const { error } = await supabase
      .from("CaregiverProfile")
      .upsert(
        {
          id: userId,
          dateOfBirth,
          bio,
          gender,
          experienceYears,
          hourlyRate,
          currency,
          languages,
          certifications,
          availability: availabilityList,
          stepsCompleted: 3, // Onboarding fully completed for caregivers
        },
        { onConflict: "id" }
      );

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("Failed to complete caregiver profile:", err);
    return { success: false, error: formatAuthError(err) };
  }
}

/**
 * Check the database profile to see where a logged-in user is in their onboarding flow.
 */
export async function getProfileProgress(userId: string): Promise<{
  success: boolean;
  role?: "FAMILY" | "CAREGIVER";
  stepsCompleted?: number;
  profile?: any;
  error?: string;
}> {
  try {
    // Check FamilyProfile first
    const { data: familyUser } = await supabase
      .from("FamilyProfile")
      .select("*")
      .eq("id", userId)
      .single();

    if (familyUser) {
      return {
        success: true,
        role: "FAMILY",
        stepsCompleted: familyUser.stepsCompleted,
        profile: familyUser,
      };
    }

    // Check CaregiverProfile
    const { data: caregiverUser } = await supabase
      .from("CaregiverProfile")
      .select("*")
      .eq("id", userId)
      .single();

    if (caregiverUser) {
      return {
        success: true,
        role: "CAREGIVER",
        stepsCompleted: caregiverUser.stepsCompleted,
        profile: caregiverUser,
      };
    }

    return {
      success: false,
      error: "Profile not found.",
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to check onboarding profile progress.",
    };
  }
}

export async function loginUser(
  state: any,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return {
        success: false,
        error: "Email and password are required.",
      };
    }

    // Authenticate credentials with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return {
        success: false,
        error: authError?.message || "Invalid email or password.",
      };
    }

    const supabaseUserId = authData.user.id;

    // Check progress
    const progress = await getProfileProgress(supabaseUserId);

    if (progress.success && progress.role) {
      return {
        success: true,
        stepsCompleted: progress.stepsCompleted,
        user: {
          id: supabaseUserId,
          email,
          role: progress.role,
          name: progress.profile ? `${progress.profile.firstName} ${progress.profile.lastName}` : "User",
        },
      };
    }

    return {
      success: false,
      error: "Authenticated successfully but no matching CareNest profile row found.",
    };
  } catch (err: any) {
    console.error("Login error in server action:", err);
    return {
      success: false,
      error: "An unexpected error occurred during profile verification.",
    };
  }
}
