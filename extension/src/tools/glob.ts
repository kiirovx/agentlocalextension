import * as vscode from "vscode";

export async function glob(pattern: string): Promise<string> {
  const workspace = vscode.workspace.workspaceFolders?.[0];

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const files = await vscode.workspace.findFiles(
    pattern,
    "**/{node_modules,.git,dist,build,out,.next,.turbo}/**",
    200
  );

  if (files.length === 0) {
    return `No files matching: ${pattern}`;
  }

  return files
    .map((file) => vscode.workspace.asRelativePath(file))
    .join("\n");
}
