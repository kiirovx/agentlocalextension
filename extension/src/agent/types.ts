export interface AgentTask {
  goal: string;
  steps: AgentStep[];
}

export interface AgentStep {
  type: "tool" | "answer";
  tool?: string;
  input?: string;
  params?: Record<string, string>;
}

export interface ToolResult {
  success: boolean;
  output: string;
}