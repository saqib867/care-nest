"use server";

import { supabase } from "@/lib/supabase";
import { parseISO, differenceInDays, isBefore, isSameDay, addDays } from "date-fns";

export async function calculateBookingPayment(
  careType: string,
  content: any,
  defaultHourlyRate: number = 30
): Promise<number> {
  const hourlyRate = Number(content?.hourlyRate || defaultHourlyRate || 30);
  const type = (careType || content?.careType || "One-time Care").toLowerCase();

  // 1. One-time Care
  if (
    type.includes("one-time") ||
    type.includes("onetime") ||
    (!type.includes("recurring") && !type.includes("live"))
  ) {
    let durationHours = 4;
    if (content?.estimatedDuration) {
      const match = String(content.estimatedDuration).match(/\d+/);
      if (match) durationHours = Number(match[0]);
    }
    return durationHours * hourlyRate;
  }

  // 2. Recurring Care
  if (
    type.includes("recurring") ||
    type.includes("repeat") ||
    type.includes("repeating")
  ) {
    const startDateStr = content?.startDate || content?.timing?.startDate;
    const endDateStr = content?.endDate || content?.timing?.endDate;
    const days = content?.days || content?.recDays || content?.timing?.days;

    let hoursPerDay = 4;
    if (content?.estimatedDuration || content?.timing?.duration) {
      const match = String(
        content.estimatedDuration || content.timing?.duration
      ).match(/\d+/);
      if (match) hoursPerDay = Number(match[0]);
    }

    if (startDateStr && endDateStr) {
      try {
        const start = parseISO(startDateStr);
        const end = parseISO(endDateStr);
        if (
          !isNaN(start.getTime()) &&
          !isNaN(end.getTime()) &&
          (isBefore(start, end) || isSameDay(start, end))
        ) {
          const dayNameMap: Record<string, number> = {
            sun: 0, sunday: 0,
            mon: 1, monday: 1,
            tue: 2, tuesday: 2,
            wed: 3, wednesday: 3,
            thu: 4, thursday: 4,
            fri: 5, friday: 5,
            sat: 6, saturday: 6,
          };
          const targetDayIndices =
            Array.isArray(days) && days.length > 0
              ? days
                  .map((d) => dayNameMap[String(d).toLowerCase().trim()])
                  .filter((i) => i !== undefined)
              : [1, 3, 5];

          let totalWorkDays = 0;
          let curr = start;
          while (isBefore(curr, end) || isSameDay(curr, end)) {
            if (targetDayIndices.includes(curr.getDay())) {
              totalWorkDays++;
            }
            curr = addDays(curr, 1);
          }
          return totalWorkDays * hoursPerDay * hourlyRate;
        }
      } catch (e) {
        console.error("Error calculating recurring payment:", e);
      }
    }
    return 12 * hoursPerDay * hourlyRate;
  }

  // 3. Live-in Care
  if (
    type.includes("live-in") ||
    type.includes("livein") ||
    type.includes("live in")
  ) {
    const moveInDateStr = content?.moveInDate || content?.timing?.moveInDate;
    const customEndDateStr =
      content?.customEndDate || content?.timing?.customEndDate;
    const stayDurationStr =
      content?.stayDuration || content?.timing?.stayDuration;

    let stayDays = 30; // Default 30 days if unknown
    if (moveInDateStr && customEndDateStr) {
      try {
        const mStart = parseISO(moveInDateStr);
        const mEnd = parseISO(customEndDateStr);
        if (!isNaN(mStart.getTime()) && !isNaN(mEnd.getTime())) {
          stayDays = Math.max(1, differenceInDays(mEnd, mStart) + 1);
        }
      } catch (e) {
        // ignore
      }
    } else if (stayDurationStr) {
      const match = String(stayDurationStr).match(/\d+/);
      if (match) {
        const num = Number(match[0]);
        if (stayDurationStr.toLowerCase().includes("week")) stayDays = num * 7;
        else if (stayDurationStr.toLowerCase().includes("month"))
          stayDays = num * 30;
        else stayDays = num;
      }
    }
    const dailyRate = hourlyRate * 8;
    return stayDays * dailyRate;
  }

  return 120;
}

export interface DBConversation {
  id: string;
  family_id: string;
  caregiver_id: string;
  created_at: string;
  updated_at: string;
}

export interface DBMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: "family" | "caregiver";
  messageType: "text" | "request";
  content: any; // JSONB
  isRead: boolean;
  createdAt: string;
  careType?: string;
}

export interface ChatThread {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  isOnline: boolean;
  recipientId: string;
}

/**
 * Get or create a conversation between family_id and caregiver_id.
 */
export async function getOrCreateConversation(
  senderId: string,
  recipientId: string
): Promise<{ success: boolean; conversationId?: string; error?: string }> {
  try {
    // 1. Determine who is family and who is caregiver
    const { data: family } = await supabase
      .from("FamilyProfile")
      .select("id")
      .eq("id", senderId)
      .maybeSingle();

    const family_id = family ? senderId : recipientId;
    const caregiver_id = family ? recipientId : senderId;

    // 2. Look for existing conversation between this family and caregiver
    const { data: existingConv, error: fetchError } = await supabase
      .from("conversations")
      .select("id")
      .eq("family_id", family_id)
      .eq("caregiver_id", caregiver_id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existingConv) {
      return { success: true, conversationId: existingConv.id };
    }

    // 3. Create a new conversation row if it doesn't exist
    const { data: newConv, error: createError } = await supabase
      .from("conversations")
      .insert({
        family_id,
        caregiver_id,
      })
      .select("id")
      .single();

    if (createError) throw createError;

    return { success: true, conversationId: newConv.id };
  } catch (err: any) {
    console.error("Error getting or creating conversation:", err);
    return { success: false, error: err.message || "Failed to establish conversation." };
  }
}

/**
 * Fetch all conversations for a user, resolved with recipient metadata and last message text.
 */
export async function getConversationsForUser(
  userId: string
): Promise<{ success: boolean; threads?: ChatThread[]; error?: string }> {
  try {
    // Single relational query joining FamilyProfile, CaregiverProfile, and last message via Foreign Keys
    const { data: myConvs, error: myConvsError } = await supabase
      .from("conversations")
      .select(`
        id,
        family_id,
        caregiver_id,
        created_at,
        updated_at,
        FamilyProfile ( id, firstName, lastName ),
        CaregiverProfile ( id, firstName, lastName ),
        messages ( id, content, created_at, message_type )
      `)
      .or(`family_id.eq.${userId},caregiver_id.eq.${userId}`)
      .order("updated_at", { ascending: false })
      
      .limit(1, { foreignTable: "messages" });

    if (myConvsError) throw myConvsError;

    if (!myConvs || myConvs.length === 0) {
      return { success: true, threads: [] };
    }

    const threads: ChatThread[] = myConvs.map((conv: any) => {
      const isFamilyUser = conv.family_id === userId;
      const otherUserId = isFamilyUser ? conv.caregiver_id : conv.family_id;
      const otherProfile = isFamilyUser ? conv.CaregiverProfile : conv.FamilyProfile;

      const name =
        otherProfile?.firstName || otherProfile?.lastName
          ? `${otherProfile.firstName || ""} ${otherProfile.lastName || ""}`.trim()
          : "CareNest Partner";

      const lastMsg =
        conv.messages && conv.messages.length > 0 ? conv.messages[0] : null;

      let lastMessageStr = "Started a new conversation...";
      if (lastMsg) {
        if (lastMsg.message_type === "request") {
          lastMessageStr = "📅 Care Request Sent";
        } else {
          lastMessageStr =
            lastMsg.content?.text ||
            (typeof lastMsg.content === "string" ? lastMsg.content : "") ||
            "";
        }
      }

      return {
        id: conv.id,
        name,
        avatar: isFamilyUser
          ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
          : "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200",
        lastMessage: lastMessageStr,
        time: lastMsg
          ? new Date(lastMsg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Just now",
        isOnline: true,
        recipientId: otherUserId,
      };
    });

    return { success: true, threads };
  } catch (err: any) {
    console.error("Error getting conversations:", err);
    return {
      success: false,
      error: err.message || "Failed to retrieve conversations.",
    };
  }
}

/**
 * Fetch messages for a specific conversation using cursor-based pagination.
 * Fetches `limit` messages created BEFORE `beforeCursor` (or latest if beforeCursor is omitted).
 * Returns messages in chronological order (oldest to newest for rendering).
 */
export async function getMessagesForConversation(
  conversationId: string,
  limit: number = 30,
  beforeCursor?: string
): Promise<{ success: boolean; messages?: DBMessage[]; nextCursor?: string | null; error?: string }> {
  try {
    let query = supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (beforeCursor) {
      query = query.lt("created_at", beforeCursor);
    }

    const { data: rawMessages, error } = await query;

    if (error) throw error;

    const fetched = rawMessages || [];
    const nextCursor = fetched.length === limit ? fetched[fetched.length - 1].created_at : null;

    // Reverse to chronological order (oldest to newest)
    const chronMessages = [...fetched].reverse().map((m) => ({
      id: m.id,
      conversationId: m.conversation_id,
      senderId: m.sender_id,
      senderType: m.sender_type,
      messageType: m.message_type,
      content: m.content,
      isRead: m.is_read,
      createdAt: m.created_at,
    }));

    return {
      success: true,
      messages: chronMessages,
      nextCursor,
    };
  } catch (err: any) {
    console.error("Error getting messages:", err);
    return { success: false, error: err.message || "Failed to load messages." };
  }
}

/**
 * Send a message inside a conversation.
 */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  contentText: string
): Promise<{ success: boolean; message?: DBMessage; error?: string }> {
  try {
    const { data: family } = await supabase
      .from("FamilyProfile")
      .select("id")
      .eq("id", senderId)
      .maybeSingle();

    const sender_type = family ? "family" : "caregiver";

    const { data: newMsg, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_type,
        sender_id: senderId,
        message_type: "text",
        content: { text: contentText },
        is_read: false,
      })
      .select("*")
      .single();

    if (error) throw error;

    // Touch conversation updated_at
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    return {
      success: true,
      message: {
        id: newMsg.id,
        conversationId: newMsg.conversation_id,
        senderId: newMsg.sender_id,
        senderType: newMsg.sender_type,
        messageType: newMsg.message_type,
        content: newMsg.content,
        isRead: newMsg.is_read,
        createdAt: newMsg.created_at,
      },
    };
  } catch (err: any) {
    console.error("Error sending message:", err);
    return { success: false, error: err.message || "Failed to send message." };
  }
}

/**
 * Send a structured Care Request message.
 */
export async function sendCareRequest(
  conversationId: string,
  senderId: string,
  requestDetails: any
): Promise<{ success: boolean; message?: DBMessage; error?: string }> {
  try {
    const { data: family } = await supabase
      .from("FamilyProfile")
      .select("id")
      .eq("id", senderId)
      .maybeSingle();

    const sender_type = family ? "family" : "caregiver";

    // Resolve caregiver hourly rate if missing
    let rate = requestDetails?.hourlyRate;
    if (!rate) {
      const { data: conv } = await supabase
        .from("conversations")
        .select("caregiver_id")
        .eq("id", conversationId)
        .maybeSingle();

      if (conv?.caregiver_id) {
        const { data: caregiver } = await supabase
          .from("CaregiverProfile")
          .select("hourlyRate")
          .eq("id", conv.caregiver_id)
          .maybeSingle();
        if (caregiver?.hourlyRate) {
          rate = Number(caregiver.hourlyRate);
        }
      }
    }

    const finalContent = {
      ...requestDetails,
      hourlyRate: Number(rate || 30),
    };

    const { data: newMsg, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_type,
        sender_id: senderId,
        message_type: "request",
        content: finalContent,
        is_read: false,
        careType: requestDetails?.careType,
      })
      .select("*")
      .single();

    if (error) throw error;

    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    return {
      success: true,
      message: {
        id: newMsg.id,
        conversationId: newMsg.conversation_id,
        senderId: newMsg.sender_id,
        senderType: newMsg.sender_type,
        messageType: newMsg.message_type,
        content: newMsg.content,
        isRead: newMsg.is_read,
        createdAt: newMsg.created_at,
      },
    };
  } catch (err: any) {
    console.error("Error submitting care request:", err);
    return { success: false, error: err.message || "Failed to submit care request." };
  }
}

/**
 * Update request message status (accepted / declined) inside the JSONB content field.
 */
export async function updateRequestStatus(
  messageId: string,
  status: "accepted" | "declined",
  careType: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: msg, error: fetchError } = await supabase
      .from("messages")
      .select("content, conversation_id")
      .eq("id", messageId)
      .single();

    if (fetchError) throw fetchError;

    const { data: conv, error: convError } = await supabase
      .from("conversations")
      .select("family_id, caregiver_id")
      .eq("id", msg.conversation_id)
      .single();

    if (convError) throw convError;

    const currentContent = typeof msg.content === "string" ? JSON.parse(msg.content) : msg.content;

    let hourlyRate = currentContent?.hourlyRate;
    if (!hourlyRate) {
      const { data: caregiverProfile } = await supabase
        .from("CaregiverProfile")
        .select("hourlyRate")
        .eq("id", conv.caregiver_id)
        .single();
      if (caregiverProfile) {
        hourlyRate = Number(caregiverProfile.hourlyRate || 30);
      }
    }

    const updatedContent = {
      ...currentContent,
      status,
      hourlyRate: Number(hourlyRate || 30),
    };

    const { error: updateError } = await supabase
      .from("messages")
      .update({ content: updatedContent })
      .eq("id", messageId);

    if (updateError) throw updateError;

    if (status === "accepted") {
      let resolvedHourlyRate = 30;

      const { data: caregiverProfile } = await supabase
        .from("CaregiverProfile")
        .select("hourlyRate")
        .eq("id", conv.caregiver_id)
        .single();
      
      if (caregiverProfile) {
        resolvedHourlyRate = Number(caregiverProfile.hourlyRate || 30);
      }

      // Calculate total amount to be paid based on careType (One-time, Recurring, Live-in)
      const calculatedPayment = await calculateBookingPayment(careType, currentContent, resolvedHourlyRate);

      const bookingContent = {
        ...currentContent,
        hourlyRate: resolvedHourlyRate,
        totalAmount: calculatedPayment,
        payment: calculatedPayment,
        paid: 0,
      };

      const bookingInsertData: any = {
        careGiverId: conv.caregiver_id,
        careFaimlyId: conv.family_id,
        status: "ACCEPTED",
        careType: careType,
        created_at: new Date().toISOString(),
        content: bookingContent,
      };

      if (typeof calculatedPayment === "number" && !isNaN(calculatedPayment)) {
        bookingInsertData.payment = calculatedPayment;
        bookingInsertData.paid = 0;
      }

      let { error: bookingError } = await supabase
        .from("Booking")
        .insert(bookingInsertData);

      if (bookingError) {
        console.warn("Primary booking insert failed, retrying with core schema:", bookingError.message);
        
        const coreInsertData: any = {
          careGiverId: conv.caregiver_id,
          careFaimlyId: conv.family_id,
          status: "ACCEPTED",
          careType: careType,
          content: bookingContent,
        };

        const { error: retryError } = await supabase
          .from("Booking")
          .insert(coreInsertData);

        if (retryError) {
          console.error("Failed to create booking on retry:", retryError);
          throw retryError;
        }
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error("Error updating request status:", err);
    return { success: false, error: err.message || "Failed to update status." };
  }
}
