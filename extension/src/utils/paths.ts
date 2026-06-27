import * as vscode from "vscode";

export function validatePath(path: string): vscode.Uri {
  const workspace = vscode.workspace.workspaceFolders?.[0];

  if (!workspace) {
    throw new Error("No workspace folder is open");
  }

  if (!path || path.trim().length === 0) {
    throw new Error("Path must not be empty");
  }

  // Prevent absolute paths and path traversal
  if (path.startsWith("/") || path.match(/^[A-Z]:\\/i)) {
    throw new Error("Absolute paths are not allowed. Use relative paths.");
  }

  if (path.includes("..")) {
    throw new Error("Path traversal (..) is not allowed.");
  }

  return vscode.Uri.joinPath(workspace.uri, path);
}

export function isDangerousCommand(command: string): boolean {
  const dangerous = [
    /rm\s+-rf\s+\//,
    /rm\s+-rf\s+~\//,
    /del\s+\/f\s+\/s/,
    /format\s/,
    />\s*\/dev\/sd/,
    /dd\s+if=/,
    /mkfs/,
    /:\(\)\s*\{\s*:/, // fork bomb
    /chmod\s+-R\s+777\s+\//,
  ];

  return dangerous.some((pattern) => pattern.test(command));
}
