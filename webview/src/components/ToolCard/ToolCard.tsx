import { useState } from "react";
import "./ToolCard.css";

export interface ToolStep {
  id: string;
  tool: string;
  status: "running" | "done" | "error";
  input?: string;
  output?: string;
  timestamp: number;
}

interface Props {
  step: ToolStep;
}

export default function ToolCard({ step }: Props) {
  const [expanded, setExpanded] = useState(false);

  const getToolIcon = (tool: string) => {
    const icons: Record<string, string> = {
      read_file: "📖",
      write_file: "✏️",
      create_file: "📄",
      delete_file: "🗑️",
      list_files: "📂",
      search_files: "🔍",
      grep: "🔎",
      terminal: "⚡",
      execute_command: "⚡",
      mkdir: "📁",
      move_file: "📦",
      rename_file: "🏷️",
    };
    return icons[tool] || "🔧";
  };

  const getToolLabel = (tool: string) => {
    return tool.replace(/_/g, " ").toUpperCase();
  };

  const getStatusIcon = () => {
    switch (step.status) {
      case "running":
        return <span className="spinner" />;
      case "done":
        return "✅";
      case "error":
        return "❌";
    }
  };

  const formatOutput = (output: string) => {
    if (output.length > 2000) {
      return output.substring(0, 2000) + "\n\n... (truncated)";
    }
    return output;
  };

  return (
    <div className={`tool-card tool-${step.status}`}>
      <div className="tool-header" onClick={() => setExpanded(!expanded)}>
        <span className="tool-icon">{getToolIcon(step.tool)}</span>
        <span className="tool-label">{getToolLabel(step.tool)}</span>
        <span className="tool-status">{getStatusIcon()}</span>
        {step.output && (
          <span className="expand-icon">{expanded ? "▼" : "▶"}</span>
        )}
      </div>

      {step.input && (
        <div className="tool-input">
          <code>{step.input}</code>
        </div>
      )}

      {expanded && step.output && (
        <div className="tool-output">
          <pre>{formatOutput(step.output)}</pre>
        </div>
      )}
    </div>
  );
}