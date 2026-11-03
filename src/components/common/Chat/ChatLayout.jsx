"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChatInput } from "../ChatInput";
import { getMessages } from "@/lib/chat.queries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from "@/components/ui/message-scroller";
import { sendMsg } from "@/lib/agent.queries";
import { MarkdownMessage } from "./MarkDownMessage";
import { Message } from "./Message";
import { useDispatch, useSelector } from "react-redux";
import { setArtifacts } from "@/store/slices/artifact.slice";
import { Artifact } from "./Artifacts";

function AutoScrollOnNew({ enabled, ready }) {
  const scroller = useMessageScroller();
  const done = useRef(false);

  useEffect(() => {
    if (!enabled || !ready || done.current) return;
    const t = setTimeout(() => {
      scroller.scrollToStart?.();
      done.current = true;
    }, 100);
    return () => clearTimeout(t);
  }, [enabled, ready]);

  return null;
}

export const ChatLayout = ({ conversationId, query }) => {
  const queryClient = useQueryClient();
  const [typingMessageId, setTypingMessageId] = useState(null);
  const dispatch = useDispatch();
  const artifact = useSelector((state) => state?.artifact ?? []);

  const { data: messages, isPending } = useQuery({
    queryKey: ["conversations", conversationId],
    queryFn: () => getMessages(conversationId),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 35,
  });

  const { mutate: send, isPending: isSending } = useMutation({
    mutationFn: sendMsg,
    mutationKey: ["send-message"],
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["conversations", conversationId],
        (old = []) => [...old, data.aiMsg],
      );

      if (data.aiMsg.artifacts?.length > 0) {
        dispatch(setArtifacts(data.aiMsg.artifacts));
      }
      setTypingMessageId(data?.aiMsg?._id);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleMsgSend = (formData) => {
    if (isSending) return;

    const prompt = formData.get("prompt");
    const file = formData.get("file");
    let previewUrl;
    if (file && file.type.startsWith("/image")) {
      previewUrl = URL.createObjectURL(file);
    }

    queryClient.setQueryData(["conversations", conversationId], (old = []) => [
      ...old,
      {
        role: "user",
        content: prompt,
        _id: `${Date.now()}user`,
        previewUrl,
        fileName: file?.name,
        type: file?.type,
      },
    ]);

    formData.append("conversationId", conversationId);

    send(formData);
  };

  return (
    <main className="flex-1 flex h-dvh w-full min-w-0">
      <section className="relative h-dvh w-full min-w-0 mx-auto flex-1 flex flex-col items-center overflow-hidden">
        <MessageScrollerProvider scrollPreviousItemPeek={220}>
          <MessageScroller className="h-full">
            <AutoScrollOnNew
              enabled={query?.new === "true"}
              ready={!isPending && !!messages?.length}
            />
            <MessageScrollerViewport className={"scroll-fade scroll-fade-y"}>
              <MessageScrollerContent
                className="px-3 sm:px-4 pt-16! md:pt-10! pb-44! sm:pb-55! max-w-[730px] mx-auto"
                aria-busy={isSending || isPending}
              >
                {messages?.map((msg, idx) => {
                  return (
                    <MessageScrollerItem
                      key={msg._id}
                      messageId={msg._id}
                      scrollAnchor={msg.role === "user"}
                      style={{ contentVisibility: "visible" }}
                    >
                      {msg.role === "user" ? (
                        <>
                          <Message
                            content={msg.content}
                            file={msg.file}
                            previewUrl={msg.previewUrl}
                            type={msg.type}
                            fileName={msg.fileName}
                          />
                          {isSending && idx === messages.length - 1 && (
                            <p className="shimmer pt-4 text-sm text-muted-foreground px-4 animate-pulse">
                              Thinking&hellip;
                            </p>
                          )}
                        </>
                      ) : (
                        <MarkdownMessage
                          content={msg.content}
                          artifact={msg.artifacts}
                          images={msg.images}
                          animate={msg._id === typingMessageId}
                          onTypingDone={() => setTypingMessageId(null)}
                        />
                      )}
                    </MessageScrollerItem>
                  );
                })}
              </MessageScrollerContent>
            </MessageScrollerViewport>

            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>

        <div className="absolute w-full bottom-[max(0.75rem,env(safe-area-inset-bottom))] sm:bottom-4 mx-auto px-3 sm:px-4 flex justify-center items-center">
          <ChatInput handleSubmit={handleMsgSend} disabled={isSending} />
        </div>
      </section>

      <Artifact />
    </main>
  );
};
