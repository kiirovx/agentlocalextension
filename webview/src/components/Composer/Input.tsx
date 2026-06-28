import { useState } from "react";
import "./Composer.css";

interface Props {
  onSend: (content: string) => void;
}

export default function Composer({ onSend }: Props) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="composer">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ketik pesan... (Enter untuk kirim)"
        rows={2}
      />
      <button onClick={handleSend}>➤</button>
    </div>
  );
}