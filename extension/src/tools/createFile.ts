import * as vscode from "vscode";

export async function createFile(path: string, content: string = ""): Promise<string> {
  const workspace = vscode.workspace.workspaceFolders?.[0];

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const uri = vscode.Uri.joinPath(workspace.uri, path);

  // Check if already exists
  try {
    await vscode.workspace.fs.stat(uri);
    throw new Error(`File already exists: ${path}`);
  } catch (e: any) {
    if (e.message?.includes("already exists")) { throw e; }
  }

  await vscode.workspace.fs.writeFile(uri, Buffer.from(content, "utf8"));
  return `File created: ${path}`;
}
