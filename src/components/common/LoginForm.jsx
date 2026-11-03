"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { loginApi } from "@/lib/auth.queries";
import { auth, googleProvider } from "@/utils/firebase";
import { useMutation } from "@tanstack/react-query";
import { signInWithPopup } from "firebase/auth";
import React from "react";

export const LoginForm = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: loginApi,
    mutationKey: ["login-mutation"],
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (data) => {
      console.log(data);
    },
  });
  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    const idToken = await data.user.getIdToken();
    console.log(idToken);
    mutate({ idToken });
  };
  return (
    <section className="h-dvh flex justify-center items-center">
      <Card className={`p-4`}>
        <Button
          className={`bg-white flex justify-center items-center text-lg text-black rounded-md font-medium px-2 py-1 font-inter! min-w-80 cursor-pointer`}
          onClick={googleLogin}
          disabled={isPending}
        >
          Continue With Google
        </Button>
      </Card>
    </section>
  );
};
