import * as vscode from "vscode";

import { runAgent } from "../agent/loop";
import { getReactHtml } from "../ui/reactLoader";

export class ChatProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "qwenforge.chat";

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    const dist = vscode.Uri.joinPath(
      this.context.extensionUri,
      "..",
      "webview",
      "dist",
    );

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [dist],
    };

    webviewView.webview.html = getReactHtml(
      webviewView.webview,
      this.context.extensionUri,
    );

    webviewView.webview.onDidReceiveMessage(async (message) => {
      if (message.type !== "chat") {
        return;
      }

      try {
        console.log("🚀 AGENT START");
        webviewView.webview.postMessage({ type: "chat-start" });

        const reply = await runAgent(message.message, (event) => {
          webviewView.webview.postMessage({
            type: "agent-event",
            event,
          });
        });

        webviewView.webview.postMessage({
          type: "chat-response",
          message: reply,
        });
        webviewView.webview.postMessage({ type: "chat-end" });
        console.log("✅ AGENT DONE");
      } catch (err) {
        console.error(err);

        webviewView.webview.postMessage({
          type: "chat-response",
          message: "❌ Agent Error: " + String(err),
        });
        webviewView.webview.postMessage({ type: "chat-end" });
      }
    });
  }
}
