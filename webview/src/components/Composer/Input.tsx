import { useState } from "react";

interface Props {
  onSend(text: string): void;
  loading: boolean;
}

export default function Input({
  onSend,
  loading,
}: Props) {
  const [text, setText] = useState("");

  function send() {
    if (!text.trim() || loading) return;

    onSend(text);

    setText("");
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      send();
    }
  }

  return (
    <div className="input">
      <textarea
        value={text}
        disabled={loading}
        placeholder={
          loading
            ? "Qwen is thinking..."
            : "Ask Qwen..."
        }
        onKeyDown={handleKeyDown}
        onChange={(e) =>
          setText(e.target.value)
        }
      />

      <button
        disabled={loading}
        onClick={send}
      >
        {loading ? "..." : "➤"}
      </button>
    </div>
  );
}