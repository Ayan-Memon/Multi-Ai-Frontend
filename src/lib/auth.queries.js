import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/auth`,
  withCredentials: true,
});

export const loginApi = async (idToken) => {
  const res = await api.post("/login", idToken);
  return res.data.user;
};

export const logoutApi = async () => {
  const res = await api.post("/logout");
  return res.data.user;
};

export const getCurrentUser = async () => {
  const res = await api.get("/me");
  return res.data.user;
};

