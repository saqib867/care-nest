"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useConversations } from "@/app/hook/useConversations";
import ChatThreadsList from "./ChatThreadsList";
import ChatWindow from "./ChatWindow";

function UnifiedMessagesContent() {
  const searchParams = useSearchParams();
  const { myId, loadThreads, loadingThreads } = useConversations();

  const targetUserId = searchParams.get("userId");

  useEffect(() => {
    if (myId) {
      loadThreads(targetUserId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myId, targetUserId]);

  if (loadingThreads) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-2">
        <Loader2 className="size-7 text-primary animate-spin" />
        <p className="text-xs font-semibold text-muted-foreground animate-pulse">
          Opening secure chat threads...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 container mx-auto  min-h-screen duration-300">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-100/40 flex overflow-hidden h-[calc(100vh-90px)] min-h-[600px]">
        {/* LEFT Section: Conversations List */}
        <ChatThreadsList />

        {/* RIGHT Section: Active Conversation Area */}
        <ChatWindow />
      </div>
    </div>
  );
}

export default function UnifiedMessages() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="size-7 text-primary animate-spin" />
        </div>
      }
    >
      <UnifiedMessagesContent />
    </Suspense>
  );
}
