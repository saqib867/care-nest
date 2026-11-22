import { create } from "zustand";
import { ChatThread, DBMessage } from "@/app/actions/messages";

interface MessagesState {
  threads: ChatThread[];
  activeThreadId: string | null;
  messages: DBMessage[];
  inputVal: string;
  loadingThreads: boolean;
  loadingMessages: boolean;
  sending: boolean;
  acceptedRequests: Record<string, boolean>;

  setThreads: (threads: ChatThread[] | ((prev: ChatThread[]) => ChatThread[])) => void;
  setActiveThreadId: (id: string | null) => void;
  setMessages: (messages: DBMessage[] | ((prev: DBMessage[]) => DBMessage[])) => void;
  setInputVal: (val: string) => void;
  setLoadingThreads: (val: boolean) => void;
  setLoadingMessages: (val: boolean) => void;
  setSending: (val: boolean) => void;
  acceptRequest: (msgId: string) => void;
  declineRequest: (msgId: string) => void;
}

export const useMessagesStore = create<MessagesState>((set) => ({
  threads: [],
  activeThreadId: null,
  messages: [],
  inputVal: "",
  loadingThreads: true,
  loadingMessages: false,
  sending: false,
  acceptedRequests: {},

  setThreads: (threadsOrFn) => set((state) => ({
    threads: typeof threadsOrFn === "function" ? threadsOrFn(state.threads) : threadsOrFn
  })),
  setActiveThreadId: (activeThreadId) => set({ activeThreadId }),
  setMessages: (messagesOrFn) => set((state) => ({
    messages: typeof messagesOrFn === "function" ? messagesOrFn(state.messages) : messagesOrFn
  })),
  setInputVal: (inputVal) => set({ inputVal }),
  setLoadingThreads: (loadingThreads) => set({ loadingThreads }),
  setLoadingMessages: (loadingMessages) => set({ loadingMessages }),
  setSending: (sending) => set({ sending }),
  acceptRequest: (msgId) => set((state) => ({
    acceptedRequests: { ...state.acceptedRequests, [msgId]: true }
  })),
  declineRequest: (msgId) => {
    alert("Request declined.");
  }
}));
