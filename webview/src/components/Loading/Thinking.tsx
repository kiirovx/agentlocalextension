import Loading from "./Loading";

interface Props {
  message?: string;
}

export default function Thinking({ message }: Props) {
  return (
    <div className="thinking-indicator">
      <Loading />
      <span className="thinking-text">{message || "Thinking..."}</span>
    </div>
  );
}
