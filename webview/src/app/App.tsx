import { useEffect } from "react";
import Header from "../components/Header/Header";
import Chat from "../components/Chat/Chat";
import Composer from "../components/Composer/Input";
import ChatHistory from "../components/Sidebar/ChatHistory";
import { useChat } from "../hooks/useChat";
import "./App.css";

export default function App() {
  const {
    messages,
    loading,
    thinking,
    streamingText,
    send,
    clearMessages,
    loadMessages,
    handleAgentEvent,
    finishAssistantMessage,
  } = useChat();

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const msg = event.data;

      if (msg.type === "agent-event") {
        handleAgentEvent(msg.event);
        
        // Finish assistant message saat chat-end
        if (msg.event.type === "response" || msg.event.type === "error") {
          finishAssistantMessage();
        }
      }

      if (msg.type === "chat-end") {
        finishAssistantMessage();
      }

      if (msg.type === "history:loaded") {
        loadMessages(msg.chat.messages);
      }

      if (msg.type === "history:cleared") {
        clearMessages();
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [clearMessages, loadMessages, handleAgentEvent, finishAssistantMessage]);

  return (
    <div className="app">
      <Header />
      <ChatHistory onClearChat={clearMessages} />
      <Chat 
        messages={messages} 
        loading={loading}
        thinking={thinking}
        streamingText={streamingText}
      />
      <Composer onSend={send} />
    </div>
  );
}