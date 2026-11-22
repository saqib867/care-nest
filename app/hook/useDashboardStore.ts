import { create } from "zustand";
import { MockBooking } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";
import { getProfileProgress } from "@/app/actions/auth";
import { getConversationsForUser, ChatThread } from "@/app/actions/messages";

export interface FavoriteCaregiver {
  id: string;
  caregiverId: string;
  name: string;
  avatar: string;
  rating: number;
  hourlyRate: number;
  certifications: string[];
}

export interface CaregiverDocument {
  id: string;
  name: string;
  status: string;
  date: string;
}

function mapDBBookingToMock(dbBooking: any): MockBooking {
  const cg = dbBooking.CaregiverProfile;
  const fam = dbBooking.FamilyProfile;
  
  // Safe extraction from either top-level or JSONB content field
  const content = dbBooking.content || {};
  const rawStart = dbBooking.startTime || content.startTime || new Date().toISOString();
  const rawEnd = dbBooking.endTime || content.endTime || new Date().toISOString();
  
  const start = new Date(rawStart);
  const end = new Date(rawEnd);
  
  const dateString = start.toISOString().split('T')[0];
  const startTime = start.toTimeString().split(' ')[0].substring(0, 5); // "HH:MM"
  const endTime = end.toTimeString().split(' ')[0].substring(0, 5); // "HH:MM"

  return {
    id: dbBooking.id,
    caregiverId: dbBooking.careGiverId || dbBooking.caregiverId,
    caregiverName: cg ? `${cg.firstName} ${cg.lastName}` : "Caregiver Partner",
    caregiverAvatar: cg?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200", // fallback
    familyId: dbBooking.careFaimlyId || dbBooking.familyId,
    familyName: fam ? `${fam.firstName} ${fam.lastName}` : "The Mueller Family",
    startTime,
    endTime,
    hourlyRate: Number(dbBooking.hourlyRate || content.hourlyRate || 30),
    commissionFee: Number(dbBooking.commissionFee || content.commissionFee || 0),
    totalAmount: Number(dbBooking.totalAmount || content.totalAmount || 0),
    status: dbBooking.status,
    paymentStatus: dbBooking.paymentStatus || content.paymentStatus || "UNPAID",
    dateString
  };
}

interface DashboardState {
  authLoading: boolean;
  role: "family" | "caregiver";
  dbRole: "FAMILY" | "CAREGIVER" | null;
  userName: string;
  userId: string | null;

  familyTab: "dashboard" | "bookings" | "saved" | "messages" | "profile" | "settings" | "help";
  caregiverTab: "dashboard" | "bookings" | "calendar" | "messages" | "earnings" | "profile";

  bookings: MockBooking[];
  favorites: FavoriteCaregiver[];
  documents: CaregiverDocument[];
  threads: ChatThread[];

  familyAddress: string;
  familyCity: string;
  familyCountry: string;
  familyPostalCode: string;
  familyLangsInput: string;

  profileBio: string;
  profileRate: number;
  profileExp: number;
  isPremiumCaregiver: boolean;

  newDocName: string;

  showReviewModal: boolean;
  selectedBookingId: string;
  reviewRating: number;
  reviewComment: string;

  setRole: (role: "family" | "caregiver") => void;
  setFamilyTab: (tab: "dashboard" | "bookings" | "saved" | "messages" | "profile" | "settings" | "help") => void;
  setCaregiverTab: (tab: "dashboard" | "bookings" | "calendar" | "messages" | "earnings" | "profile") => void;
  setNewDocName: (name: string) => void;
  setReviewRating: (rating: number) => void;
  setReviewComment: (comment: string) => void;
  setSelectedBookingId: (id: string) => void;
  setShowReviewModal: (show: boolean) => void;
  setFamilyAddress: (val: string) => void;
  setFamilyCity: (val: string) => void;
  setFamilyCountry: (val: string) => void;
  setFamilyPostalCode: (val: string) => void;
  setFamilyLangsInput: (val: string) => void;
  setProfileBio: (val: string) => void;
  setProfileRate: (val: number) => void;
  setProfileExp: (val: number) => void;

  setBookings: (bookings: MockBooking[] | ((prev: MockBooking[]) => MockBooking[])) => void;

  fetchDashboardData: (router: any) => Promise<void>;
  handleLogout: (router: any) => Promise<void>;
  handleAcceptBooking: (id: string) => Promise<void>;
  handleDeclineBooking: (id: string) => Promise<void>;
  handleUploadDoc: (e: React.FormEvent) => Promise<void>;
  handleProfileSave: (e: React.FormEvent) => Promise<void>;
  handleAddReview: (e: React.FormEvent) => Promise<void>;
  handleTogglePremium: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  authLoading: true,
  role: "family",
  dbRole: null,
  userName: "User",
  userId: null,

  familyTab: "dashboard",
  caregiverTab: "dashboard",

  bookings: [],
  favorites: [],
  documents: [],
  threads: [],

  familyAddress: "",
  familyCity: "",
  familyCountry: "",
  familyPostalCode: "",
  familyLangsInput: "",

  profileBio: "",
  profileRate: 30,
  profileExp: 2,
  isPremiumCaregiver: false,

  newDocName: "",

  showReviewModal: false,
  selectedBookingId: "",
  reviewRating: 5,
  reviewComment: "",

  setRole: (role) => set({ role }),
  setFamilyTab: (familyTab) => set({ familyTab }),
  setCaregiverTab: (caregiverTab) => set({ caregiverTab }),
  setNewDocName: (newDocName) => set({ newDocName }),
  setReviewRating: (reviewRating) => set({ reviewRating }),
  setReviewComment: (reviewComment) => set({ reviewComment }),
  setSelectedBookingId: (selectedBookingId) => set({ selectedBookingId }),
  setShowReviewModal: (showReviewModal) => set({ showReviewModal }),
  setFamilyAddress: (familyAddress) => set({ familyAddress }),
  setFamilyCity: (familyCity) => set({ familyCity }),
  setFamilyCountry: (familyCountry) => set({ familyCountry }),
  setFamilyPostalCode: (familyPostalCode) => set({ familyPostalCode }),
  setFamilyLangsInput: (familyLangsInput) => set({ familyLangsInput }),
  setProfileBio: (profileBio) => set({ profileBio }),
  setProfileRate: (profileRate) => set({ profileRate }),
  setProfileExp: (profileExp) => set({ profileExp }),

  setBookings: (bookingsOrFn) => {
    if (typeof bookingsOrFn === "function") {
      set((state) => ({ bookings: bookingsOrFn(state.bookings) }));
    } else {
      set({ bookings: bookingsOrFn });
    }
  },

  fetchDashboardData: async (router) => {
    set({ authLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/signin");
        return;
      }

      set({ userId: user.id });

      const progress = await getProfileProgress(user.id);
      if (progress.success) {
        const stepsVal = progress.stepsCompleted || 0;
        const requiredSteps = progress.role === "FAMILY" ? 2 : 3;
        if (stepsVal < requiredSteps) {
          router.push("/auth/signup");
          return;
        }
        if (progress.role) {
          const dbRole = progress.role;
          const role = dbRole === "CAREGIVER" ? "caregiver" : "family";
          set({ dbRole, role });

          if (progress.profile) {
            const userName = `${progress.profile.firstName} ${progress.profile.lastName}`;
            set({ userName });
            if (dbRole === "FAMILY") {
              set({
                familyAddress: progress.profile.address || "",
                familyCity: progress.profile.city || "",
                familyCountry: progress.profile.country || "",
                familyPostalCode: progress.profile.postalCode || "",
                familyLangsInput: progress.profile.languages ? progress.profile.languages.join(", ") : ""
              });
            } else {
              set({
                profileBio: progress.profile.bio || "",
                profileRate: Number(progress.profile.hourlyRate || 30),
                profileExp: Number(progress.profile.experienceYears || 2),
                isPremiumCaregiver: !!progress.profile.isPremium
              });
            }
          }

          // Fetch bookings and role-specific data
          if (dbRole === "FAMILY") {
            const { data: dbBks } = await supabase
              .from("Booking")
              .select(`
                *,
                CaregiverProfile ( firstName, lastName, rating, hourlyRate, email ),
                FamilyProfile ( firstName, lastName, email )
              `)
              .eq("careFaimlyId", user.id)
              .order("createdAt", { ascending: false });

            if (dbBks) {
              set({ bookings: dbBks.map(mapDBBookingToMock) });
            }

            const { data: dbFavs } = await supabase
              .from("Favorite")
              .select(`
                *,
                CaregiverProfile ( * )
              `)
              .eq("familyId", user.id);

            if (dbFavs) {
              set({
                favorites: dbFavs.map((f: any) => ({
                  id: f.id,
                  caregiverId: f.caregiverId,
                  name: f.CaregiverProfile ? `${f.CaregiverProfile.firstName} ${f.CaregiverProfile.lastName}` : "Caregiver Partner",
                  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
                  rating: f.CaregiverProfile?.rating || 5.0,
                  hourlyRate: Number(f.CaregiverProfile?.hourlyRate || 30),
                  certifications: f.CaregiverProfile?.certifications || []
                }))
              });
            }
          } else {
            const { data: dbBks } = await supabase
              .from("Booking")
              .select(`
                *,
                CaregiverProfile ( firstName, lastName, rating, hourlyRate, email ),
                FamilyProfile ( firstName, lastName, email )
              `)
              .eq("careGiverId", user.id)
              .order("createdAt", { ascending: false });

            if (dbBks) {
              set({ bookings: dbBks.map(mapDBBookingToMock) });
            }

            const { data: dbDocs } = await supabase
              .from("Document")
              .select("*")
              .eq("caregiverId", user.id)
              .order("createdAt", { ascending: false });

            if (dbDocs) {
              set({
                documents: dbDocs.map((d: any) => ({
                  id: d.id,
                  name: d.name,
                  status: d.status,
                  date: d.createdAt ? new Date(d.createdAt).toISOString().split('T')[0] : ""
                }))
              });
            }
          }

          const threadsRes = await getConversationsForUser(user.id);
          if (threadsRes.success && threadsRes.threads) {
            set({ threads: threadsRes.threads });
          }
        }
      } else {
        router.push("/auth/signup");
        return;
      }
    } catch (err) {
      console.error("Dashboard authentication or fetch error:", err);
    } finally {
      set({ authLoading: false });
    }
  },

  handleLogout: async (router) => {
    try {
      await supabase.auth.signOut();
      set({
        dbRole: null,
        role: "family",
        bookings: [],
        favorites: [],
        documents: [],
        threads: [],
        userId: null
      });
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
      router.push("/");
    }
  },

  handleAcceptBooking: async (id) => {
    try {
      const { error } = await supabase
        .from("Booking")
        .update({ status: "ACCEPTED" })
        .eq("id", id);
      if (error) throw error;
      set((state) => ({
        bookings: state.bookings.map(b => b.id === id ? { ...b, status: "ACCEPTED" } : b)
      }));
    } catch (err: any) {
      alert(err.message || "Failed to accept booking.");
    }
  },

  handleDeclineBooking: async (id) => {
    try {
      const { error } = await supabase
        .from("Booking")
        .update({ status: "DECLINED" })
        .eq("id", id);
      if (error) throw error;
      set((state) => ({
        bookings: state.bookings.map(b => b.id === id ? { ...b, status: "DECLINED" } : b)
      }));
    } catch (err: any) {
      alert(err.message || "Failed to decline booking.");
    }
  },

  handleUploadDoc: async (e) => {
    e.preventDefault();
    const { newDocName, userId } = get();
    if (!newDocName || !userId) return;
    try {
      const { data: newDoc, error } = await supabase
        .from("Document")
        .insert({
          caregiverId: userId,
          name: newDocName,
          fileUrl: "https://example.com/mock-doc.pdf",
          status: "PENDING"
        })
        .select("*")
        .single();
      if (error) throw error;

      set((state) => ({
        documents: [
          {
            id: newDoc.id,
            name: newDoc.name,
            status: newDoc.status,
            date: new Date(newDoc.createdAt).toISOString().split('T')[0]
          },
          ...state.documents
        ],
        newDocName: ""
      }));
    } catch (err: any) {
      alert(err.message || "Failed to upload document.");
    }
  },

  handleProfileSave: async (e) => {
    e.preventDefault();
    const {
      dbRole,
      userId,
      profileBio,
      profileRate,
      profileExp,
      familyAddress,
      familyCity,
      familyCountry,
      familyPostalCode,
      familyLangsInput
    } = get();

    if (!userId) return;
    try {
      if (dbRole === "CAREGIVER") {
        const { error } = await supabase
          .from("CaregiverProfile")
          .update({
            bio: profileBio,
            hourlyRate: profileRate,
            experienceYears: profileExp
          })
          .eq("id", userId);
        if (error) throw error;
      } else {
        const langs = familyLangsInput ? familyLangsInput.split(",").map(l => l.trim()).filter(Boolean) : [];
        const { error } = await supabase
          .from("FamilyProfile")
          .update({
            address: familyAddress,
            city: familyCity,
            country: familyCountry,
            postalCode: familyPostalCode,
            languages: langs
          })
          .eq("id", userId);
        if (error) throw error;
      }
      alert("Profile changes saved successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to save profile.");
    }
  },

  handleAddReview: async (e) => {
    e.preventDefault();
    const { selectedBookingId, reviewRating, reviewComment } = get();
    try {
      const { error: reviewError } = await supabase
        .from("Review")
        .insert({
          bookingId: selectedBookingId,
          rating: reviewRating,
          comment: reviewComment
        });
      if (reviewError) throw reviewError;

      const { error: bookingError } = await supabase
        .from("Booking")
        .update({ status: "COMPLETED" })
        .eq("id", selectedBookingId);
      if (bookingError) throw bookingError;

      set((state) => ({
        bookings: state.bookings.map(b => b.id === selectedBookingId ? { ...b, status: "COMPLETED" } : b),
        showReviewModal: false,
        reviewComment: ""
      }));
      alert("Thank you for your feedback! The caregiver's rating profile has been updated.");
    } catch (err: any) {
      alert(err.message || "Failed to submit review.");
    }
  },

  handleTogglePremium: async () => {
    const { isPremiumCaregiver, userId } = get();
    if (!userId) return;
    try {
      const newVal = !isPremiumCaregiver;
      const { error } = await supabase
        .from("CaregiverProfile")
        .update({ isPremium: newVal })
        .eq("id", userId);
      if (error) throw error;
      set({ isPremiumCaregiver: newVal });
    } catch (err: any) {
      alert(err.message || "Failed to update premium status.");
    }
  }
}));
