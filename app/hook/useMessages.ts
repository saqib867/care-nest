"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  getMessagesForConversation,
  sendMessage,
  updateRequestStatus,
  DBMessage,
} from "@/app/actions/messages-action";
import { useConversations } from "./useConversations";

export function useMessages(explicitConversationId?: string | null) {
  const { activeThreadId: contextConversationId, setThreads, myId } = useConversations();
  const conversationId =
    explicitConversationId !== undefined ? explicitConversationId : contextConversationId;

  const [messages, setMessages] = useState<DBMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const [inputVal, setInputVal] = useState("");
  const [sending, setSending] = useState(false);
  const [acceptedRequests, setAcceptedRequests] = useState<Record<string, boolean>>({});

  // 1. Fetch Initial Messages Page & Setup Realtime Listener
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setHasMoreMessages(false);
      setNextCursor(null);
      return;
    }

    let active = true;
    setLoadingMessages(true);

    getMessagesForConversation(conversationId, 30)
      .then((res) => {
        if (!active) return;
        if (res.success && res.messages) {
          setMessages(res.messages);
          setNextCursor(res.nextCursor || null);
          setHasMoreMessages(!!res.nextCursor);
        }
      })
      .catch((err) => {
        console.error("Error loading messages:", err);
      })
      .finally(() => {
        if (active) setLoadingMessages(false);
      });

    const channelName = `chat-${conversationId}-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const raw = payload.new;
          const newMsg: DBMessage = {
            id: raw.id,
            conversationId: raw.conversation_id,
            senderId: raw.sender_id,
            senderType: raw.sender_type,
            messageType: raw.message_type,
            content: raw.content,
            isRead: raw.is_read,
            createdAt: raw.created_at,
          };

          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });

          const lastMsgText =
            newMsg.messageType === "request"
              ? "📅 Care Request Sent"
              : newMsg.content?.text || "New message";

          setThreads((prev) =>
            prev.map((t) =>
              t.id === conversationId
                ? { ...t, lastMessage: lastMsgText, time: "Just now" }
                : t
            )
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const updated = payload.new;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === updated.id
                ? {
                    ...m,
                    content: updated.content,
                    isRead: updated.is_read,
                  }
                : m
            )
          );
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [conversationId, setThreads]);

  // 2. Fetch More Messages (Cursor-Based Pagination)
  const fetchMoreMessages = useCallback(async () => {
    if (!conversationId || !hasMoreMessages || loadingMore || !nextCursor) {
      return;
    }

    setLoadingMore(true);
    try {
      const res = await getMessagesForConversation(conversationId, 30, nextCursor);
      if (res.success && res.messages && res.messages.length > 0) {
        setMessages((prev) => [...res.messages!, ...prev]);
        setNextCursor(res.nextCursor || null);
        setHasMoreMessages(!!res.nextCursor);
      } else {
        setHasMoreMessages(false);
      }
    } catch (err) {
      console.error("Error fetching more messages:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [conversationId, hasMoreMessages, loadingMore, nextCursor]);

  // 3. Send Text Message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !conversationId || !myId || sending) return;

    setSending(true);
    const text = inputVal.trim();
    setInputVal("");

    try {
      const res = await sendMessage(conversationId, myId, text);
      if (res.success && res.message) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === res.message!.id)) return prev;
          return [...prev, res.message!];
        });
        setThreads((prev) =>
          prev.map((t) =>
            t.id === conversationId
              ? { ...t, lastMessage: text, time: "Just now" }
              : t
          )
        );
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  // 4. Accept Request
  const acceptRequest = async (msgId: string, careType: string) => {
    try {
      const res = await updateRequestStatus(msgId, "accepted", careType);
      if (res.success) {
        setAcceptedRequests((prev) => ({ ...prev, [msgId]: true }));
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === msgId) {
              const contentObj =
                typeof m.content === "string"
                  ? JSON.parse(m.content)
                  : m.content;
              return {
                ...m,
                content: { ...contentObj, status: "accepted" },
              };
            }
            return m;
          })
        );
      } else {
        console.error("acceptRequest server action returned error:", res.error);
        alert(`Failed to accept request: ${res.error || "Unknown server error"}`);
      }
    } catch (err: any) {
      console.error("Failed to accept request:", err);
      alert(`Error accepting request: ${err.message || "Network error"}`);
    }
  };

  // 5. Decline Request
  const declineRequest = async (msgId: string, careType: string) => {
    try {
      const res = await updateRequestStatus(msgId, "declined", careType);
      if (res.success) {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === msgId) {
              const contentObj =
                typeof m.content === "string"
                  ? JSON.parse(m.content)
                  : m.content;
              return {
                ...m,
                content: { ...contentObj, status: "declined" },
              };
            }
            return m;
          })
        );
      }
    } catch (err) {
      console.error("Failed to decline request:", err);
    }
  };

  return {
    messages,
    loadingMessages,
    loadingMore,
    hasMoreMessages,
    sending,
    inputVal,
    acceptedRequests,
    setMessages,
    setInputVal,
    fetchMoreMessages,
    acceptRequest,
    declineRequest,
    myId,
    handleSend,
  };
}
