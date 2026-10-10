"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createThread,
  setStreaming,
  appendStreamContent,
  addMessage,
  setTitleLoading,
  updateThreadTitle,
} from "@/store/slices/threadSlice";
import ChatInput from "@/components/chat/chat-input";

const suggestions = [
  "I spent ₹500 on groceries today",
  "Add income of ₹3000 salary for October",
  "Show my transactions this month",
];

export default function HomePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { getToken } = useAuth();
  const { streaming } = useAppSelector((state) => state.thread);

  const triggerAIResponse = useCallback(
    async (messageId: string, threadId: string) => {
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
              thread_id: threadId,
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

    // Create thread first
    const threadResult = await dispatch(createThread());
    if (!createThread.fulfilled.match(threadResult)) {
      return;
    }

    const threadId = threadResult.payload.thread_id;

    // Send message via SSE
    dispatch(setTitleLoading(true));
    const token = await getToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

    if (!response.ok) {
      dispatch(setTitleLoading(false));
      return;
    }

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
          try {
            const parsed = JSON.parse(line.slice(6));
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

    // Navigate to the thread
    router.push(`/chat/${threadId}`);

    if (messageId) {
      triggerAIResponse(messageId, threadId);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 flex flex-col items-center justify-center text-center p-4 md:p-6">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
          <TrendingUp className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Finance AI Assistant</h2>
        <p className="text-muted text-sm max-w-md mb-6">
          I can help you track income and expenses. Try saying something like:
        </p>
        <div className="space-y-2 w-full max-w-md">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSend(suggestion)}
              disabled={streaming}
              className="block w-full text-sm text-left bg-white border border-[#E5E5E5] rounded-xl px-4 py-3 hover:border-[#BFBFBF] hover:bg-[#FAFAFA] transition-all disabled:opacity-50"
            >
              &quot;{suggestion}&quot;
            </button>
          ))}
        </div>
      </div>
      <ChatInput onSend={handleSend} disabled={streaming} />
    </div>
  );
}
