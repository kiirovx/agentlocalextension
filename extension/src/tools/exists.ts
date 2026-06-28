import * as vscode from "vscode";

export async function exists(filePath: string): Promise<string> {
  console.log(`🔍 exists called with: "${filePath}" (type: ${typeof filePath})`);

  // Validasi parameter
  if (!filePath || typeof filePath !== "string") {
    throw new Error(
      `Parameter 'path' diperlukan dan harus berupa string. Received: ${JSON.stringify(filePath)} (type: ${typeof filePath})`
    );
  }

  const workspace = vscode.workspace.workspaceFolders?.[0];

  if (!workspace) {
    throw new Error("Workspace not found. Buka folder dulu!");
  }

  const uri = vscode.Uri.joinPath(workspace.uri, filePath);

  try {
    await vscode.workspace.fs.stat(uri);
    return `✅ File exists: ${filePath}`;
  } catch {
    return `❌ File tidak ada: ${filePath}`;
  }
}