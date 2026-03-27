// TODO: Chat hook — manages message history, loading state, error state
// Calls POST /api/chat, appends user message, then assistant response
// Returns: { messages, sendMessage, isLoading, error, clearMessages }
import { useState } from "react";
import { ChatMessage } from "@/types";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage(content: string) {
    // TODO: implement
  }

  function clearMessages() {
    setMessages([]);
  }

  return { messages, sendMessage, isLoading, error, clearMessages };
}
