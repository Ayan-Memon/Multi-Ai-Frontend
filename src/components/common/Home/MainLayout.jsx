"use client";
import { Chats } from "./Chats";

export const MainLayout = () => {
  return (
    <section className="h-dvh w-full flex-1 flex justify-center items-center overflow-hidden ">
      <Chats />
    </section>
  );
};
