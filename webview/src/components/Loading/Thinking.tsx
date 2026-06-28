import "./Thinking.css";

interface Props {
  message?: string | null;
}

export default function Thinking({ message }: Props) {
  return (
    <div className="thinking-container">
      <div className="thinking-bubble">
        <div className="thinking-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        {message && <div className="thinking-text">{message}</div>}
      </div>
    </div>
  );
}