import vscode from "./vscode";

export function sendChatMessage(content: string) {
  vscode.postMessage({ type: "chat", message: content });
}

export function onExtensionMessage(handler: (message: any) => void) {
  const listener = (event: MessageEvent) => handler(event.data);
  window.addEventListener("message", listener);
  return () => window.removeEventListener("message", listener);
}
