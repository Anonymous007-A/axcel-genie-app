"use client";

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/lib/query-client";
import { SessionProvider } from "next-auth/react"; // ✅ Ye naya add kiya

export default function Providers({ children }: { children: React.ReactNode }) {
  // UPGRADE: getQueryClient hamesha browser mein wahi purana instance dega
  // aur server par har request ke liye naya (Isomorphic approach).
  const queryClient = getQueryClient();

  return (
    // ✅ Poore app ko SessionProvider se wrap kar diya
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* Devtools development mein debug karne ke liye bohot kaam aate hain */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}