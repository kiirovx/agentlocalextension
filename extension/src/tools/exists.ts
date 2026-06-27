import * as vscode from "vscode";

export async function exists(path: string): Promise<string> {
  const workspace = vscode.workspace.workspaceFolders?.[0];

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const uri = vscode.Uri.joinPath(workspace.uri, path);

  try {
    await vscode.workspace.fs.stat(uri);
    return `true - ${path} exists`;
  } catch {
    return `false - ${path} does not exist`;
  }
}
