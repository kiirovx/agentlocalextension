export interface ToolCall {
  tool: string;
  params: Record<string, string>;
  input?: string;
}

export function parseToolCall(reply: string): ToolCall | null {
  if (!reply) {
    console.log("⚠️ Parser: Empty reply");
    return null;
  }

  // Coba format XML: <tool_call>...
  const xmlMatch = reply.match(/<tool_call>([\s\S]*?)<\/tool_call>/i);
  if (xmlMatch) {
    const content = xmlMatch[1];

    const nameMatch = content.match(/<name>([\s\S]*?)<\/name>/i);
    if (!nameMatch) {
      console.log("⚠️ Parser: No <name> tag found");
      return null;
    }

    const toolName = nameMatch[1].trim().toLowerCase().replace(/\s+/g, "_");
    const params: Record<string, string> = {};

    const paramsMatch = content.match(/<params>([\s\S]*?)<\/params>/i);
    if (paramsMatch) {
      const paramsContent = paramsMatch[1];
      const paramRegex = /<(\w+)>([\s\S]*?)<\/\1>/g;
      let match;
      while ((match = paramRegex.exec(paramsContent)) !== null) {
        const paramName = match[1];
        const paramValue = match[2].trim();
        params[paramName] = paramValue;
      }
    }

    const input = Object.entries(params)
      .map(([k, v]) => `${k}: ${v.length > 80 ? v.substring(0, 80) + "..." : v}`)
      .join(", ");

    console.log(`✅ Parsed tool call:`);
    console.log(`   Tool: ${toolName}`);
    console.log(`   Params:`, JSON.stringify(params, null, 2));
    
    return { tool: toolName, params, input };
  }

  // Fallback: coba format JSON
  const jsonMatch = reply.match(/\{[\s\S]*?"tool_call"[\s\S]*?\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.tool_call?.name) {
        const toolName = parsed.tool_call.name.toLowerCase().replace(/\s+/g, "_");
        const params = parsed.tool_call.params || {};
        console.log(`✅ Parsed JSON tool call: ${toolName}`, params);
        return { tool: toolName, params, input: JSON.stringify(params) };
      }
    } catch (e) {
      console.warn("⚠️ Failed to parse JSON tool call");
    }
  }

  console.log("ℹ️ No tool call detected in response");
  return null;
}