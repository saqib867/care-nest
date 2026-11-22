"use server";

import { supabase } from "@/lib/supabase";

export interface GetUserBookingsOptions {
  status?: "ALL" | "ACCEPTED" | "COMPLETED";
  search?: string;
  page?: number;
  limit?: number;
}

const BOOKING_STATUSES = [
  "ACCEPTED",
  "COMPLETED",
  "PENDING",
  "REJECTED",
  "CANCELLED",
  "CONFIRMED",
  "IN_PROGRESS",
];

const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());

export async function getUserBookings(
  userId: string,
  role: boolean,
  options: GetUserBookingsOptions = {}
) {
  if (!userId) {
    return { success: false, error: "User ID is required." };
  }

  const { status = "ALL", search = "", page = 1, limit = 10 } = options;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    const isCaregiver = role;
    const userField = isCaregiver ? "careGiverId" : "careFaimlyId";
    const partnerField = isCaregiver ? "careFaimlyId" : "careGiverId";
    const partnerTable = isCaregiver ? "FamilyProfile" : "CaregiverProfile";

    const q = search ? String(search).trim() : "";

    let query = supabase
      .from("Booking")
      .select(
        isCaregiver
          ? `*, FamilyProfile(firstName, lastName, email)`
          : `*, CaregiverProfile(firstName, lastName, rating, hourlyRate, email)`,
        { count: "exact" }
      )
      .eq(userField, userId);

    if (status && status !== "ALL") {
      query = query.eq("status", status);
    }

    if (q) {
      const searchConditions: string[] = [
        `careType.ilike.%${q}%`,
      ];

      if (isUUID(q)) {
        searchConditions.push(`id.eq.${q}`);
      }

      // Check if search matches any PostgreSQL enum BookingStatus values
      const matchingStatuses = BOOKING_STATUSES.filter((st) =>
        st.toLowerCase().includes(q.toLowerCase())
      );

      if (matchingStatuses.length > 0) {
        matchingStatuses.forEach((st) => {
          searchConditions.push(`status.eq.${st}`);
        });
      }

      // Query partner profiles matching search term by name or email
      const { data: partnerMatches } = await supabase
        .from(partnerTable)
        .select("id")
        .or(`firstName.ilike.%${q}%,lastName.ilike.%${q}%,email.ilike.%${q}%`);

      if (partnerMatches && partnerMatches.length > 0) {
        const partnerIds = partnerMatches.map((p) => p.id).filter(Boolean);
        if (partnerIds.length > 0) {
          searchConditions.push(`${partnerField}.in.(${partnerIds.join(",")})`);
        }
      }

      query = query.or(searchConditions.join(","));
    }

    const {
      data: bookings,
      error,
      count,
    } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Supabase error in getUserBookings query:", error);
      throw error;
    }

    const totalCount = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    return {
      success: true,
      bookings: bookings ?? [],
      totalCount,
      totalPages,
      page,
      limit,
      role: isCaregiver ? "CAREGIVER" : "FAMILY",
    };
  } catch (err: any) {
    console.error("Error in getUserBookings action:", err);

    return {
      success: false,
      error: err.message || "Failed to load bookings.",
    };
  }
}

export async function getBookingById(bookingId: string) {
  if (!bookingId) {
    return { success: false, error: "Booking ID is required." };
  }

  try {
    const { data: booking, error } = await supabase
      .from("Booking")
      .select(`
        *,
        FamilyProfile(id, firstName, lastName, email),
        CaregiverProfile(id, firstName, lastName, rating, hourlyRate, email)
      `)
      .eq("id", bookingId)
      .maybeSingle();

    if (error) throw error;

    if (!booking) {
      return { success: false, error: "Booking not found." };
    }

    return {
      success: true,
      booking,
    };
  } catch (err: any) {
    console.error("Error in getBookingById action:", err);
    return {
      success: false,
      error: err.message || "Failed to load booking details.",
    };
  }
}

export async function payOneTimeBooking(bookingId: string) {
  try {
    const { data: booking, error: fetchErr } = await supabase
      .from("Booking")
      .select("content, payment")
      .eq("id", bookingId)
      .single();

    if (fetchErr) throw fetchErr;

    const currentContent = typeof booking.content === "object" && booking.content !== null ? booking.content : {};
    const totalPay = Number(booking.payment || currentContent.payment || currentContent.totalAmount || 0);

    const updatedContent = {
      ...currentContent,
      isPaid: true,
      paidAt: new Date().toISOString(),
      paid: totalPay,
    };

    const { error: updateErr } = await supabase
      .from("Booking")
      .update({
        content: updatedContent,
        paid: totalPay,
      })
      .eq("id", bookingId);

    if (updateErr) throw updateErr;

    return { success: true };
  } catch (err: any) {
    console.error("Error paying one-time booking:", err);
    return { success: false, error: err.message || "Payment failed." };
  }
}

export async function payRecurringWeek(bookingId: string, weekIndex: number, amount: number) {
  try {
    const { data: booking, error: fetchErr } = await supabase
      .from("Booking")
      .select("content, paid")
      .eq("id", bookingId)
      .single();

    if (fetchErr) throw fetchErr;

    const currentContent = typeof booking.content === "object" && booking.content !== null ? booking.content : {};
    const paidWeeksArr: number[] = Array.isArray(currentContent.paidWeeks) ? currentContent.paidWeeks : [];

    if (!paidWeeksArr.includes(weekIndex)) {
      paidWeeksArr.push(weekIndex);
    }

    const newPaidTotal = Number(booking.paid || currentContent.paidAmount || 0) + Number(amount || 0);

    const updatedContent = {
      ...currentContent,
      paidWeeks: paidWeeksArr,
      paidAmount: newPaidTotal,
      paid: newPaidTotal,
    };

    const { error: updateErr } = await supabase
      .from("Booking")
      .update({
        content: updatedContent,
        paid: newPaidTotal,
      })
      .eq("id", bookingId);

    if (updateErr) throw updateErr;

    return { success: true };
  } catch (err: any) {
    console.error("Error paying recurring week:", err);
    return { success: false, error: err.message || "Weekly payment failed." };
  }
}

export const payWeeklyInstallment = payRecurringWeek;