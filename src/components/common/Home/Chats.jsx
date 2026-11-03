"use client";
import { sendMsg } from "@/lib/agent.queries";
import { ChatInput } from "../ChatInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const Chats = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync: CreateConversation } = useMutation({
    mutationFn: sendMsg,
    mutationKey: ["create-conversation"],
    onSuccess: (data) => {
      queryClient.setQueryData(["conversations"], (old = []) => [
        { _id: data.conversationId, title: data?.userMsg?.content },
        ...old,
      ]);
      router.push(`/c/${data.conversationId}?new=true`);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleSubmit = async (formData) => {
    await CreateConversation(formData);
  };

  return (
    <main className="flex-1 w-full flex flex-col gap-6 justify-center items-center">
      <h1 className="font-heading text-4xl text-nowrap font-extralight">
        What&apos;s on your {""}
        <span className="font-medium">mind?</span>
      </h1>
      <ChatInput handleSubmit={handleSubmit} />
    </main>
  );
};
