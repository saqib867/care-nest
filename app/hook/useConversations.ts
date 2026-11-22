"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  getConversationsForUser,
  getOrCreateConversation,
  ChatThread,
} from "@/app/actions/messages-action";
import { useDashboardAuth } from "./useDashboard";

export function useConversations() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { userId: myId } = useDashboardAuth();

  const urlThreadId = searchParams.get("threadId");
  const urlUserId = searchParams.get("userId");

  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [fallbackActiveThreadId, setFallbackActiveThreadId] = useState<string | null>(null);

  const activeThreadId = urlThreadId || fallbackActiveThreadId;

  const setActiveThreadId = useCallback(
    (id: string | null) => {
      setFallbackActiveThreadId(id);
      if (id) {
        router.push(`/dashboard/messages?threadId=${id}`);
      } else {
        router.push("/dashboard/messages");
      }
    },
    [router]
  );

  const loadThreads = useCallback(
    async (selectUserId?: string | null) => {
      if (!myId) return;
      const targetUserId = selectUserId || urlUserId;
      const targetThreadId = urlThreadId;

      try {
        const res = await getConversationsForUser(myId);
        if (res.success && res.threads) {
          setThreads(res.threads);

          if (targetThreadId && res.threads.some((t) => t.id === targetThreadId)) {
            setFallbackActiveThreadId(targetThreadId);
          } else if (targetUserId) {
            const existingThread = res.threads.find(
              (t) => t.recipientId === targetUserId
            );
            if (existingThread) {
              setFallbackActiveThreadId(existingThread.id);
              router.replace(`/dashboard/messages?threadId=${existingThread.id}`);
            } else {
              const createRes = await getOrCreateConversation(myId, targetUserId);
              if (createRes.success && createRes.conversationId) {
                const reloadRes = await getConversationsForUser(myId);
                if (reloadRes.success && reloadRes.threads) {
                  setThreads(reloadRes.threads);
                  setFallbackActiveThreadId(createRes.conversationId);
                  router.replace(
                    `/dashboard/messages?threadId=${createRes.conversationId}`
                  );
                }
              }
            }
          } else if (res.threads.length > 0 && !activeThreadId) {
            const defaultId = res.threads[0].id;
            setFallbackActiveThreadId(defaultId);
            router.replace(`/dashboard/messages?threadId=${defaultId}`);
          }
        }
      } catch (err) {
        console.error("Failed to load conversations:", err);
      } finally {
        setLoadingThreads(false);
      }
    },
    [myId, urlUserId, urlThreadId, activeThreadId, router]
  );

  const loadThreadsRef = useRef(loadThreads);
  useEffect(() => {
    loadThreadsRef.current = loadThreads;
  }, [loadThreads]);

  // 1. Initial Load
  useEffect(() => {
    if (myId) {
      loadThreads();
    }
  }, [myId, loadThreads]);

  // 2. Stable Realtime Listener for conversations table updates
  useEffect(() => {
    if (!myId) return;

    const channelName = `conv-rt-${myId}-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
          filter: `family_id=eq.${myId}`,
        },
        () => {
          loadThreadsRef.current();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
          filter: `caregiver_id=eq.${myId}`,
        },
        () => {
          loadThreadsRef.current();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [myId]);

  const activeThread = threads.find((t) => t.id === activeThreadId) || null;

  return {
    threads,
    setThreads,
    loadingThreads,
    activeThreadId,
    activeThread,
    setActiveThreadId,
    loadThreads,
    myId,
  };
}
