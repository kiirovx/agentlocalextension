import type { ChatMessage } from "../../types/message";
import Markdown from "../Markdown/Markdown";
import Avatar from "../Avatar/Avatar";

interface Props { message: ChatMessage; }

export default function Message({ message }: Props) {
  const isTool = message.role === "tool";
  return (
    <div className={`message ${message.role}`}>
      {!isTool && <Avatar role={message.role} />}
      <div className={`bubble ${message.role}-bubble ${isTool ? "tool-bubble" : ""}`}>
        {isTool ? (
          <div className="tool-message">
            <span className="tool-label">{message.toolSuccess === false ? "❌" : "✅"} {message.toolName}</span>
            <pre className="tool-output">{message.content}</pre>
          </div>
        ) : (<Markdown content={message.content} />)}
      </div>
    </div>
  );
}
