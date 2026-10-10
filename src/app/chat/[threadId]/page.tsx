"use client";

import { useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { Menu, Loader2, Sparkles } from "lucide-react";
import { useMobileNav } from "@/components/layout/mobile-nav-context";
import { useAuth } from "@clerk/nextjs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAuthReady } from "@/components/auth-sync";
import {
  fetchThreadData,
  sendMessage,
  setStreaming,
  appendStreamContent,
  addMessage,
} from "@/store/slices/threadSlice";
import ChatMessage from "@/components/chat/chat-message";
import ChatInput from "@/components/chat/chat-input";

export default function ThreadPage() {
  const params = useParams();
  const threadId = params.threadId as string;
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
  const authReady = useAuthReady();
  const { currentThreadId, threads, messages, streaming, streamingContent, loading } =
    useAppSelector((state) => state.thread);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { open } = useMobileNav();

  const currentThread = threads.find((t) => t.thread_id === threadId);
  const threadTitle = currentThread?.title || "New Chat";

  // Load thread data when auth is ready
  useEffect(() => {
    if (authReady && threadId) {
      dispatch(fetchThreadData(threadId));
    }
  }, [threadId, authReady, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const triggerAIResponse = useCallback(
    async (messageId: string, tId: string) => {
      dispatch(setStreaming(true));

      try {
        const token = await getToken();
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        const response = await fetch(
          `${apiUrl}/thread/trigger-ai-response`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              message_id: messageId,
              thread_id: tId,
            }),
          }
        );

        if (!response.ok) throw new Error("Failed to get AI response");

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = decoder.decode(value);
            const lines = text.split("\n");

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6);

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  fullContent += parsed.content;
                  dispatch(appendStreamContent(parsed.content));
                }
              } catch {
                // skip non-JSON lines
              }
            }
          }
        }

        if (fullContent) {
          dispatch(
            addMessage({
              message_id: Date.now().toString(),
              message_type: "ai",
              content: fullContent,
              timestamp: new Date().toISOString(),
            })
          );
        }
      } catch (error) {
        console.error("Streaming error:", error);
        dispatch(
          addMessage({
            message_id: Date.now().toString(),
            message_type: "ai",
            content: "Sorry, I encountered an error. Please try again.",
            timestamp: new Date().toISOString(),
          })
        );
      } finally {
        dispatch(setStreaming(false));
      }
    },
    [dispatch, getToken]
  );

  const handleSend = async (message: string) => {
    if (streaming) return;

    const result = await dispatch(sendMessage({ threadId, message }));

    if (sendMessage.fulfilled.match(result)) {
      const messageId =
        result.payload?.message?.message_id || Date.now().toString();
      triggerAIResponse(messageId, threadId);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Top Nav */}
      <header className="h-14 bg-[#fdfbf8] flex items-center px-4 md:px-5 shrink-0" style={{ boxShadow: "0px 1px 4px rgba(0,0,0,0.03)" }}>
        <button onClick={open} className="md:hidden p-1.5 text-foreground mr-2">
          <Menu className="w-5 h-5" strokeWidth={2.5} />
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary hidden md:block" />
          <h1 className="text-sm font-semibold truncate max-w-[200px] md:max-w-md">
            {threadTitle}
          </h1>
        </div>
      </header>

      {/* Messages - only this scrolls */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {messages.length === 0 && !streaming ? (
          <div className="flex-1" />
        ) : (
          <div className="max-w-3xl mx-auto py-4">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.message_id}
                type={msg.message_type}
                content={msg.content}
              />
            ))}
            {streaming && streamingContent && (
              <ChatMessage
                type="ai"
                content={streamingContent}
                isStreaming
              />
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input - fixed at bottom */}
      <ChatInput
        onSend={handleSend}
        disabled={streaming || loading}
      />
    </div>
  );
}
