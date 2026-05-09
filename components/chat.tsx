"use client";

import { useState, useCallback } from "react";
import { PreviewMessage, ThinkingMessage } from "@/components/message";
import { MultimodalInput } from "@/components/multimodal-input";
import { Overview } from "@/components/overview";
import { Navbar } from "@/components/navbar";
import { PolicySelector } from "@/components/policy-selector";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function Chat() {
  const chatId = "001";
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);

  const { messages, setMessages, sendMessage: sdkSendMessage, status, stop } = useChat({
    api: "/api/chat",
    id: chatId,
    body: {
      selectedPolicy: selectedPolicy,
    },
    onError: (error: Error) => {
      toast.error("Error al conectar con el asistente médico.", {
        description: "Verifica que el servidor esté activo e intenta de nuevo.",
      });
      console.error(error);
    },
  } as any);

  const customSendMessage = useCallback(
    async (msg?: any, options?: any) => {
      if (typeof sdkSendMessage === "function") {
        return sdkSendMessage(msg, { ...options, body: { ...options?.body, selectedPolicy } });
      }
    },
    [sdkSendMessage, selectedPolicy]
  );

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();
  const isLoading = status === "submitted" || status === "streaming";

  const handlePolicySelect = useCallback((policyId: string) => {
    setSelectedPolicy(policyId);
  }, []);

  return (
    <>
      {/* Policy selector overlay */}
      {!selectedPolicy && <PolicySelector onSelect={handlePolicySelect} />}

      <div className="flex flex-col h-dvh bg-background">
        {/* Top navbar */}
        <Navbar selectedPolicy={selectedPolicy} />

        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto"
          >
            <div className="flex flex-col min-h-full">
              {messages.length === 0 ? (
                <Overview />
              ) : (
                <div className="flex flex-col gap-5 py-6">
                  {messages.map((message: UIMessage, index: number) => (
                    <PreviewMessage
                      key={message.id}
                      chatId={chatId}
                      message={message}
                      isLoading={isLoading && messages.length - 1 === index}
                    />
                  ))}

                  {isLoading &&
                    messages.length > 0 &&
                    messages[messages.length - 1].role === "user" && (
                      <ThinkingMessage />
                    )}
                </div>
              )}
              <div
                ref={messagesEndRef}
                className="shrink-0 min-w-[24px] min-h-[24px]"
              />
            </div>
          </div>

          {/* Input area */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="border-t border-border/40 bg-background/80 backdrop-blur-xl"
          >
            <div className="mx-auto px-4 py-4 md:py-5 w-full max-w-3xl">
              <MultimodalInput
                chatId={chatId}
                isLoading={isLoading}
                stop={stop}
                messages={messages}
                setMessages={setMessages}
                sendMessage={customSendMessage}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}