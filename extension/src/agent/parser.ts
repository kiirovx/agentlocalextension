import { AgentStep } from "./types";

export function parseToolCall(text: string): AgentStep | null {
  try {
    const json = JSON.parse(text);

    if (!json.tool) { return null; }

    return {
      type: "tool",
      tool: json.tool,
      input: typeof json.input === "string" ? json.input : JSON.stringify(json.input ?? ""),
      params: json.params ?? (typeof json.input === "object" ? json.input : {}),
    };
  } catch {
    return null;
  }
}