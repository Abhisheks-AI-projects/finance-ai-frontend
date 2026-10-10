"use client";

import { User } from "lucide-react";
import AiIcon from "./animated-ai-icon";
import { clsx } from "clsx";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  type: "user" | "ai";
  content: string;
  isStreaming?: boolean;
}

const markdownComponents: Components = {
  table: ({ children }) => (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        margin: "12px 0",
        fontSize: "14px",
        border: "1px solid #E5E5E5",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {children}
    </table>
  ),
  thead: ({ children }) => (
    <thead style={{ background: "#F9F9F9" }}>{children}</thead>
  ),
  th: ({ children }) => (
    <th
      style={{
        padding: "10px 14px",
        border: "1px solid #E5E5E5",
        fontWeight: 600,
        textAlign: "left",
      }}
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td
      style={{
        padding: "10px 14px",
        border: "1px solid #E5E5E5",
      }}
    >
      {children}
    </td>
  ),
  p: ({ children }) => (
    <p style={{ margin: "6px 0" }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul style={{ margin: "6px 0", paddingLeft: "20px", listStyleType: "disc" }}>
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol style={{ margin: "6px 0", paddingLeft: "20px", listStyleType: "decimal" }}>
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li style={{ margin: "3px 0" }}>{children}</li>
  ),
  strong: ({ children }) => (
    <strong style={{ fontWeight: 700 }}>{children}</strong>
  ),
  a: ({ children, href }) => (
    <a href={href} style={{ color: "#3F65A9", textDecoration: "underline" }}>
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code
      style={{
        background: "#F9F9F9",
        padding: "2px 6px",
        borderRadius: "4px",
        fontSize: "13px",
      }}
    >
      {children}
    </code>
  ),
};

export default function ChatMessage({
  type,
  content,
  isStreaming,
}: ChatMessageProps) {
  return (
    <div
      className={clsx(
        "flex gap-3 px-4 py-3",
        type === "user" ? "justify-end" : "justify-start"
      )}
    >
      {type === "ai" && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
          <AiIcon size={18} animated={isStreaming} />
        </div>
      )}

      <div
        className={clsx(
          "rounded-2xl px-4 py-3 text-[15px] leading-[22px] border",
          type === "user"
            ? "max-w-[85%] md:max-w-[70%] bg-user-bubble border-border text-foreground rounded-br-md"
            : "w-full bg-transparent border-0 text-foreground !p-0"
        )}
      >
        {type === "ai" ? (
          <>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {content}
            </ReactMarkdown>
            {isStreaming && (
              <span className="inline-flex gap-[3px] ml-1 items-center align-middle">
                <span className="w-[5px] h-[5px] rounded-full bg-foreground/60 dot-1" />
                <span className="w-[5px] h-[5px] rounded-full bg-foreground/60 dot-2" />
                <span className="w-[5px] h-[5px] rounded-full bg-foreground/60 dot-3" />
              </span>
            )}
          </>
        ) : (
          <p className="whitespace-pre-wrap font-medium">{content}</p>
        )}
      </div>

    </div>
  );
}
