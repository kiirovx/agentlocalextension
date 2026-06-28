import vscode from "../services/vscode";
import { useChatStore } from "../store/chatStore";

export function useChat() {
  const store = useChatStore();

  function send(content: string) {
    if (!content.trim() || store.loading) return;

    store.addUserMessage(content);
    store.startAssistantMessage(); // 🔥 Start assistant message dulu
    store.setLoading(true);

    vscode.postMessage({
      type: "chat",
      message: content,
    });
  }

  return {
    messages: store.messages,
    loading: store.loading,
    thinking: store.thinking,
    streamingText: store.streamingText,
    send,
    clearMessages: store.clearMessages,
    loadMessages: store.loadMessages,
    handleAgentEvent: store.handleAgentEvent,
    finishAssistantMessage: store.finishAssistantMessage,
  };
}