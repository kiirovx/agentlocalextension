export interface ChatMessage {
    id: number;
    role: "user" | "assistant" | "tool";
    content: string;
    toolName?: string;
    toolSuccess?: boolean;
    timestamp?: number;
}

export interface AgentEvent {
    type: "thinking" | "tool-start" | "tool-end" | "response" | "error";
    message?: string;
    tool?: string;
    input?: string;
    output?: string;
    success?: boolean;
    text?: string;
}
