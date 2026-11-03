"use client";
import { ArrowUp, Code2, ImageIcon, Paperclip, Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

const defaultSubmit = () => console.log("submit");

const formDataFunc = (prompt, file, agent) => {
  const formData = new FormData();
  formData.append("prompt", prompt);
  formData.append("agent", agent);
  if (file) {
    formData.append("file", file);
  }
  return formData;
};

export const ChatInput = ({
  handleSubmit = defaultSubmit,
  disabled = false,
  className,
}) => {
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [agent, setAgent] = useState("auto");
  const [isSending, setIsSending] = useState(false);

  const loading = disabled || isSending;

  const previewUrl = useMemo(() => {
    if (file && file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return null;
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) {
      inputRef.current?.focus();
    }
  }, []);

  const onSend = async () => {
    if (!prompt.trim() || loading) return;

    const formData = formDataFunc(prompt, file, agent);

    try {
      setIsSending(true);
      await handleSubmit(formData);
      setPrompt("");
      setFile(null);
      setAgent("auto");
    } catch (err) {
      console.log(err);
    } finally {
      setIsSending(false);
    }
  };

  const toggleAgent = (name) =>
    setAgent((prev) => (prev === name ? "auto" : name));

  const agentBtnClass = (name) =>
    `flex h-9 sm:h-10 shrink-0 items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 ${
      agent === name
        ? "bg-surface-muted dark:bg-sidebar-primary dark:text-sidebar-primary-foreground"
        : "bg-white dark:bg-zinc-800"
    } px-2.5 sm:px-3 text-[13px] font-medium text-text-secondary transition hover:bg-surface-muted dark:hover:bg-sidebar-primary dark:hover:text-sidebar-primary-foreground`;

  const agentLabelClass = (name) =>
    `whitespace-nowrap ${agent === name ? "inline max-[390px]:hidden" : "hidden sm:inline"}`;

  return (
    <>
      <div
        className={`w-full max-w-[730px] bg-white dark:bg-sidebar rounded-2xl p-3 sm:p-4 border border-input ${className ?? ""}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            setFile(e.target.files[0] ?? null);
            e.target.value = "";
          }}
          hidden
          className="hidden"
          accept="image/jpeg,image/png,image/webp,application/pdf"
        />

        {file && (
          <div className="w-max pb-2" onClick={() => setFile(null)}>
            {previewUrl && (
              <Image
                src={previewUrl}
                alt="file"
                width={40}
                height={40}
                className="h-15 w-15 shrink-0 rounded-md object-cover"
                title={file.name}
              />
            )}

            {file.type === "application/pdf" && (
              <div
                className="flex gap-2 p-4 bg-zinc-800 border border-border rounded-xl"
                title={file.name}
              >
                <p className="text-sm font-medium text-text-primary">PDF</p>
              </div>
            )}
          </div>
        )}

        <textarea
          rows={2}
          placeholder="Ask me anything..."
          className={`${file ? "min-h-[56px] sm:min-h-[70px]" : "min-h-[64px] sm:min-h-[92px]"} max-h-40 w-full resize-none border-0 bg-transparent px-2 py-1 text-base sm:text-[14px] text-text-secondary outline-none`}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          ref={inputRef}
        />

        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              aria-label="Attach file"
              className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white dark:bg-zinc-800 text-text-secondary transition hover:bg-surface-muted dark:hover:bg-sidebar-primary dark:hover:text-sidebar-primary-foreground"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={18} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              aria-label="Nexora Code"
              aria-pressed={agent === "coding"}
              title="Nexora Code"
              className={agentBtnClass("coding")}
              onClick={() => toggleAgent("coding")}
            >
              <Code2 size={17} strokeWidth={1.8} />
              <span className={agentLabelClass("coding")}>Nexora Code</span>
            </button>

            <button
              type="button"
              aria-label="Create Image"
              aria-pressed={agent === "vision"}
              title="Create Image"
              className={agentBtnClass("vision")}
              onClick={() => toggleAgent("vision")}
            >
              <ImageIcon size={17} strokeWidth={1.8} />
              <span className={agentLabelClass("vision")}>Create Image</span>
            </button>

            <button
              type="button"
              aria-label="Deep Research"
              aria-pressed={agent === "search"}
              title="Deep Research"
              className={agentBtnClass("search")}
              onClick={() => toggleAgent("search")}
            >
              <Search size={17} strokeWidth={1.8} />
              <span className={agentLabelClass("search")}>Deep Research</span>
            </button>
          </div>

          <button
            type="button"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.08)] ${
              loading
                ? ""
                : "cursor-pointer hover:shadow-[0_3px_10px_rgba(0,0,0,0.12)] hover:-translate-y-[1px]"
            }`}
            onClick={onSend}
            disabled={loading}
            aria-busy={loading}
            aria-label={loading ? "Sending" : "Send message"}
          >
            {loading ? (
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span className="absolute inset-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span className="h-2 w-2 rounded-[2px] bg-current" />
              </span>
            ) : (
              <ArrowUp size={19} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </>
  );
};
