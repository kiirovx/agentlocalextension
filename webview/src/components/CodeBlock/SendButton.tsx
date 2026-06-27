interface Props {
  text: string;
  onClick: (text: string) => void;
}

export default function SendButton({ text, onClick }: Props) {
  return (
    <button
      className="send-btn"
      onClick={() => onClick(text)}
      title="Send to input"
    >
      ↩
    </button>
  );
}
