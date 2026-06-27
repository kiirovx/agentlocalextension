import * as vscode from "vscode";

export async function renameFile(oldPath: string, newPath: string): Promise<string> {
  const workspace = vscode.workspace.workspaceFolders?.[0];

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const oldUri = vscode.Uri.joinPath(workspace.uri, oldPath);
  const newUri = vscode.Uri.joinPath(workspace.uri, newPath);

  await vscode.workspace.fs.rename(oldUri, newUri);
  return `Renamed: ${oldPath} → ${newPath}`;
}
