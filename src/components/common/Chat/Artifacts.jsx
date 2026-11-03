"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Check,
  Copy,
  CrossIcon,
  FileCode2,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { removeArtifact } from "@/store/slices/artifact.slice";

const getLanguage = (filename = "") => {
  const ext = filename.split(".").pop()?.toLowerCase();

  const languages = {
    js: "javascript",
    jsx: "jsx",
    ts: "typescript",
    tsx: "tsx",
    css: "css",
    html: "html",
    json: "json",
    py: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    cs: "csharp",
    go: "go",
    rs: "rust",
    php: "php",
    sql: "sql",
    md: "markdown",
    sh: "bash",
    bash: "bash",
  };

  return languages[ext] || "text";
};

export const Artifact = () => {
  const artifacts = useSelector((state) => state?.artifact ?? []);
  const dispatch = useDispatch();

  const [activeProject, setActiveProject] = useState(0);
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!artifacts.length) return null;

  const project = artifacts[activeProject];

  if (!project?.files?.length) return null;

  const file = project.files[activeFile];
  const language = getLanguage(file.name);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(file.content);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleFileChange = (index) => {
    setActiveFile(index);
    setCopied(false);
  };

  return (
    <>
      {expanded && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setExpanded(false)}
        />
      )}

      <aside
        className={
          expanded
            ? "fixed inset-20 z-50 "
            : "relative h-full w-[480px] shrink-0 py-5 px-2 "
        }
      >
        <div
          className="
            flex h-full min-h-0 w-full flex-col
            overflow-hidden
            rounded-xl
            border border-border
            bg-[#111111]
            shadow-[0_12px_40px_rgba(0,0,0,0.18)]
          "
        >
          <div
            className="
              flex h-11 shrink-0
              items-center justify-between
              border-b border-white/[0.07]
              bg-[#171717]
              px-3
            "
          >
            <div className="flex min-w-0 items-center gap-2">
              <FileCode2 size={15} className="shrink-0 text-white/45" />

              <span className="truncate text-[12px] font-medium text-white/75">
                {project.type || "Project"}
              </span>

              {artifacts.length > 1 && (
                <span className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-white/35">
                  {activeProject + 1}/{artifacts.length}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setExpanded((prev) => !prev)}
                className="
                flex h-7 w-7 shrink-0
                items-center justify-center
                rounded-md
                text-white/40
                transition
                hover:bg-white/[0.06]
                hover:text-white/80
                cursor-pointer
              "
                title={expanded ? "Collapse" : "Expand"}
              >
                {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
              <button
                className="
                flex h-7 w-7 shrink-0
                items-center justify-center
                rounded-md
                text-white/40
                transition
                hover:bg-white/[0.06]
                hover:text-white/80
                cursor-pointer
              "
                title={"Close"}
                onClick={() => dispatch(removeArtifact())}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div
            className="
              flex h-10 shrink-0
              overflow-x-auto overflow-y-hidden
              border-b border-white/[0.07]
              bg-[#141414]
              scrollbar-thin
            "
          >
            {project.files.map((item, index) => {
              const isActive = index === activeFile;

              return (
                <button
                  key={`${item.name}-${index}`}
                  onClick={() => handleFileChange(index)}
                  className={`
                    group
                    relative
                    flex shrink-0
                    items-center gap-2
                    border-r border-white/[0.05]
                    px-3
                    text-[11px]
                    transition
                    ${
                      isActive
                        ? "bg-[#111111] text-white/85"
                        : "text-white/40 hover:bg-white/[0.025] hover:text-white/65"
                    }
                  `}
                >
                  <FileCode2
                    size={13}
                    className={isActive ? "text-white/60" : "text-white/30"}
                  />

                  <span>{item.name}</span>

                  {isActive && (
                    <span
                      className="
                        absolute
                        bottom-0
                        left-2
                        right-2
                        h-[1px]
                        bg-white/70
                      "
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div
            className="
              flex h-9 shrink-0
              items-center justify-between
              border-b border-white/[0.05]
              bg-[#111111]
              px-3
            "
          >
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate font-mono text-[11px] text-white/45">
                {file.name}
              </span>

              <span
                className="
                  rounded-md
                  border border-white/[0.07]
                  bg-white/[0.035]
                  px-1.5 py-0.5
                  font-mono
                  text-[9px]
                  uppercase
                  tracking-wide
                  text-white/30
                "
              >
                {language}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="
                flex h-7 shrink-0
                items-center gap-1.5
                rounded-md
                px-2
                text-[10px]
                text-white/40
                transition
                hover:bg-white/[0.06]
                hover:text-white/80
              "
            >
              {copied ? (
                <>
                  <Check size={12} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={12} />
                  Copy
                </>
              )}
            </button>
          </div>

          <div
            className="
              min-h-0
              flex-1
              overflow-auto
              bg-[#111111]
              scrollbar-thin
              scrollbar-track-transparent
              scrollbar-thumb-white/10
              hover:scrollbar-thumb-white/20
            "
          >
            <SyntaxHighlighter
              language={language}
              style={oneDark}
              showLineNumbers
              wrapLongLines={false}
              PreTag="div"
              customStyle={{
                margin: 0,
                padding: "16px 0 40px",
                background: "#111111",
                fontSize: "12px",
                lineHeight: "1.7",
                minWidth: "max-content",
              }}
              codeTagProps={{
                style: {
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                },
              }}
              lineNumberStyle={{
                minWidth: "42px",
                paddingRight: "14px",
                paddingLeft: "12px",
                textAlign: "right",
                userSelect: "none",
                color: "rgba(255,255,255,0.20)",
                borderRight: "1px solid rgba(255,255,255,0.05)",
                marginRight: "16px",
              }}
            >
              {file.content}
            </SyntaxHighlighter>
          </div>
        </div>
      </aside>
    </>
  );
};
