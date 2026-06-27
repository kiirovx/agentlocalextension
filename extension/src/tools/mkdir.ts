import * as vscode from "vscode";

export async function mkdir(path: string): Promise<string> {
  const workspace = vscode.workspace.workspaceFolders?.[0];

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const uri = vscode.Uri.joinPath(workspace.uri, path);
  await vscode.workspace.fs.createDirectory(uri);
  return `Directory created: ${path}`;
}
