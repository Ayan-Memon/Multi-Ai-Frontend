import { ChatLayout } from "@/components/common/Chat/ChatLayout";

const chat = async ({ params, searchParams }) => {
  const { conversationId } = await params;
  const query = await searchParams;

  return <ChatLayout conversationId={conversationId} query={query} />;
};

export default chat;
