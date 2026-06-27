import * as vscode from "vscode";

export async function searchFiles(keyword: string): Promise<string[]> {
  const files = await vscode.workspace.findFiles("**/*");

  return files
    .map((file) => vscode.workspace.asRelativePath(file))
    .filter((file) =>
      file.toLowerCase().includes(keyword.toLowerCase())
    );
}