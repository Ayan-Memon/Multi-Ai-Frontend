import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/chat`,
  withCredentials: true,
});

export const getMessages = async (conversationId) => {
  const res = await api.get(`/get-messages/${conversationId}`);
  return res.data.messages;
};

export const getConversations = async () => {
  const res = await api.get("/conversations");
  return res.data.conversations;
};