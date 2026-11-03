"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Image from "next/image";
import { CopyBtn } from "./CopyBtn";
import { ChevronRight, FileCode2, FileText } from "lucide-react";
import { useDispatch } from "react-redux";
import { setArtifacts } from "@/store/slices/artifact.slice";

const useTypewriter = (text, enabled, onDone) => {
  const [count, setCount] = useState(enabled ? 0 : text.length);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (!enabled) {
      setCount(text.length);
      return;
    }

    let frame;
    let current = 0;
    let last = 0;
    const step = Math.max(2, Math.ceil(text.length / 240));

    const tick = (time) => {
      if (time - last >= 16) {
        last = time;
        current = Math.min(text.length, current + step);
        setCount(current);
      }

      if (current < text.length) {
        frame = requestAnimationFrame(tick);
      } else {
        doneRef.current?.();
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, enabled]);

  return {
    visibleText: enabled ? text.slice(0, count) : text,
    isTyping: enabled && count < text.length,
  };
};

export const MarkdownMessage = ({
  content,
  className,
  artifact,
  images,
  animate = false,
  onTypingDone,
}) => {
  const dispatch = useDispatch();
  const { visibleText, isTyping } = useTypewriter(
    content ?? "",
    animate,
    onTypingDone,
  );

  return (
    <div
      className={`w-full min-w-0 max-w-none break-words text-[15px] leading-7 text-text-primary ${className ?? ""}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-([\w-]+)/.exec(className || "");
            const code = String(children).replace(/\n$/, "");

            if (!match) {
              return (
                <code
                  className="rounded-md border border-border bg-surface-muted px-1.5 py-0.5 font-mono text-[0.88em] text-text-primary break-words"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            const language = match[1];

            return (
              <div className="my-4 sm:my-5 w-full max-w-full overflow-hidden rounded-xl border border-border bg-surface-muted">
                <div className="flex h-10 items-center justify-between border-b border-border bg-surface px-3">
                  <span className="font-mono text-xs text-text-secondary">
                    {language}
                  </span>
                  <CopyBtn code={code} />
                </div>

                <div className="overflow-x-auto">
                  <SyntaxHighlighter
                    language={language}
                    style={oneDark}
                    PreTag="div"
                    codeTagProps={{
                      style: {
                        background: "transparent",
                      },
                    }}
                    customStyle={{
                      margin: 0,
                      padding: "14px",
                      background: "transparent",
                      fontSize: "13px",
                      lineHeight: "1.7",
                    }}
                  >
                    {code}
                  </SyntaxHighlighter>
                </div>
              </div>
            );
          },

          h1: ({ children }) => (
            <h1 className="mb-3 mt-5 text-xl font-bold tracking-tight sm:mb-4 sm:mt-6 sm:text-2xl">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mb-3 mt-5 text-lg font-semibold tracking-tight sm:mt-6 sm:text-xl">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mb-2 mt-4 text-base font-semibold sm:mt-5 sm:text-lg">
              {children}
            </h3>
          ),

          h4: ({ children }) => (
            <h4 className="mb-2 mt-4 font-semibold">{children}</h4>
          ),

          p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,

          ul: ({ children }) => (
            <ul className="mb-4 ml-5 list-disc space-y-1 sm:ml-6">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="mb-4 ml-5 list-decimal space-y-1 sm:ml-6">
              {children}
            </ol>
          ),

          li: ({ children }) => <li className="pl-1">{children}</li>,

          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-3 border-border pl-3 italic text-text-secondary sm:pl-4">
              {children}
            </blockquote>
          ),

          a: ({ href, children }) => {
            const isPdf = href?.toLowerCase().includes(".pdf");
            const isPpt = href?.toLowerCase().includes(".pptx");

            if (isPdf || isPpt) {
              return (
                <div className="my-4 flex w-full max-w-[300px] items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
                    <FileText size={18} className="text-text-secondary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text-primary">
                      {children || `${isPpt ? "Presentation" : "PDF"}`}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {isPpt ? "Presentation" : "PDF"}
                    </p>
                  </div>

                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-surface-muted"
                  >
                    Open
                  </a>
                </div>
              );
            }

            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-3 break-words hover:opacity-70"
              >
                {children}
              </a>
            );
          },

          table: ({ children }) => (
            <div className="my-4 sm:my-5 w-full max-w-full overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-125 border-collapse text-sm">
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead className="bg-surface-muted">{children}</thead>
          ),

          tbody: ({ children }) => <tbody>{children}</tbody>,

          tr: ({ children }) => (
            <tr className="border-b border-border last:border-0">{children}</tr>
          ),

          th: ({ children }) => (
            <th className="whitespace-nowrap px-3 py-2.5 text-left font-semibold sm:px-4 sm:py-3">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="px-3 py-2.5 align-top text-text-secondary sm:px-4 sm:py-3">
              {children}
            </td>
          ),

          hr: () => <hr className="my-6 border-border" />,

          strong: ({ children }) => (
            <strong className="font-semibold text-text-primary">
              {children}
            </strong>
          ),

          em: ({ children }) => <em className="italic">{children}</em>,

          img: ({ src, alt }) => (
            <Image
              src={src}
              alt={alt || "Image"}
              width={1024}
              height={1024}
              loading="lazy"
              className="h-auto max-h-100 w-auto max-w-full rounded-xl border border-border object-contain"
            />
          ),
        }}
      >
        {visibleText}
      </ReactMarkdown>

      {!isTyping && artifact && artifact?.length > 0 && (
        <div className="flex flex-col gap-3">
          {artifact[0]?.files?.map((file, index) => {
            const fileSplit = file.name.split(".");
            return (
              <div
                key={index}
                className="
                  group flex items-center gap-3
                  w-full max-w-[400px]
                  rounded-xl
                  border border-white/[0.07]
                  bg-[#101010]
                  px-3.5 py-3
                  cursor-pointer
                  transition-all duration-200
                  hover:border-blue-500/25
                  hover:bg-[#151515]
                  hover:shadow-[0_0_20px_rgba(37,99,235,0.08)]
                "
                onClick={() => dispatch(setArtifacts(artifact))}
              >
                <div
                  className="
                    flex h-9 w-9 shrink-0 items-center justify-center
                    rounded-lg
                    border border-blue-500/15
                    bg-blue-500/10
                    text-blue-400
                    transition-colors duration-200
                    group-hover:bg-blue-500/15
                  "
                >
                  <FileCode2 size={18} strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-white capitalize">
                    {fileSplit[0]}
                  </span>

                  <span className="mt-0.5 block text-xs uppercase text-zinc-500">
                    Code · {fileSplit[1]}
                  </span>
                </div>

                <ChevronRight
                  size={16}
                  className="
                    shrink-0 text-zinc-500
                    max-sm:opacity-100
                    sm:text-zinc-600
                    sm:opacity-0 sm:-translate-x-1
                    transition-all duration-200
                    sm:group-hover:translate-x-0
                    sm:group-hover:opacity-100
                    sm:group-hover:text-zinc-400
                  "
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};