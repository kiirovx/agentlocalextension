import { useEffect, useRef } from "react";
import Message from "./Message";
import ToolCard from "../ToolCard/ToolCard";
import Thinking from "../Loading/Thinking";
import type { ChatMessage } from "../../types/message";
import { useChatStore } from "../../store/chatStore";
import "./Chat.css";

interface Props {
  messages: ChatMessage[];
  loading: boolean;
  thinking: string | null;
  streamingText: string;
}

export default function Chat({ messages, loading, thinking, streamingText }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const toolSteps = useChatStore((state) => state.toolSteps);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, toolSteps, streamingText, loading]);

  return (
    <div className="chat">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
      
      {toolSteps.map((step) => (
        <ToolCard key={step.id} step={step} />
      ))}
      
      {loading && thinking && !streamingText && (
        <Thinking message={thinking} />
      )}

      <div ref={bottomRef} />
    </div>
  );
}