import * as vscode from "vscode";

const channel = vscode.window.createOutputChannel("QwenForge", { log: true });

export const logger = {
  info(message: string) { channel.info(message); },
  warn(message: string) { channel.warn(message); },
  error(message: string) { channel.error(message); },
  debug(message: string) { channel.debug(message); },
  show() { channel.show(); },
};
