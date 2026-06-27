import vscode from "../services/vscode";
import { useChatStore } from "../store/chatStore";

export function useChat() {
  const {
    messages,
    loading,

    addUserMessage,

    startAssistantMessage,

    appendAssistantToken,

    finishAssistantMessage,

    setLoading,
  } = useChatStore();

  function send(content: string) {
    if (!content.trim() || loading) return;

    addUserMessage(content);

    vscode.postMessage({
      type: "chat",
      message: content,
    });
  }

  function startAssistant() {
    startAssistantMessage();

    setLoading(true);
  }

  function receive(token: string) {
    appendAssistantToken(token);
  }

  function finishAssistant() {
    finishAssistantMessage();

    setLoading(false);
  }

  return {
    messages,
    loading,

    send,

    startAssistant,

    receive,

    finishAssistant,
  };
}