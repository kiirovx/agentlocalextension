import { useEffect, useRef } from "react";
import Message from "./Message";
import ToolCard from "../ToolCard/ToolCard";
import Thinking from "../Loading/Thinking";
import type { ChatMessage } from "../../types/message";
import { useChatStore } from "../../store/chatStore";

interface Props {
  messages: ChatMessage[];
  loading: boolean;
}

export default function Chat({ messages, loading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const toolSteps = useChatStore((state) => state.toolSteps);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, toolSteps, loading]);

  return (
    <div className="chat">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
      
      {toolSteps.map((step) => (
        <ToolCard key={step.id} step={step} />
      ))}
      
      {loading && <Thinking />}
      <div ref={bottomRef} />
    </div>
  );
}