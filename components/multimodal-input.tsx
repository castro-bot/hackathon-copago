"use client";

import type { UIMessage, UseChatHelpers } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useWindowSize } from "usehooks-ts";

import { sanitizeUIMessages } from "@/lib/utils";
import { Button } from "./ui/button";

const suggestedActions = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "Tengo un dolor agudo en el pecho",
    action: "Tengo un dolor agudo en el pecho desde hace 2 horas.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    ),
    title: "Necesito revisión dermatológica de rutina",
    action: "Necesito revisión dermatológica de rutina.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <path d="M14 2v6h6" />
        <path d="M12 18v-6" />
        <path d="M9 15h6" />
      </svg>
    ),
    title: "Requiero análisis de laboratorio general",
    action: "Requiero análisis de laboratorio general.",
  },
];

export function MultimodalInput({
  chatId,
  isLoading,
  stop,
  messages,
  setMessages,
  sendMessage,
  className,
}: {
  chatId: string;
  isLoading: boolean;
  stop: () => void;
  messages: Array<UIMessage>;
  setMessages: Dispatch<SetStateAction<Array<UIMessage>>>;
  sendMessage: UseChatHelpers<UIMessage>["sendMessage"];
  className?: string;
}) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight + 2, 200)}px`;
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const submitForm = useCallback(() => {
    if (!input.trim()) return;

    sendMessage({
      role: "user",
      parts: [{ type: "text", text: input.trim() }],
    } as any);

    setInput("");

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [input, sendMessage, width]);

  return (
    <div className="relative w-full flex flex-col gap-3">
      {/* Suggested actions - only show when no messages */}
      <AnimatePresence>
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex flex-wrap gap-2 justify-center"
          >
            {suggestedActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.08 }}
                onClick={() => {
                  sendMessage({
                    role: "user",
                    parts: [{ type: "text", text: action.action }],
                  } as any);
                }}
                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border/70 bg-card/80 hover:bg-card hover:border-[hsl(168,65%,38%)]/30 hover:shadow-md hover:shadow-[hsl(168,65%,38%)]/5 text-sm text-foreground transition-all duration-300 cursor-pointer"
              >
                <span className="text-muted-foreground group-hover:text-[hsl(168,65%,38%)] transition-colors">
                  {action.icon}
                </span>
                <span className="text-[13px]">{action.title}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input container */}
      <div className="relative flex items-end rounded-2xl border border-border/70 bg-card shadow-lg shadow-black/[0.03] focus-within:border-[hsl(168,65%,38%)]/40 focus-within:shadow-[hsl(168,65%,38%)]/5 focus-within:shadow-xl transition-all duration-300">
        <textarea
          ref={textareaRef}
          placeholder="Describe tus síntomas o consulta médica..."
          value={input}
          onChange={handleInput}
          rows={1}
          className="flex-1 min-h-[52px] max-h-[200px] w-full resize-none bg-transparent pl-4 pr-14 py-[14px] text-[14px] placeholder:text-muted-foreground/60 focus:outline-none"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submitForm();
            }
          }}
        />

        {/* Send / Stop button */}
        <div className="absolute bottom-2 right-2">
          {isLoading ? (
            <Button
              size="icon"
              className="h-9 w-9 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 border-0 transition-all"
              onClick={(event) => {
                event.preventDefault();
                stop();
                setMessages((messages) => sanitizeUIMessages(messages));
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </Button>
          ) : (
            <Button
              size="icon"
              className="h-9 w-9 rounded-xl bg-gradient-to-br from-[hsl(168,65%,38%)] to-[hsl(168,65%,28%)] text-white hover:opacity-90 border-0 shadow-md shadow-[hsl(168,65%,38%)]/20 disabled:opacity-30 disabled:shadow-none transition-all"
              onClick={(event) => {
                event.preventDefault();
                submitForm();
              }}
              disabled={!input || input.length === 0}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </Button>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-[11px] text-muted-foreground/50">
        El asistente puede cometer errores. Verifica la información importante.
      </p>
    </div>
  );
}
