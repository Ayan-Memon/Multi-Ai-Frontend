"use client";
import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

export const CopyBtn = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (code) => {
    await navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <button
      type="button"
      onClick={() => handleCopy(code)}
      className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
    >
      {copied ? (
        <>
          <Check size={14} />
          Copied
        </>
      ) : (
        <>
          <Copy size={14} />
          Copy
        </>
      )}
    </button>
  );
};
