import { create } from "zustand";
import type { ChatMessage, AgentEvent } from "../types/message";
import type { ToolStep } from "../components/ToolCard/ToolCard";

interface ChatStore {
  messages: ChatMessage[];
  loading: boolean;
  thinking: string | null;
  toolSteps: ToolStep[];
  streamingText: string;

  addUserMessage(content: string): void;
  startAssistantMessage(): void;
  appendAssistantToken(token: string): void;
  finishAssistantMessage(): void;
  setLoading(loading: boolean): void;
  clearMessages(): void;
  loadMessages(messages: ChatMessage[]): void;
  handleAgentEvent(event: AgentEvent): void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  loading: false,
  thinking: null,
  toolSteps: [],
  streamingText: "",

  addUserMessage: (content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: Date.now(), role: "user", content, timestamp: Date.now() },
      ],
      toolSteps: [],
      streamingText: "",
    })),

  startAssistantMessage: () =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: Date.now() + 1, role: "assistant", content: "", timestamp: Date.now() },
      ],
      streamingText: "",
    })),

  appendAssistantToken: (token) =>
    set((state) => {
      const messages = [...state.messages];
      const last = messages[messages.length - 1];
      if (last && last.role === "assistant") {
        messages[messages.length - 1] = { ...last, content: last.content + token };
      }
      return { 
        messages, 
        thinking: null,
        streamingText: state.streamingText + token,
      };
    }),

  finishAssistantMessage: () => 
    set({ 
      loading: false, 
      thinking: null,
      streamingText: "",
    }),

  setLoading: (loading) => set({ loading }),

  clearMessages: () => 
    set({ 
      messages: [], 
      toolSteps: [], 
      thinking: null,
      streamingText: "",
    }),

  loadMessages: (messages) => 
    set({ 
      messages, 
      toolSteps: [], 
      thinking: null,
      streamingText: "",
    }),

  handleAgentEvent: (event) =>
    set((state) => {
      switch (event.type) {
        case "thinking":
          return { thinking: event.message ?? null };

        case "stream": {
          // 🔥 Wrap dengan curly braces {} untuk fix no-case-declarations
          const messages = [...state.messages];
          const last = messages[messages.length - 1];
          if (last && last.role === "assistant") {
            messages[messages.length - 1] = {
              ...last,
              content: last.content + (event.token || ""),
            };
          }
          return {
            messages,
            thinking: null,
            streamingText: state.streamingText + (event.token || ""),
          };
        }

        case "tool-start":
          return {
            toolSteps: [
              ...state.toolSteps,
              {
                id: `tool-${Date.now()}`,
                tool: event.tool || "unknown",
                status: "running",
                input: event.input,
                timestamp: Date.now(),
              },
            ],
            streamingText: "",
          };

        case "tool-end":
          return {
            toolSteps: state.toolSteps.map((step) =>
              step.tool === event.tool && step.status === "running"
                ? { ...step, status: event.success ? "done" : "error", output: event.output }
                : step
            ),
          };

        case "response":
          return {
            thinking: null,
            streamingText: "",
          };

        case "error":
          return {
            messages: [
              ...state.messages,
              { 
                id: Date.now(), 
                role: "assistant", 
                content: `❌ ${event.message || "Error"}`, 
                timestamp: Date.now() 
              },
            ],
            thinking: null,
            streamingText: "",
          };

        default:
          return {};
      }
    }),
}));