import { tools } from "../tools";
import { ToolResult } from "./types";

export async function executeTool(
  tool: string,
  params: Record<string, string>
): Promise<ToolResult> {
  console.log(`🛠 executeTool: ${tool}`);
  console.log(`📥 Params received:`, JSON.stringify(params, null, 2));

  const fn = (tools as Record<string, Function>)[tool];

  if (!fn) {
    const available = Object.keys(tools).join(", ");
    return {
      success: false,
      output: `❌ Tool "${tool}" tidak dikenal.\n\nTools tersedia: ${available}`,
    };
  }

  try {
    let result: any;

    // 🔥 Helper function untuk mendapatkan parameter path dengan fallback
    const getPath = (): string => {
      const pathValue = params.path || params.filePath || params.file || params.target;
      if (!pathValue) {
        throw new Error(
          `Parameter 'path' diperlukan untuk tool ${tool}. ` +
          `Received params: ${JSON.stringify(params)}. ` +
          `Pastikan format tool call benar: <path>nama_file</path>`
        );
      }
      return pathValue;
    };

    // 🔥 Helper function untuk mendapatkan parameter content
    const getContent = (): string => {
      const contentValue = params.content || params.text || params.data;
      if (contentValue === undefined || contentValue === null) {
        throw new Error(
          `Parameter 'content' diperlukan untuk tool ${tool}. ` +
          `Received params: ${JSON.stringify(params)}`
        );
      }
      return contentValue;
    };

    // Panggil dengan parameter yang benar sesuai tool
    switch (tool) {
      case "read_file":
      case "delete_file":
      case "exists":
      case "mkdir": {
        const path = getPath();
        console.log(`📍 Using path: "${path}"`);
        result = await fn(path);
        break;
      }

      case "write_file":
      case "create_file": {
        const path = getPath();
        const content = getContent();
        console.log(`📍 Writing to: "${path}" (${content.length} chars)`);
        result = await fn(path, content);
        break;
      }

      case "list_files":
        result = await fn(params.pattern || "**/*");
        break;

      case "search_files":
        if (!params.query) {
          throw new Error(`Parameter 'query' diperlukan untuk tool search_files`);
        }
        result = await fn(params.query);
        break;

      case "grep":
        if (!params.pattern) {
          throw new Error(`Parameter 'pattern' diperlukan untuk tool grep`);
        }
        result = await fn(params.pattern, params.path || ".");
        break;

      case "terminal":
        if (!params.command) {
          throw new Error(`Parameter 'command' diperlukan untuk tool terminal`);
        }
        result = await fn(params.command);
        break;

      case "move_file": {
        const from = params.from || params.source || params.oldPath;
        const to = params.to || params.destination || params.newPath;
        if (!from || !to) {
          throw new Error(`Parameter 'from' dan 'to' diperlukan untuk tool move_file`);
        }
        result = await fn(from, to);
        break;
      }

      case "rename_file": {
        const oldPath = params.oldPath || params.from || params.path;
        const newPath = params.newPath || params.to;
        if (!oldPath || !newPath) {
          throw new Error(`Parameter 'oldPath' dan 'newPath' diperlukan untuk tool rename_file`);
        }
        result = await fn(oldPath, newPath);
        break;
      }

      default:
        // Fallback: kirim semua params sebagai args
        console.warn(`⚠️ Using fallback for tool ${tool}`);
        result = await fn(...Object.values(params));
    }

    const output = typeof result === "string" ? result : JSON.stringify(result, null, 2);
    console.log(`✅ Tool success: ${tool}`);

    return {
      success: true,
      output: output.substring(0, 10000), // Batasi output
    };
  } catch (e: any) {
    console.error(`❌ Tool error: ${tool}`, e);
    return {
      success: false,
      output: `❌ Error menjalankan ${tool}: ${e.message}\n\nParams yang diterima: ${JSON.stringify(params, null, 2)}`,
    };
  }
}