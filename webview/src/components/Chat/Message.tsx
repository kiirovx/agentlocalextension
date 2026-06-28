import type { ChatMessage } from "../../types/message";
import Markdown from "../Markdown/Markdown";
import Avatar from "../Avatar/Avatar";

interface Props {
  message: ChatMessage;
}

export default function Message({ message }: Props) {
  // Skip tool messages (sudah di-handle oleh ToolCard)
  if (message.role === "tool") {
    return null;
  }

  return (
    <div className={`message ${message.role}`}>
      <Avatar role={message.role} />
      <div className={`bubble ${message.role}-bubble`}>
        <Markdown content={message.content} />
      </div>
    </div>
  );
}