import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/agent`,
  withCredentials: true,
});

export const sendMsg = async (formData) => {
  const res = await api.post("/chat", formData);
  return res.data.data;
};
