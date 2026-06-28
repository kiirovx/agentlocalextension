import * as vscode from "vscode";

export interface ChatHistoryItem {
  id: string;
  title: string;
  messages: any[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "qwenforge.chatHistory";
const MAX_HISTORY = 50;

export class ChatHistoryService {
  constructor(private context: vscode.ExtensionContext) {}

  async getAll(): Promise<ChatHistoryItem[]> {
    return this.context.globalState.get<ChatHistoryItem[]>(STORAGE_KEY, []);
  }

  async get(id: string): Promise<ChatHistoryItem | undefined> {
    const all = await this.getAll();
    return all.find((h) => h.id === id);
  }

  async save(item: ChatHistoryItem): Promise<void> {
    const all = await this.getAll();
    const existingIndex = all.findIndex((h) => h.id === item.id);

    if (existingIndex >= 0) {
      all[existingIndex] = item;
    } else {
      all.unshift(item);
      if (all.length > MAX_HISTORY) {
        all.pop();
      }
    }

    await this.context.globalState.update(STORAGE_KEY, all);
  }

  async delete(id: string): Promise<void> {
    const all = await this.getAll();
    const filtered = all.filter((h) => h.id !== id);
    await this.context.globalState.update(STORAGE_KEY, filtered);
  }

  async clearAll(): Promise<void> {
    await this.context.globalState.update(STORAGE_KEY, []);
  }

  generateTitle(firstMessage: string): string {
    const clean = firstMessage.replace(/\s+/g, " ").trim();
    return clean.length > 50 ? clean.substring(0, 50) + "..." : clean;
  }
}