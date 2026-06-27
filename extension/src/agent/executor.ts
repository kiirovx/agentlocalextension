import { tools } from "../tools";
import { ToolResult } from "./types";

export async function executeTool(
  tool: string,
  params: Record<string, string>,
): Promise<ToolResult> {
  const fn = (tools as Record<string, (...args: any[]) => Promise<any>>)[tool];

  if (!fn) {
    return {
      success: false,
      output: `Unknown tool ${tool}`,
    };
  }

  try {
    const args = Object.values(params);
    const result = await fn(...args);

    return {
      success: true,
      output:
        typeof result === "string" ? result : JSON.stringify(result, null, 2),
    };
  } catch (e) {
    return {
      success: false,
      output: String(e),
    };
  }
}
