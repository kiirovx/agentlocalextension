import { create } from "zustand";
import type { ChatMessage } from "../types/message";

interface ChatStore {
  messages: ChatMessage[];
  loading: boolean;

  addUserMessage(content: string): void;

  startAssistantMessage(): void;

  appendAssistantToken(token: string): void;

  finishAssistantMessage(): void;

  setLoading(loading: boolean): void;

  clearMessages(): void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  loading: false,

  addUserMessage: (content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Date.now(),
          role: "user",
          content,
        },
      ],
    })),

  startAssistantMessage: () =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Date.now(),
          role: "assistant",
          content: "",
        },
      ],
    })),

  appendAssistantToken: (token) =>
    set((state) => {
      const messages = [...state.messages];

      const last = messages[messages.length - 1];

      if (last && last.role === "assistant") {
        last.content += token;
      }

      return {
        messages,
      };
    }),

  finishAssistantMessage: () => set({}),

  setLoading: (loading) =>
    set({
      loading,
    }),

  clearMessages: () =>
    set({
      messages: [],
    }),
}));