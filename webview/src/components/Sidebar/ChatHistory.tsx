import { useEffect, useState } from "react";
import vscode from "../../services/vscode";
import "./ChatHistory.css";

interface ChatHistoryItem {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

interface Props {
  onClearChat: () => void;
}

export default function ChatHistory({ onClearChat }: Props) {
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    vscode.postMessage({ type: "history:list" });

    const handler = (event: MessageEvent) => {
      const msg = event.data;
      if (msg.type === "history:list-response") {
        setHistory(msg.history || []);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const handleNewChat = () => {
    vscode.postMessage({ type: "history:new" });
    onClearChat();
  };

  const handleLoadChat = (id: string) => {
    vscode.postMessage({ type: "history:load", id });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Hapus chat ini?")) {
      vscode.postMessage({ type: "history:delete", id });
    }
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Hari ini";
    if (days === 1) return "Kemarin";
    if (days < 7) return `${days} hari lalu`;
    return d.toLocaleDateString("id-ID");
  };

  return (
    <div className="chat-history">
      <button className="new-chat-btn" onClick={handleNewChat}>
        ✨ Chat Baru
      </button>

      <button
        className="toggle-history-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        📚 Riwayat ({history.length}) {isOpen ? "▼" : "▶"}
      </button>

      {isOpen && (
        <div className="history-list">
          {history.length === 0 ? (
            <div className="empty-history">Belum ada riwayat</div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="history-item"
                onClick={() => handleLoadChat(item.id)}
              >
                <div className="history-title">{item.title}</div>
                <div className="history-meta">
                  <span className="history-date">
                    {formatDate(item.updatedAt)}
                  </span>
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDelete(e, item.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}