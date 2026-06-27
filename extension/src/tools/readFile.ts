import * as vscode from "vscode";

export async function readFile(path: string): Promise<string> {
  const workspace = vscode.workspace.workspaceFolders?.[0];

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const uri = vscode.Uri.joinPath(workspace.uri, path);

  const data = await vscode.workspace.fs.readFile(uri);

  return Buffer.from(data).toString("utf8");
}