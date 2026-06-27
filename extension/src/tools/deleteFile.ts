import * as vscode from "vscode";

export async function deleteFile(path: string): Promise<string> {
  const workspace = vscode.workspace.workspaceFolders?.[0];

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const uri = vscode.Uri.joinPath(workspace.uri, path);
  await vscode.workspace.fs.delete(uri);
  return `File deleted: ${path}`;
}
