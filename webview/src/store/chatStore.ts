import { create } from "zustand";
import type { ChatMessage, AgentEvent } from "../types/message";

interface ChatStore {
  messages: ChatMessage[];
  loading: boolean;
  thinking: string | null;
  toolEvents: AgentEvent[];

  addUserMessage(content: string): void;
  startAssistantMessage(): void;
  appendAssistantToken(token: string): void;
  finishAssistantMessage(): void;
  setLoading(loading: boolean): void;
  clearMessages(): void;
  handleAgentEvent(event: AgentEvent): void;
  addToolMessage(content: string, toolName: string, success?: boolean): void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  loading: false,
  thinking: null,
  toolEvents: [],

  addUserMessage: (content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Date.now(),
          role: "user",
          content,
          timestamp: Date.now(),
        },
      ],
    })),

  startAssistantMessage: () =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "",
          timestamp: Date.now(),
        },
      ],
    })),

  appendAssistantToken: (token) =>
    set((state) => {
      const messages = [...state.messages];
      const last = messages[messages.length - 1];
      if (last && last.role === "assistant") {
        messages[messages.length - 1] = { ...last, content: last.content + token };
      }
      return { messages, thinking: null };
    }),

  finishAssistantMessage: () => set({ loading: false, thinking: null }),

  setLoading: (loading) => set({ loading }),

  clearMessages: () => set({ messages: [], toolEvents: [], thinking: null }),

  handleAgentEvent: (event) =>
    set((state) => {
      switch (event.type) {
        case "thinking":
          return { thinking: event.message ?? null };
        case "tool-start":
          return {
            messages: [
              ...state.messages,
              {
                id: Date.now(),
                role: "tool",
                content: `🔧 ${event.tool}: ${event.input || ""}`,
                toolName: event.tool,
                timestamp: Date.now(),
              },
            ],
          };
        case "tool-end":
          return {
            messages: [
              ...state.messages,
              {
                id: Date.now(),
                role: "tool",
                content: event.output || "",
                toolName: event.tool,
                toolSuccess: event.success,
                timestamp: Date.now(),
              },
            ],
          };
        case "error":
          return {
            messages: [
              ...state.messages,
              {
                id: Date.now(),
                role: "assistant",
                content: `❌ ${event.message || "Error"}`,
                timestamp: Date.now(),
              },
            ],
          };
        default:
          return {};
      }
    }),

  addToolMessage: (content, toolName, success) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Date.now(),
          role: "tool",
          content,
          toolName,
          toolSuccess: success,
          timestamp: Date.now(),
        },
      ],
    })),
}));
