import { useState } from "react";
import CopyButton from "./CopyButton";

interface Props {
  language: string;
  code: string;
}

export default function CodeBlock({ language, code }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  if (code.length > 2000) {
    return (
      <div className="code-block">
        <div className="code-header">
          <span>{language}</span>
          <div className="code-actions">
            <CopyButton text={code} />
            <button
              className="code-toggle"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? "Expand" : "Collapse"}
            </button>
          </div>
        </div>
        {collapsed ? (
          <div className="code-collapsed">
            Large output ({code.length} chars) — click Expand to view
          </div>
        ) : (
          <pre className="code-pre">
            <code className={`language-${language}`}>{code}</code>
          </pre>
        )}
      </div>
    );
  }

  return (
    <div className="code-block">
      <div className="code-header">
        <span>{language}</span>
        <CopyButton text={code} />
      </div>
      <pre className="code-pre">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
