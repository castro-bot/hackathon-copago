"use client";

import type { UIMessage } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { Streamdown } from "streamdown";

import { PreviewAttachment } from "./preview-attachment";
import { cn } from "@/lib/utils";
import { Weather } from "./weather";

const BotAvatar = () => (
  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[hsl(168,65%,38%)] to-[hsl(168,65%,28%)] flex items-center justify-center shadow-sm shadow-[hsl(168,65%,38%)]/10 shrink-0">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="4" width="4" height="16" rx="1" fill="white"/>
      <rect x="4" y="10" width="16" height="4" rx="1" fill="white"/>
    </svg>
  </div>
);

const UserAvatar = () => (
  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[hsl(215,25%,35%)] to-[hsl(215,25%,25%)] flex items-center justify-center shadow-sm shrink-0">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M20 21a8 8 0 0 0-16 0"/>
    </svg>
  </div>
);

export const PreviewMessage = ({
  message,
}: {
  chatId: string;
  message: UIMessage;
  isLoading: boolean;
}) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message"
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      data-role={message.role}
    >
      <div
        className={cn(
          "flex gap-3 max-w-full",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar */}
        {isUser ? <UserAvatar /> : <BotAvatar />}

        {/* Message bubble */}
        <div
          className={cn(
            "relative px-4 py-3 rounded-2xl max-w-[85%] md:max-w-[75%] text-[14px] leading-relaxed",
            isUser
              ? "bg-gradient-to-br from-[hsl(168,65%,38%)] to-[hsl(168,60%,32%)] text-white rounded-tr-md shadow-md shadow-[hsl(168,65%,38%)]/10"
              : "bg-card border border-border/60 text-foreground rounded-tl-md shadow-sm"
          )}
        >
          {message.parts &&
            message.parts.map((part: any, index: number) => {
              if (part.type === "text") {
                return (
                  <div key={index} className="streamdown-container">
                    <Streamdown>{part.text}</Streamdown>
                  </div>
                );
              }
              // Handle tool calls
              if (part.type?.startsWith("tool-")) {
                const { toolCallId, state, output } = part;
                const toolName = part.type.replace("tool-", "");

                if (state === "output-available" && output) {
                  return (
                    <div key={toolCallId}>
                      {toolName === "get_current_weather" ? (
                        <Weather weatherAtLocation={output} />
                      ) : (
                        <pre className="text-xs overflow-auto">{JSON.stringify(output, null, 2)}</pre>
                      )}
                    </div>
                  );
                }
                if (state === "input-streaming" || state === "input-available") {
                  return (
                    <div
                      key={toolCallId}
                      className={cn({
                        skeleton: ["get_current_weather"].includes(toolName),
                      })}
                    >
                      {toolName === "get_current_weather" ? <Weather /> : null}
                    </div>
                  );
                }
              }
              if (part.type === "file") {
                return <PreviewAttachment key={index} attachment={part} />;
              }
              return null;
            })}
        </div>
      </div>
    </motion.div>
  );
};

export const ThinkingMessage = () => {
  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message"
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.35 }}
      data-role="assistant"
    >
      <div className="flex gap-3">
        <BotAvatar />
        <div className="relative px-4 py-3 rounded-2xl rounded-tl-md bg-card border border-border/60 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <motion.span
                className="w-2 h-2 rounded-full bg-[hsl(168,65%,38%)]"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
              />
              <motion.span
                className="w-2 h-2 rounded-full bg-[hsl(168,65%,38%)]"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
              />
              <motion.span
                className="w-2 h-2 rounded-full bg-[hsl(168,65%,38%)]"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
              />
            </div>
            <span className="text-sm text-muted-foreground ml-1">Analizando...</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
