import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "../CodeBlock/CodeBlock";

interface Props {
  content: string;
}

export default function Markdown({ content }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const code = String(children).replace(/\n$/, "");

          if (match) {
            return <CodeBlock language={match[1]} code={code} />;
          }

          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        pre({ children }) {
          return <>{children}</>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
