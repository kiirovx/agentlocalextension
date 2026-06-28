import * as vscode from "vscode";

export async function listFiles(pattern: string = "**/*"): Promise<string> {
  console.log(`📂 listFiles called with pattern: "${pattern}"`);

  try {
    const files = await vscode.workspace.findFiles(
      pattern,
      "**/{node_modules,.git,dist,build,out}/**",
      200
    );

    if (files.length === 0) {
      return `Tidak ada file yang cocok dengan pattern: ${pattern}`;
    }

    const relativePaths = files.map((f) => vscode.workspace.asRelativePath(f));
    return `📂 Ditemukan ${files.length} file:\n\n${relativePaths.join("\n")}`;
  } catch (error: any) {
    console.error(`❌ listFiles error:`, error);
    throw new Error(`Gagal mencari file: ${error.message}`);
  }
}