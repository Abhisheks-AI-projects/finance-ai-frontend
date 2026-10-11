"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { Menu, Loader2, Sparkles, RotateCcw } from "lucide-react";
import { useMobileNav } from "@/components/layout/mobile-nav-context";
import { useAuth } from "@clerk/nextjs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAuthReady } from "@/components/auth-sync";
import {
  fetchThreadData,
  setStreaming,
  appendStreamContent,
  addMessage,
  setTitleLoading,
  updateThreadTitle,
} from "@/store/slices/threadSlice";
import { fetchDashboard, fetchTransactions } from "@/store/slices/transactionSlice";
import DotsLoader from "@/components/chat/dots-loader";
import AiIcon from "@/components/chat/animated-ai-icon";
import ChatMessage from "@/components/chat/chat-message";
import ChatInput from "@/components/chat/chat-input";

export default function ThreadPage() {
  const params = useParams();
  const threadId = params.threadId as string;
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
  const authReady = useAuthReady();
  const { currentThreadId, threads, messages, streaming, streamingContent, loading, titleLoading } =
    useAppSelector((state) => state.thread);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [showRetry, setShowRetry] = useState(false);
  const { open } = useMobileNav();

  const currentThread = threads.find((t) => t.thread_id === threadId);
  const threadTitle = currentThread?.title || "New Chat";

  const lastMessage = messages[messages.length - 1];
  const canRetry =
    showRetry &&
    !streaming &&
    lastMessage?.message_type === "user";

  // Load thread data when auth is ready (skip if already loaded from /chat page)
  useEffect(() => {
    if (authReady && threadId && currentThreadId !== threadId) {
      dispatch(fetchThreadData(threadId));
    }
  }, [threadId, authReady, dispatch, currentThreadId]);

  useEffect(() => {
    if (streaming && !streamingContent) {
      // when streaming starts (analysing state), scroll to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [streaming, streamingContent]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // clear retry when streaming starts or component unmounts
  useEffect(() => {
    if (streaming) setShowRetry(false);
    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, [streaming]);

  // show retry if last message is user message and older than 5 seconds
  useEffect(() => {
    if (streaming || !lastMessage || lastMessage.message_type !== "user") {
      setShowRetry(false);
      return;
    }
    const elapsed = Date.now() - new Date(lastMessage.timestamp).getTime();
    if (elapsed >= 5000) {
      setShowRetry(true);
    } else {
      const timer = setTimeout(() => setShowRetry(true), 5000 - elapsed);
      return () => clearTimeout(timer);
    }
  }, [messages, streaming, lastMessage]);

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
        // refresh dashboard & transactions after AI response (may have changed data)
        dispatch(fetchDashboard());
        dispatch(fetchTransactions());
      }
    },
    [dispatch, getToken]
  );

  const startRetryTimer = useCallback(() => {
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    retryTimerRef.current = setTimeout(() => {
      setShowRetry(true);
    }, 5000);
  }, []);

  const handleRetry = useCallback(() => {
    if (!lastMessage || lastMessage.message_type !== "user") return;
    setShowRetry(false);
    triggerAIResponse(lastMessage.message_id, threadId);
  }, [lastMessage, threadId, triggerAIResponse]);

  const handleSend = async (message: string) => {
    if (streaming) return;

    try {
      const token = await getToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // Check if this is the first message (no messages yet)
      const isFirstMessage = messages.length === 0;
      if (isFirstMessage) dispatch(setTitleLoading(true));

      const response = await fetch(`${apiUrl}/thread/send-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          thread_id: threadId,
          message,
          message_type: "user",
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let messageId = "";

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

              if (parsed.event_type === "message_added") {
                dispatch(addMessage(parsed.message));
                messageId = parsed.message.message_id;
              }

              if (parsed.event_type === "thread_title_generated") {
                dispatch(updateThreadTitle({ threadId, title: parsed.title }));
              }
            } catch {
              // skip non-JSON lines
            }
          }
        }
      }

      if (messageId) {
        triggerAIResponse(messageId, threadId);
        startRetryTimer();
      }
    } catch (error) {
      console.error("Send message error:", error);
      dispatch(setTitleLoading(false));
      startRetryTimer();
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
            {titleLoading ? <DotsLoader /> : threadTitle}
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
            {streaming && !streamingContent && (
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <AiIcon size={18} animated />
                </div>
                <span className="text-sm text-muted flex items-center gap-2">
                  Analysing <DotsLoader />
                </span>
              </div>
            )}
            {streaming && streamingContent && (
              <ChatMessage
                type="ai"
                content={streamingContent}
                isStreaming
              />
            )}
            {canRetry && (
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted">
                <span>Something went wrong.</span>
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-1 text-primary hover:underline font-medium cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Retry
                </button>
              </div>
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
