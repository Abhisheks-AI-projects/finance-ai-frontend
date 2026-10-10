import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";
import type { Message } from "@/lib/types";

interface ThreadListItem {
  thread_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

interface ThreadState {
  threads: ThreadListItem[];
  currentThreadId: string | null;
  messages: Message[];
  loading: boolean;
  threadsLoading: boolean;
  streaming: boolean;
  streamingContent: string;
  titleLoading: boolean;
  error: string | null;
}

const initialState: ThreadState = {
  threads: [],
  currentThreadId: null,
  messages: [],
  loading: false,
  threadsLoading: false,
  streaming: false,
  streamingContent: "",
  titleLoading: false,
  error: null,
};

export const fetchThreads = createAsyncThunk(
  "thread/fetchThreads",
  async () => {
    const response = await api.get("/thread/list-threads");
    return response.data.threads;
  }
);

export const fetchThreadData = createAsyncThunk(
  "thread/fetchThreadData",
  async (threadId: string) => {
    const response = await api.get(`/thread/get-thread-data/${threadId}`);
    return response.data;
  }
);

export const createThread = createAsyncThunk(
  "thread/createThread",
  async () => {
    const response = await api.post("/thread/create-thread");
    return response.data;
  }
);

export const sendMessage = createAsyncThunk(
  "thread/sendMessage",
  async ({
    threadId,
    message,
  }: {
    threadId: string;
    message: string;
  }) => {
    const response = await api.post("/thread/send-message", {
      thread_id: threadId,
      message,
      message_type: "user",
    });
    return response.data;
  }
);

const threadSlice = createSlice({
  name: "thread",
  initialState,
  reducers: {
    setCurrentThread: (state, action: PayloadAction<string>) => {
      state.currentThreadId = action.payload;
      state.messages = [];
      state.streamingContent = "";
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setStreaming: (state, action: PayloadAction<boolean>) => {
      state.streaming = action.payload;
      if (!action.payload) {
        state.streamingContent = "";
      }
    },
    appendStreamContent: (state, action: PayloadAction<string>) => {
      state.streamingContent += action.payload;
    },
    setTitleLoading: (state, action: PayloadAction<boolean>) => {
      state.titleLoading = action.payload;
    },
    updateThreadTitle: (
      state,
      action: PayloadAction<{ threadId: string; title: string }>
    ) => {
      const thread = state.threads.find(
        (t) => t.thread_id === action.payload.threadId
      );
      if (thread) {
        thread.title = action.payload.title;
      }
      state.titleLoading = false;
    },
    clearThread: (state) => {
      state.currentThreadId = null;
      state.messages = [];
      state.streamingContent = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchThreads
      .addCase(fetchThreads.pending, (state) => {
        state.threadsLoading = true;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.threadsLoading = false;
        state.threads = action.payload;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.threadsLoading = false;
        state.error = action.error.message || "Failed to fetch threads";
      })
      // fetchThreadData
      .addCase(fetchThreadData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchThreadData.fulfilled, (state, action) => {
        state.loading = false;
        state.currentThreadId = action.payload.thread_id;
        state.messages = action.payload.messages;
      })
      .addCase(fetchThreadData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch thread data";
      })
      // createThread
      .addCase(createThread.pending, (state) => {
        state.loading = true;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.loading = false;
        state.currentThreadId = action.payload.thread_id;
        state.messages = [];
        state.threads.unshift({
          thread_id: action.payload.thread_id,
          title: null,
          created_at: action.payload.timestamp,
          updated_at: action.payload.timestamp,
        });
      })
      .addCase(createThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create thread";
      })
      // sendMessage
      .addCase(sendMessage.fulfilled, (state, action) => {
        const msg: Message = {
          message_id: action.payload.message?.message_id || Date.now().toString(),
          message_type: "user",
          content: action.meta.arg.message,
          timestamp: new Date().toISOString(),
        };
        state.messages.push(msg);
      });
  },
});

export const {
  setCurrentThread,
  addMessage,
  setStreaming,
  appendStreamContent,
  setTitleLoading,
  updateThreadTitle,
  clearThread,
} = threadSlice.actions;
export default threadSlice.reducer;
