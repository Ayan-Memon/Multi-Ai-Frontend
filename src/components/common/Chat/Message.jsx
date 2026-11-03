"use client";
import Image from "next/image";
import React, { useState } from "react";

const previewLength = 700;

export const Message = ({
  content,
  file = null,
  type = null,
  previewUrl = null,
  fileName = "",
}) => {
  const [open, setOpen] = useState(false);
  const isLong = content.length > previewLength;
  const preview = `${content.slice(0, previewLength)}...`;
  return (
    <>
      {file && (
        <Image
          src={file}
          alt="file"
          width={200}
          height={200}
          className="h-35 w-35 shrink-0 rounded-md object-cover ml-auto my-2"
          title={fileName}
        />
      )}
      {previewUrl && (
        <Image
          src={previewUrl}
          alt="file"
          width={200}
          height={200}
          className="h-35 w-35 shrink-0 ml-auto rounded-md object-cover my-2"
          title={fileName}
        />
      )}

      {type === "application/pdf" && (
        <div
          className="flex gap-2 p-4 bg-zinc-800 border border-border rounded-xl my-2 ml-auto"
          title={file.name}
        >
          <p className="text-sm font-medium text-text-primary">PDF</p>
        </div>
      )}
      <div className="px-4 py-2 bg-primary dark:bg-sidebar-primary dark:text-sidebar-primary-foreground text-primary-foreground w-max max-w-[88%] sm:max-w-[80%] break-words rounded-3xl ml-auto rounded-tr-none text-[15px] leading-7">
        <p>{open || !isLong ? content : preview}</p>
        {isLong && (
          <button
            onClick={() => setOpen(!open)}
            className="text-xs w-max block ml-auto py-1 text-primary underline-offset-4 hover:underline"
          >
            {open ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </>
  );
};
