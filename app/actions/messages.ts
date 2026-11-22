"use server";

import {
  getOrCreateConversation as _getOrCreateConversation,
  getConversationsForUser as _getConversationsForUser,
  getMessagesForConversation as _getMessagesForConversation,
  sendMessage as _sendMessage,
  sendCareRequest as _sendCareRequest,
  updateRequestStatus as _updateRequestStatus,
} from "./messages-action";

export type { DBConversation, DBMessage, ChatThread } from "./messages-action";

export async function getOrCreateConversation(senderId: string, recipientId: string) {
  return _getOrCreateConversation(senderId, recipientId);
}

export async function getConversationsForUser(userId: string) {
  return _getConversationsForUser(userId);
}

export async function getMessagesForConversation(
  conversationId: string,
  limit?: number,
  beforeCursor?: string
) {
  return _getMessagesForConversation(conversationId, limit, beforeCursor);
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  contentText: string
) {
  return _sendMessage(conversationId, senderId, contentText);
}

export async function sendCareRequest(
  conversationId: string,
  senderId: string,
  requestDetails: any
) {
  return _sendCareRequest(conversationId, senderId, requestDetails);
}

export async function updateRequestStatus(
  messageId: string,
  status: "accepted" | "declined",
  careType: string
) {
  return _updateRequestStatus(messageId, status, careType);
}
