import * as vscode from "vscode";
import * as cp from "child_process";

export interface TerminalResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export async function runTerminalCommand(
  command: string,
  options?: {
    cwd?: string;
    timeout?: number;
  }
): Promise<TerminalResult> {
  const workspace = vscode.workspace.workspaceFolders?.[0];

  const cwd = options?.cwd ?? workspace?.uri.fsPath ?? process.cwd();
  const timeout = options?.timeout ?? 30000;

  return new Promise((resolve) => {
    const child = cp.exec(
      command,
      {
        cwd,
        timeout,
        maxBuffer: 1024 * 1024 * 10,
        shell: process.platform === "win32" ? "powershell.exe" : "/bin/bash",
      },
      (error, stdout, stderr) => {
        resolve({
          stdout: stdout.trim() || "(empty)",
          stderr: stderr.trim() || "(empty)",
          exitCode: error ? (error as any).code ?? 1 : 0,
        });
      }
    );
  });
}
