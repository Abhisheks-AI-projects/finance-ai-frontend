"use client";

import { useEffect } from "react";
import { Plus, MessageSquare, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchThreads, fetchThreadData, createThread } from "@/store/slices/threadSlice";
import { useAuthReady } from "@/components/auth-sync";

export default function ThreadList() {
  const dispatch = useAppDispatch();
  const authReady = useAuthReady();
  const { threads, currentThreadId, threadsLoading } = useAppSelector(
    (state) => state.thread
  );

  useEffect(() => {
    if (authReady) {
      dispatch(fetchThreads());
    }
  }, [dispatch, authReady]);

  const handleSelectThread = (threadId: string) => {
    if (threadId === currentThreadId) return;
    dispatch(fetchThreadData(threadId));
  };

  const handleNewThread = () => {
    dispatch(createThread());
  };

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold">Chats</h2>
        <button
          onClick={handleNewThread}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors text-muted hover:text-foreground"
          title="New chat"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {threadsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-muted animate-spin" />
          </div>
        ) : threads.length === 0 ? (
          <div className="text-center py-8 px-3">
            <MessageSquare className="w-8 h-8 text-muted/40 mx-auto mb-2" />
            <p className="text-xs text-muted">No conversations yet</p>
          </div>
        ) : (
          threads.map((thread) => (
            <button
              key={thread.thread_id}
              onClick={() => handleSelectThread(thread.thread_id)}
              className={clsx(
                "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors truncate",
                currentThreadId === thread.thread_id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted hover:bg-secondary hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">
                  {thread.title || "New Chat"}
                </span>
              </div>
              <p className="text-[11px] text-muted/60 mt-0.5 ml-6">
                {new Date(thread.updated_at).toLocaleDateString()}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
