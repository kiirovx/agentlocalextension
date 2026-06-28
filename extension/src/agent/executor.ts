import { tools } from "../tools";
import { ToolResult } from "./types";

// Callback type untuk emit events
type EventCallback = (event: any) => void;

export async function executeTool(
  tool: string,
  params: Record<string, string>,
  onEvent?: EventCallback
): Promise<ToolResult> {
  const fn = (tools as Record<string, (...args: any[]) => Promise<any>>)[tool];

  if (!fn) {
    const result = {
      success: false,
      output: `Unknown tool ${tool}`,
    };
    
    // Emit error event
    onEvent?.({
      type: "tool-end",
      tool,
      output: result.output,
      success: false,
    });
    
    return result;
  }

  try {
    // Emit tool-start event
    onEvent?.({
      type: "tool-start",
      tool,
      input: JSON.stringify(params),
    });

    const args = Object.values(params);
    const result = await fn(...args);

    const toolResult: ToolResult = {
      success: true,
      output: typeof result === "string" ? result : JSON.stringify(result, null, 2),
    };

    // Emit tool-end event
    onEvent?.({
      type: "tool-end",
      tool,
      output: toolResult.output,
      success: true,
    });

    return toolResult;
  } catch (e) {
    const errorResult = {
      success: false,
      output: String(e),
    };

    // Emit error event
    onEvent?.({
      type: "tool-end",
      tool,
      output: errorResult.output,
      success: false,
    });

    return errorResult;
  }
}