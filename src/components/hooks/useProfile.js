"use client";
import { getCurrentUser } from "@/lib/auth.queries";
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    keepPreviousData: true,
  });
};
