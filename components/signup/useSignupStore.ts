import { create } from "zustand";

export type RoleType = "FAMILY" | "CAREGIVER";

export interface OnboardingAvailability {
  day: number; // 0 = Sun, 1 = Mon, etc.
  startTime: string; // e.g. "09:00"
  endTime: string; // e.g. "17:00"
}

interface SignupFormState {
  // Wizard Navigation
  step: number;
  role: RoleType;
  
  // Basic Account Credentials
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  userId: string;

  // Family Profile Inputs
  address: string;
  city: string;
  country: string;
  postalCode: string;
  preferredLanguage: string;

  // Caregiver Profile Inputs
  bio: string;
  gender: string;
  experienceYears: number;
  hourlyRate: number;
  currency: string;
  languages: string[];
  certifications: string[];
  selectedServices: string[];
  selectedSpecializations: string[];
  availability: OnboardingAvailability[];

  // Form State Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setRole: (role: RoleType) => void;
  updateField: (field: string, value: any) => void;
  toggleService: (serviceName: string) => void;
  toggleSpecialization: (specName: string) => void;
  resetForm: () => void;
}

const initialFormValues = {
  step: 1,
  role: "FAMILY" as RoleType,
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  userId: "",
  address: "",
  city: "",
  country: "",
  postalCode: "",
  preferredLanguage: "en",
  bio: "",
  gender: "Female",
  experienceYears: 2,
  hourlyRate: 25,
  currency: "USD",
  languages: ["English"],
  certifications: [],
  selectedServices: [] as string[],
  selectedSpecializations: [] as string[],
  // Default checked: Monday to Friday (1 to 5) from 09:00 to 17:00
  availability: [
    { day: 1, startTime: "09:00", endTime: "17:00" },
    { day: 2, startTime: "09:00", endTime: "17:00" },
    { day: 3, startTime: "09:00", endTime: "17:00" },
    { day: 4, startTime: "09:00", endTime: "17:00" },
    { day: 5, startTime: "09:00", endTime: "17:00" },
  ] as OnboardingAvailability[],
};

export const useSignupStore = create<SignupFormState>((set) => ({
  ...initialFormValues,

  setStep: (step) => set({ step }),
  
  nextStep: () => set((state) => {
    // Caregiver has 4 steps, Family has 3 steps
    const maxSteps = state.role === "CAREGIVER" ? 4 : 3;
    return { step: Math.min(state.step + 1, maxSteps) };
  }),

  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),

  setRole: (role) => set({ role }),

  updateField: (field, value) => set(() => ({ [field]: value })),

  toggleService: (serviceName) => set((state) => {
    const current = state.selectedServices;
    const exists = current.includes(serviceName);
    return {
      selectedServices: exists
        ? current.filter((s) => s !== serviceName)
        : [...current, serviceName],
    };
  }),

  toggleSpecialization: (specName) => set((state) => {
    const current = state.selectedSpecializations;
    const exists = current.includes(specName);
    return {
      selectedSpecializations: exists
        ? current.filter((s) => s !== specName)
        : [...current, specName],
    };
  }),

  resetForm: () => set(initialFormValues),
}));
