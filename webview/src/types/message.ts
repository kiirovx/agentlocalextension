export interface ChatMessage {
  id: number;
  role: "user" | "assistant" | "tool";
  content: string;
  toolName?: string;
  toolSuccess?: boolean;
  timestamp?: number;
}

export interface AgentEvent {
  type: "thinking" | "tool-start" | "tool-end" | "stream" | "response" | "error";
  message?: string;
  tool?: string;
  input?: string;
  output?: string;
  success?: boolean;
  token?: string;
  text?: string;
}