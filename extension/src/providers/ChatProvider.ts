import * as vscode from "vscode";
import { runAgent } from "../agent/loop";
import { getReactHtml } from "../ui/reactLoader";
import { ChatHistoryService, ChatHistoryItem } from "../services/chatHistory";

export class ChatProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "qwenforge.chat";
  private historyService: ChatHistoryService;
  private currentChatId: string | null = null;

  constructor(private readonly context: vscode.ExtensionContext) {
    this.historyService = new ChatHistoryService(context);
  }

  resolveWebviewView(webviewView: vscode.WebviewView) {
    const dist = vscode.Uri.joinPath(this.context.extensionUri, "..", "webview", "dist");

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [dist],
    };

    webviewView.webview.html = getReactHtml(webviewView.webview, this.context.extensionUri);

    // Kirim history list saat webview siap
    webviewView.webview.onDidReceiveMessage(async (message) => {
      try {
        switch (message.type) {
          // ===== HISTORY MANAGEMENT =====
          case "history:list":
            const allHistory = await this.historyService.getAll();
            webviewView.webview.postMessage({
              type: "history:list-response",
              history: allHistory,
            });
            break;

          case "history:load":
            const chat = await this.historyService.get(message.id);
            if (chat) {
              this.currentChatId = chat.id;
              webviewView.webview.postMessage({
                type: "history:loaded",
                chat,
              });
            }
            break;

          case "history:new":
            this.currentChatId = null;
            webviewView.webview.postMessage({ type: "history:cleared" });
            break;

          case "history:delete":
            await this.historyService.delete(message.id);
            if (this.currentChatId === message.id) {
              this.currentChatId = null;
            }
            const afterDelete = await this.historyService.getAll();
            webviewView.webview.postMessage({
              type: "history:list-response",
              history: afterDelete,
            });
            break;

          case "history:clear-all":
            await this.historyService.clearAll();
            this.currentChatId = null;
            webviewView.webview.postMessage({ type: "history:cleared" });
            webviewView.webview.postMessage({
              type: "history:list-response",
              history: [],
            });
            break;

          // ===== CHAT MESSAGE =====
          case "chat":
            await this.handleChat(webviewView, message.message);
            break;
        }
      } catch (err) {
        console.error("❌ ChatProvider error:", err);
        webviewView.webview.postMessage({
          type: "chat-response",
          message: "❌ Error: " + String(err),
        });
        webviewView.webview.postMessage({ type: "chat-end" });
      }
    });
  }

  private async handleChat(webviewView: vscode.WebviewView, userMessage: string) {
    console.log("🚀 AGENT START");

    // Buat chat ID baru jika belum ada
    if (!this.currentChatId) {
      this.currentChatId = `chat-${Date.now()}`;
    }

    // Load existing chat atau buat baru
    let chatItem = await this.historyService.get(this.currentChatId);
    if (!chatItem) {
      chatItem = {
        id: this.currentChatId,
        title: this.historyService.generateTitle(userMessage),
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    }

    // Tambah user message
    chatItem.messages.push({
      id: Date.now(),
      role: "user",
      content: userMessage,
      timestamp: Date.now(),
    });
    chatItem.updatedAt = Date.now();

    webviewView.webview.postMessage({ type: "chat-start" });

    try {
      const reply = await runAgent(userMessage, (event) => {
        webviewView.webview.postMessage({
          type: "agent-event",
          event,
        });
      });

      // Tambah assistant message
      chatItem.messages.push({
        id: Date.now() + 1,
        role: "assistant",
        content: reply,
        timestamp: Date.now(),
      });
      chatItem.updatedAt = Date.now();

      // Simpan ke history
      await this.historyService.save(chatItem);

      webviewView.webview.postMessage({
        type: "chat-response",
        message: reply,
      });

      // Update title di sidebar
      const allHistory = await this.historyService.getAll();
      webviewView.webview.postMessage({
        type: "history:list-response",
        history: allHistory,
      });

      console.log("✅ AGENT DONE");
    } catch (err) {
      console.error(err);
      webviewView.webview.postMessage({
        type: "chat-response",
        message: "❌ Agent Error: " + String(err),
      });
    }

    webviewView.webview.postMessage({ type: "chat-end" });
  }
}