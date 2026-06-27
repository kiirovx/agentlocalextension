import * as vscode from "vscode";

export async function moveFile(sourcePath: string, destPath: string): Promise<string> {
  const workspace = vscode.workspace.workspaceFolders?.[0];

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const sourceUri = vscode.Uri.joinPath(workspace.uri, sourcePath);
  const destUri = vscode.Uri.joinPath(workspace.uri, destPath);

  // Ensure parent directory exists
  const parentUri = vscode.Uri.joinPath(destUri, "..");
  try {
    await vscode.workspace.fs.stat(parentUri);
  } catch {
    await vscode.workspace.fs.createDirectory(parentUri);
  }

  await vscode.workspace.fs.rename(sourceUri, destUri);
  return `Moved: ${sourcePath} → ${destPath}`;
}
