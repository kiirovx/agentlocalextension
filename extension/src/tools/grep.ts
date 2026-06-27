import * as vscode from "vscode";

export async function grep(pattern: string): Promise<string> {
  const workspace = vscode.workspace.workspaceFolders?.[0];

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const files = await vscode.workspace.findFiles(
    "**/*",
    "**/{node_modules,.git,dist,build,out,.next,.turbo}/**"
  );

  const results: string[] = [];
  const regex = new RegExp(pattern, "gi");

  for (const file of files.slice(0, 200)) {
    const data = await vscode.workspace.fs.readFile(file);
    const content = Buffer.from(data).toString("utf8");
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      if (regex.test(lines[i])) {
        regex.lastIndex = 0;
        const relativePath = vscode.workspace.asRelativePath(file);
        results.push(`${relativePath}:${i + 1}: ${lines[i].trim()}`);
      }
    }
  }

  if (results.length === 0) {
    return `No matches found for: ${pattern}`;
  }

  return results.slice(0, 50).join("\n");
}
