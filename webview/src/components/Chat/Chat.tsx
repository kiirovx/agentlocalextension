import { useEffect, useRef } from "react";
import Message from "./Message";
import type { ChatMessage } from "../../types/message";

interface Props {
  messages: ChatMessage[];
  loading: boolean;
}

export default function Chat({ messages, loading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <div className="chat">
      {messages.map((msg) => (
        <Message
          key={msg.id}
          message={msg}
        />
      ))}

      {loading && (
        <Message
          message={{
            id: -1,
            role: "assistant",
            content: "Thinking..."
          }}
        />
      )}

      <div ref={bottomRef} />
    </div>
  );
}