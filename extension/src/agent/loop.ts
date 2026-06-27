import { askOllama, ChatMessage } from "../llm/ollama";
import { buildSystemPrompt } from "./planner";
import { parseToolCall } from "./parser";
import { executeTool } from "./executor";

export type AgentEvent =
  | { type: "thinking"; message: string }
  | { type: "tool-start"; tool: string; input: string }
  | { type: "tool-end"; tool: string; output: string; success: boolean }
  | { type: "response"; text: string }
  | { type: "error"; message: string };

export async function runAgent(
  prompt: string,
  onEvent?: (event: AgentEvent) => void,
): Promise<string> {
  const conversation: ChatMessage[] = [
    {
      role: "system",
      content: buildSystemPrompt(),
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  const MAX_ITERATIONS = 10;

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    onEvent?.({
      type: "thinking",
      message: i === 0 ? "Analyzing request..." : `Step ${i + 1}...`,
    });

    const reply = await askOllama(conversation);

    const toolCall = parseToolCall(reply);

    // Kalau model sudah menjawab normal, selesai.
    if (!toolCall) {
      onEvent?.({ type: "response", text: reply });
      return reply;
    }

    console.log("🛠 Tool:", toolCall.tool);
    console.log("📥 Params:", toolCall.params);

    onEvent?.({
      type: "tool-start",
      tool: toolCall.tool!,
      input: toolCall.input ?? "",
    });

    const result = await executeTool(
      toolCall.tool!,
      toolCall.params ?? {},
    );

    console.log("📤 Result:", result.output);

    onEvent?.({
      type: "tool-end",
      tool: toolCall.tool!,
      output: result.output,
      success: result.success,
    });

    conversation.push({
      role: "assistant",
      content: reply,
    });

    conversation.push({
      role: "user",
      content: `Tool Result:

${result.output}

If another tool is required, call it.

Otherwise answer the user directly.`,
    });
  }

  const msg = "Agent stopped: maximum iterations reached.";
  onEvent?.({ type: "error", message: msg });
  return `❌ ${msg}`;
}