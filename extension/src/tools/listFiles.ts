import * as vscode from "vscode";

export async function listFiles(): Promise<string[]> {
  const files = await vscode.workspace.findFiles(
    "**/*",
    "**/{node_modules,.git,dist,build,out,.next,.turbo}/**"
  );

  return files.map((file) => {
    const relative = vscode.workspace.asRelativePath(file);
    return relative.replace(/\\/g, "/");
  });
}