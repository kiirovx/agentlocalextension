import type { ChatMessage } from "../../types/message";

interface Props {
  message: ChatMessage;
}

export default function Message({ message }: Props) {
  return (
    <div className={`message ${message.role}`}>
      <div className="bubble">
        {message.content}
      </div>
    </div>
  );
}