"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import {
  Send,
  Phone,
  Video,
  Info,
  MessageSquare,
  Loader2,
  Calendar,
  Check,
  Clock,
  CheckCircle2,
  XCircle,
  Heart,
  MapPin,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { useConversations } from "@/app/hook/useConversations";
import { useMessages } from "@/app/hook/useMessages";
import { getMessagesForConversation, DBMessage } from "@/app/actions/messages";
import { useModalStore } from "@/components/modals/useModalStore";
import { getCaregiverById } from "@/app/actions/search";
import { useDashboardAuth } from "@/app/hook/useDashboard";
import { List, useDynamicRowHeight } from "react-window";
import { AutoSizer } from "react-virtualized-auto-sizer";
import { supabase } from "@/lib/supabase";

const parseContent = (content: any) => {
  if (!content) return {};
  if (typeof content === "string") {
    try {
      return JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse request content JSON string", e);
      return {};
    }
  }
  return content;
};

export default function ChatWindow() {
  const { threads, activeThreadId, activeThread, setActiveThreadId } =
    useConversations();
  const {
    messages,
    inputVal,
    setInputVal,
    loadingMessages,
    loadingMore,
    hasMoreMessages,
    fetchMoreMessages,
    sending,
    acceptedRequests,
    acceptRequest,
    declineRequest,
    myId,
    handleSend,
  } = useMessages(activeThreadId);

  const { openModal } = useModalStore();
  const { dbRole } = useDashboardAuth();
  const [loadingCaregiver, setLoadingCaregiver] = useState(false);

  const handleOpenRequestModal = async () => {
    if (!activeThread?.recipientId) return;
    setLoadingCaregiver(true);
    try {
      const res = await getCaregiverById(activeThread.recipientId);
      if (res.success && res.caregiver) {
        openModal("requestCare", { caregiver: res.caregiver });
      } else {
        alert(res.error || "Failed to load caregiver details.");
      }
    } catch (err) {
      console.error("Error loading caregiver:", err);
      alert("An error occurred while loading caregiver details.");
    } finally {
      setLoadingCaregiver(false);
    }
  };

  const listRef = useRef<any>(null);

  const dynamicRowHeight = useDynamicRowHeight({
    defaultRowHeight: 80,
    key: activeThreadId || "default",
  });

  // Scroll to bottom on new messages
  useEffect(() => {
    if (listRef.current && messages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToRow({
          index: messages.length - 1,
          align: "end",
        });
      }, 50);
    }
  }, [messages]);

  const Row = useMemo(() => {
    return ({
      index,
      style,
      myId,
      acceptedRequests,
      acceptRequest,
      declineRequest,
    }: {
      index: number;
      style: React.CSSProperties;
      myId: string | null;
      acceptedRequests: any;
      acceptRequest: any;
      declineRequest: any;
    }) => {
      const msg = messages[index];
      const isSender = msg.senderId === myId;
      const isRequest = msg.messageType === "request";

      return (
        <div style={style} className="px-4 py-1.5">
          <div
            className={`flex gap-3 ${
              isRequest
                ? "max-w-[92%] sm:max-w-[420px] w-full"
                : "max-w-[75%] sm:max-w-[480px] w-fit"
            } ${isSender ? "ml-auto flex-row-reverse" : ""}`}
          >
            {/* Content bubble */}
            <div className="space-y-1 w-full">
              {isRequest ? (
                (() => {
                  const req = parseContent(msg.content);
                  const isAccepted =
                    req.status === "accepted" || acceptedRequests[msg.id];
                  const isDeclined = req.status === "declined";

                  return (
                    <div
                      className={`w-full font-sans text-left rounded-2xl p-4 shadow-md space-y-3.5 text-slate-900 transition-all ${
                        isSender
                          ? "bg-slate-50 border border-slate-200/90"
                          : "bg-white border border-slate-200/90"
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                            <Calendar className="size-4" />
                          </div>
                          <div>
                            <span className="text-xs font-black text-slate-900 block leading-tight">
                              Shift Booking Request
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {isSender
                                ? "Sent Care Request"
                                : "Incoming Care Request"}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                            isAccepted
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : isDeclined
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              isAccepted
                                ? "bg-emerald-500"
                                : isDeclined
                                  ? "bg-red-500"
                                  : "bg-amber-500 animate-pulse"
                            }`}
                          />
                          {isAccepted
                            ? "Accepted"
                            : isDeclined
                              ? "Declined"
                              : "Pending"}
                        </span>
                      </div>

                      {/* Request Key Info Grid */}
                      <div className="grid grid-cols-3 gap-2">
                        <div
                          className={`p-2.5 rounded-xl space-y-0.5 ${
                            isSender
                              ? "bg-white border border-slate-200/60"
                              : "bg-slate-50 border border-slate-100"
                          }`}
                        >
                          <span className="font-bold text-[9px] uppercase tracking-wider text-slate-400 block truncate">
                            Care Type
                          </span>
                          <p className="font-extrabold text-slate-900 truncate">
                            {req.careType || "One-time Care"}
                          </p>
                        </div>
                        <div
                          className={`p-2.5 rounded-xl space-y-0.5 ${
                            isSender
                              ? "bg-white border border-slate-200/60"
                              : "bg-slate-50 border border-slate-100"
                          }`}
                        >
                          <span className="font-bold text-[9px] uppercase tracking-wider text-slate-400 block truncate">
                            Est. Duration
                          </span>
                          <p className="font-extrabold text-slate-900 truncate">
                            {req.estimatedDuration || "4 Hours"}
                          </p>
                        </div>
                        <div
                          className={`p-2.5 rounded-xl space-y-0.5 ${
                            isSender
                              ? "bg-white border border-slate-200/60"
                              : "bg-slate-50 border border-slate-100"
                          }`}
                        >
                          <span className="font-bold text-[9px] uppercase tracking-wider text-slate-400 block truncate">
                            Hourly Rate
                          </span>
                          <p className="font-extrabold text-emerald-700 truncate">
                            ${req.hourlyRate || 30}/hr
                          </p>
                        </div>
                      </div>

                      {/* Schedule Summary Banner */}
                      {req.scheduleSummary && (
                        <div className="p-3 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-slate-50 border-l-4 border-primary border border-primary/20 space-y-1">
                          <span className="font-extrabold text-[9px] uppercase tracking-wider text-primary flex items-center gap-1">
                            <Clock className="size-3" /> Requested Schedule
                          </span>
                          <p className="font-bold text-xs text-slate-900 leading-snug">
                            {req.scheduleSummary}
                          </p>
                        </div>
                      )}

                      {/* Recipient Info */}
                      {req.recipient && (
                        <div
                          className={`p-3 rounded-xl space-y-1 text-xs ${
                            isSender
                              ? "bg-white border border-slate-200/60"
                              : "bg-slate-50/80 border border-slate-100"
                          }`}
                        >
                          <span className="font-extrabold text-[9px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <Heart className="size-3 text-rose-500 fill-rose-500" />{" "}
                            Care Recipient
                          </span>
                          <div className="flex justify-between items-center">
                            <p className="font-extrabold text-slate-900">
                              {req.recipient.name}
                            </p>
                            <span className="text-[10px] font-bold text-slate-500">
                              {req.recipient.relationship}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {req.recipient.gender} • {req.recipient.age} years
                            old
                          </p>
                        </div>
                      )}

                      {/* Care Needs Badges */}
                      {req.careNeeds && req.careNeeds.length > 0 && (
                        <div
                          className={`p-3 rounded-xl space-y-1.5 ${
                            isSender
                              ? "bg-white border border-slate-200/60"
                              : "bg-slate-50/80 border border-slate-100"
                          }`}
                        >
                          <span className="font-extrabold text-[9px] uppercase tracking-wider text-slate-400 block">
                            Required Services
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {req.careNeeds.map((need: string) => (
                              <span
                                key={need}
                                className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-primary/10 text-primary border border-primary/20"
                              >
                                {need}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Location Info */}
                      {req.location && (
                        <div
                          className={`p-3 rounded-xl space-y-1 text-xs ${
                            isSender
                              ? "bg-white border border-slate-200/60"
                              : "bg-slate-50/80 border border-slate-100"
                          }`}
                        >
                          <span className="font-extrabold text-[9px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <MapPin className="size-3 text-primary" /> Service
                            Location
                          </span>
                          <p className="font-bold text-slate-800 text-[11px] leading-snug">
                            {req.location.address}
                            {req.location.aptNumber
                              ? `, Apt ${req.location.aptNumber}`
                              : ""}
                            <br />
                            {req.location.city}, {req.location.postalCode}
                          </p>
                        </div>
                      )}

                      {/* Personal Note */}
                      {req.personalMessage && (
                        <div
                          className={`p-3 rounded-xl border-l-3 italic text-[11px] ${
                            isSender
                              ? "bg-white border-primary text-slate-700"
                              : "bg-slate-50 border-slate-400 text-slate-600"
                          }`}
                        >
                          "{req.personalMessage}"
                        </div>
                      )}

                      {/* Card Footer & Interactive Actions */}
                      <div className="pt-2 border-t border-slate-100">
                        {isAccepted ? (
                          <div className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-emerald-500 rounded-xl text-white font-extrabold text-xs shadow-xs">
                            <CheckCircle2 className="size-4" /> Shift Accepted &
                            Confirmed
                          </div>
                        ) : isDeclined ? (
                          <div className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl font-extrabold text-xs">
                            <XCircle className="size-4 text-red-500" /> Shift
                            Declined
                          </div>
                        ) : isSender ? (
                          <div className="w-full py-2 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-xl text-center text-[10px] font-extrabold tracking-wide uppercase flex items-center justify-center gap-1.5">
                            <Clock className="size-3.5 text-amber-600 animate-spin" />{" "}
                            Awaiting Caregiver Response
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                acceptRequest(msg.id, req.careType)
                              }
                              className="flex-1 inline-flex h-9 items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all shadow-sm cursor-pointer"
                            >
                              Accept Request
                            </button>
                            <button
                              type="button"
                              onClick={() => declineRequest(msg.id)}
                              className="px-4 inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer bg-white"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div
                  className={`p-3 rounded-xl text-xs leading-relaxed shadow-sm ${
                    isSender
                      ? "bg-primary/70 text-white rounded-tr-none"
                      : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
                  }`}
                >
                  <p>{msg.content?.text}</p>
                </div>
              )}
              <span
                className={`block text-[9px] text-gray-400 ${isSender ? "text-right" : ""}`}
              >
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      );
    };
  }, [messages, myId, acceptedRequests, acceptRequest, declineRequest]);

  if (!activeThread) {
    return (
      <div className="hidden md:flex flex-1 flex-col items-center justify-center p-6 text-center text-gray-400 h-full">
        <MessageSquare className="size-12 stroke-1 mb-2 text-primary/30 animate-pulse" />
        <p className="text-sm font-semibold">
          Select a conversation thread to view chat log.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-full min-h-0 min-w-0">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/10">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setActiveThreadId(null)}
            className="md:hidden p-1 -ml-1 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            title="Back to conversations"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs shrink-0">
            {activeThread.name.charAt(0) || "U"}
          </div>
          <div>
            <h3 className="font-bold text-xs leading-none text-gray-900">
              {activeThread.name}
            </h3>
            <span className="text-[9px] text-gray-400 mt-1 block flex items-center gap-1">
              <span
                className={`size-1.5 rounded-full ${activeThread.isOnline ? "bg-primary" : "bg-gray-300"}`}
              />
              {activeThread.isOnline ? "Online" : "Away"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {dbRole === "FAMILY" && (
            <button
              onClick={handleOpenRequestModal}
              disabled={loadingCaregiver}
              className="h-8 px-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-primary/95 text-white text-xs font-bold transition-all shadow-sm active:scale-[0.98] cursor-pointer disabled:opacity-50 mr-1"
            >
              {loadingCaregiver ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Calendar className="size-3.5" />
              )}
              <span className="hidden sm:inline">Send Request</span>
            </button>
          )}

          <Link
            href={`/caregivers/${activeThread.recipientId}`}
            className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-100 hover:bg-gray-50 text-gray-500"
          >
            <Info className="size-4" />
          </Link>
        </div>
      </div>

      {/* Message log */}
      <div className="flex-1 min-h-0 bg-gray-50/20 relative">
        {loadingMessages && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="size-6 text-primary animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <MessageSquare className="size-10 text-gray-300 stroke-1 mb-2 animate-pulse" />
            <p className="text-xs">
              No messages yet. Send a message to start the conversation!
            </p>
          </div>
        ) : (
          <AutoSizer
            renderProp={({
              height,
              width,
            }: {
              height: number | undefined;
              width: number | undefined;
            }) => {
              if (height === undefined || width === undefined) return null;
              return (
                <List<{
                  myId: string | null;
                  acceptedRequests: any;
                  acceptRequest: any;
                  declineRequest: any;
                }>
                  listRef={listRef}
                  style={{ height, width }}
                  rowCount={messages.length}
                  rowHeight={dynamicRowHeight}
                  rowComponent={Row}
                  rowProps={{
                    myId,
                    acceptedRequests,
                    acceptRequest,
                    declineRequest,
                  }}
                />
              );
            }}
          />
        )}
      </div>

      {/* Input Text Form */}
      <form
        onSubmit={handleSend}
        className="p-3 sm:p-4 border-t border-gray-100 bg-white flex gap-2 items-center shrink-0"
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={sending}
          className="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-primary text-white hover:bg-primary/95 transition-colors shadow-sm cursor-pointer disabled:opacity-50 shrink-0"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}
