import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/**
 * Renders admin-authored Markdown. Raw HTML is NOT rendered (react-markdown
 * default), so stored content cannot inject scripts.
 */
export function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("prose-growth", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => {
            const external = href?.startsWith("http");
            return (
              <a
                href={href}
                {...props}
                {...(external ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}
              >
                {children}
              </a>
            );
          },
          // Article titles are the page h1, so demote any h1 inside content.
          h1: ({ children }) => <h2>{children}</h2>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
