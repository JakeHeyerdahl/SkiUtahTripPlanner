"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Check, ChevronRight, Hotel, Plane, Star, Map, CalendarOff, CalendarCheck, Utensils, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ConciergeAction {
  id: string;
  tool: string;
  input: Record<string, unknown>;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: ConciergeAction[];
  isStreaming?: boolean;
}

interface ConciergePanelProps {
  isOpen: boolean;
  onClose: () => void;
  context: "packages" | "itinerary";
  tripContext: string;
  packagesContext?: string;
  itineraryContext?: string;
  onAction?: (action: ConciergeAction) => void;
  appliedActionIds?: Set<string>;
  suggestedPrompts?: string[];
}

// ─── Action Card ─────────────────────────────────────────────────────────────
function ActionCard({
  action,
  applied,
  onApply,
}: {
  action: ConciergeAction;
  applied: boolean;
  onApply: () => void;
}) {
  const icons: Record<string, React.ReactNode> = {
    recommend_hotel: <Hotel size={14} strokeWidth={2} />,
    recommend_flight: <Plane size={14} strokeWidth={2} />,
    highlight_package: <Star size={14} strokeWidth={2} />,
    update_day_note: <Sparkles size={14} strokeWidth={2} />,
    swap_day_resort: <Map size={14} strokeWidth={2} />,
    set_day_type: (action.input.type === "rest")
      ? <CalendarOff size={14} strokeWidth={2} />
      : <CalendarCheck size={14} strokeWidth={2} />,
    update_meal: <Utensils size={14} strokeWidth={2} />,
    add_day_activity: <Plus size={14} strokeWidth={2} />,
  };

  const labels: Record<string, (input: Record<string, unknown>) => string> = {
    recommend_hotel: () => "Switch hotel",
    recommend_flight: () => "Switch flight",
    highlight_package: (i) => `Focus on ${i.packageId === "pkg-best" ? "Best Overall" : i.packageId === "pkg-value" ? "Best Value" : "Most Adventurous"}`,
    update_day_note: (i) => `Add tip to Day ${(i.dayIndex as number) + 1}`,
    swap_day_resort: (i) => `Switch Day ${(i.dayIndex as number) + 1} to ${i.resortName}`,
    set_day_type: (i) => i.type === "rest"
      ? `Remove skiing from Day ${(i.dayIndex as number) + 1}`
      : `Add skiing to Day ${(i.dayIndex as number) + 1} at ${i.resortName ?? "resort"}`,
    update_meal: (i) => `Update ${i.mealType} on Day ${(i.dayIndex as number) + 1}`,
    add_day_activity: (i) => `Add activity to Day ${(i.dayIndex as number) + 1}`,
  };

  const label = labels[action.tool]?.(action.input) ?? action.tool;
  const reason = (action.input.reason ?? action.input.note) as string | undefined;

  return (
    <div className={cn(
      "mt-2 rounded-xl border p-3 text-sm transition-all",
      applied
        ? "border-[#008A05]/30 bg-[#008A05]/5"
        : "border-[#1B6BB0]/30 bg-[#EBF5FF]"
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0">
          <span className={cn("mt-0.5 flex-shrink-0", applied ? "text-[#008A05]" : "text-[#1B6BB0]")}>
            {applied ? <Check size={14} strokeWidth={2.5} /> : icons[action.tool]}
          </span>
          <div className="min-w-0">
            <p className={cn("font-semibold leading-tight", applied ? "text-[#008A05]" : "text-[#0D2240]")}>
              {applied ? "Applied ✓" : label}
            </p>
            {reason && <p className="text-xs text-[#3D5066] mt-0.5 leading-snug">{reason}</p>}
          </div>
        </div>
        {!applied && (
          <button
            onClick={onApply}
            className="flex-shrink-0 flex items-center gap-1 bg-[#0D2240] hover:bg-[#1B6BB0] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            Apply
            <ChevronRight size={11} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({
  message,
  appliedActionIds,
  onAction,
}: {
  message: Message;
  appliedActionIds: Set<string>;
  onAction: (action: ConciergeAction) => void;
}) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[#0D2240] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles size={12} className="text-white" />
        </div>
      )}

      <div className={cn("max-w-[80%] min-w-0", isUser ? "items-end" : "items-start")}>
        <div className={cn(
          "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-[#0D2240] text-white rounded-tr-sm"
            : "bg-[#F4F6F8] text-[#222222] rounded-tl-sm"
        )}>
          {message.content}
          {message.isStreaming && (
            <span className="inline-flex gap-0.5 ml-1 align-middle">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-1 h-1 rounded-full bg-current opacity-60 inline-block"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </span>
          )}
        </div>

        {/* Action cards */}
        {message.actions?.map((action) => (
          <ActionCard
            key={action.id}
            action={action}
            applied={appliedActionIds.has(action.id)}
            onApply={() => onAction(action)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────
export default function ConciergePanel({
  isOpen,
  onClose,
  context,
  tripContext,
  packagesContext,
  itineraryContext,
  onAction,
  appliedActionIds = new Set(),
  suggestedPrompts = [],
}: ConciergePanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const defaultPrompts = context === "packages"
    ? ["Which hotel is best for families?", "Show me nonstop flights only", "What's the best resort for beginners?", "I want to focus on powder skiing"]
    : ["What should I do on the rest day?", "Best restaurant for a group dinner?", "How do I get from the hotel to the slopes?", "Can we fit Snowbird and Alta in one day?"];

  const prompts = suggestedPrompts.length > 0 ? suggestedPrompts : defaultPrompts;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // Placeholder streaming message
    const assistantMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: assistantMsgId, role: "assistant", content: "", isStreaming: true },
    ]);

    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          context,
          tripContext,
          packagesContext,
          itineraryContext,
        }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accText = "";
      const actions: ConciergeAction[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;

          try {
            const event = JSON.parse(raw);

            if (event.type === "text") {
              accText += event.delta;
              setMessages((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (last?.role === "assistant") {
                  next[next.length - 1] = { ...last, content: accText, isStreaming: true };
                }
                return next;
              });
            } else if (event.type === "action") {
              actions.push({ id: event.id, tool: event.tool, input: event.input });
            } else if (event.type === "done") {
              setMessages((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (last?.role === "assistant") {
                  next[next.length - 1] = {
                    ...last,
                    content: accText,
                    isStreaming: false,
                    actions: actions.length > 0 ? actions : undefined,
                  };
                }
                return next;
              });
            } else if (event.type === "error") {
              setMessages((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (last?.role === "assistant") {
                  next[next.length - 1] = { ...last, content: event.message, isStreaming: false };
                }
                return next;
              });
            }
          } catch {
            // ignore malformed lines
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role === "assistant") {
          next[next.length - 1] = { ...last, content: "Sorry, something went wrong. Please try again.", isStreaming: false };
        }
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
          /* Panel — no backdrop, sits beside the content */
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-4 top-4 bottom-4 w-full max-w-sm bg-white shadow-2xl z-40 flex flex-col rounded-2xl overflow-hidden border border-[#EBEBEB]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EBEBEB]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#0D2240] flex items-center justify-center">
                  <Sparkles size={14} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-[#0D2240] text-sm leading-tight">Ski Utah Concierge</p>
                  <p className="text-xs text-[#3D5066]">
                    {context === "packages" ? "Helping with your packages" : "Helping with your itinerary"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close concierge"
                className="w-8 h-8 rounded-full bg-[#F4F6F8] flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X size={14} strokeWidth={2.5} className="text-[#3D5066]" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#0D2240] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles size={12} className="text-white" />
                    </div>
                    <div className="bg-[#F4F6F8] rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-[#222222] leading-relaxed max-w-[80%]">
                      Hi! I&apos;m your Ski Utah concierge. I can help you choose between hotels and flights, answer questions about the resorts, or find the perfect package for your group. What would you like to know?
                    </div>
                  </div>

                  {/* Suggested prompts */}
                  <div className="space-y-2 pt-2">
                    <p className="text-[10px] font-semibold text-[#3D5066] uppercase tracking-widest px-1">Try asking</p>
                    <div className="flex flex-col gap-1.5">
                      {prompts.slice(0, 4).map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => sendMessage(prompt)}
                          className="text-left px-3 py-2.5 rounded-xl bg-[#F4F6F8] hover:bg-[#EBF5FF] border border-transparent hover:border-[#1B6BB0]/20 text-sm text-[#0D2240] font-medium transition-all"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  appliedActionIds={appliedActionIds}
                  onAction={(action) => onAction?.(action)}
                />
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-4 border-t border-[#EBEBEB]">
              <div className="flex items-center gap-2 bg-[#F4F6F8] rounded-2xl px-4 py-2.5">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                  placeholder="Ask about resorts, hotels, flights…"
                  className="flex-1 bg-transparent text-sm text-[#222222] placeholder:text-[#AAAAAA] outline-none focus:outline-none ring-0 focus:ring-0"
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                    input.trim() && !isLoading
                      ? "bg-[#0D2240] hover:bg-[#1B6BB0] text-white"
                      : "bg-[#DDDDDD] text-[#AAAAAA]"
                  )}
                >
                  <Send size={13} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </motion.div>
      )}
    </AnimatePresence>
  );
}
