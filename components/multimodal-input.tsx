"use client";

import type { UIMessage, UseChatHelpers } from "@ai-sdk/react";
import { motion } from "framer-motion";
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
import { ArrowUpIcon, StopIcon } from "./icons";
import { Button } from "./ui/button";

const suggestedActions = [
  {
    title: "¿Cuál es mi cobertura?",
    label: "para consultas médicas",
    action: "¿Cuál es mi cobertura para consultas médicas?",
  },
  {
    title: "¿Cómo solicito",
    label: "una autorización?",
    action: "¿Cómo solicito una autorización médica?",
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
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
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
    <div className="relative w-full flex flex-col gap-4">
      {messages.length === 0 && (
        <div className="grid sm:grid-cols-2 gap-2 w-full">
          {suggestedActions.map((suggestedAction, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.05 * index }}
              key={`suggested-action-${suggestedAction.title}-${index}`}
              className={index > 1 ? "hidden sm:block" : "block"}
            >
              <Button
                variant="ghost"
                onClick={() => {
                  sendMessage({
                    role: "user",
                    parts: [{ type: "text", text: suggestedAction.action }],
                  } as any);
                }}
                className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
              >
                <span className="font-medium">{suggestedAction.title}</span>
                <span className="text-muted-foreground">
                  {suggestedAction.label}
                </span>
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      <textarea
        ref={textareaRef}
        placeholder="Escribe tu mensaje..."
        value={input}
        onChange={handleInput}
        className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submitForm();
          }
        }}
      />

      {isLoading ? (
        <Button
          className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5 border dark:border-zinc-600"
          onClick={(event) => {
            event.preventDefault();
            stop();
            setMessages((messages) => sanitizeUIMessages(messages));
          }}
        >
          <StopIcon size={14} />
        </Button>
      ) : (
        <Button
          className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5 border dark:border-zinc-600"
          onClick={(event) => {
            event.preventDefault();
            submitForm();
          }}
          disabled={!input || input.length === 0}
        >
          <ArrowUpIcon size={14} />
        </Button>
      )}
    </div>
  );
}
