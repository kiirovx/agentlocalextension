import { useEffect } from "react";

import Header from "../components/Header/Header";
import Chat from "../components/Chat/Chat";
import Input from "../components/Composer/Input";
import "./App.css";
import { useChat } from "../hooks/useChat";

export default function App() {
  const { messages, loading, send, receive, startAssistant, finishAssistant } =
    useChat();

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      switch (event.data.type) {
        case "chat-start":
          startAssistant();
          break;

        case "chat-stream":
          receive(event.data.token);
          break;

        case "chat-end":
          finishAssistant();
          break;
      }
    };

    window.addEventListener("message", listener);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, [receive, startAssistant, finishAssistant]);
}
