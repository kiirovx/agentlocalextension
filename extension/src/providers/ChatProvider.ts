import * as vscode from "vscode";

import { askOllama } from "../llm/ollama";
import { SYSTEM_PROMPT } from "../llm/prompt";
import { getReactHtml } from "../ui/reactLoader";
interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}
export class ChatProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "qwenforge.chat";
  private history: LLMMessage[] = [];
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
      console.log("📥 EXTENSION RECEIVED:", message);
      if (message.type !== "chat") {
        return;
      }

      try {
        console.log("🤖 Calling Ollama...");
        this.history.push({
          role: "user",
          content: message.message,
        });

        const reply = await askOllama([
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          ...this.history,
        ]);

        webviewView.webview.postMessage({
          type: "chat-response",
          message: reply,
        });

        this.history.push({
          role: "assistant",
          content: reply,
        });

        if (this.history.length > 20) {
          this.history = this.history.slice(-20);
        }
      } catch (err) {
        console.error(err);

        webviewView.webview.postMessage({
          type: "chat-response",
          message: "❌ Cannot connect to Ollama.",
        });
      }
    });
  }
}
