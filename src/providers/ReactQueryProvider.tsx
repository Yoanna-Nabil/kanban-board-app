"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  //  Create QueryClient once (kept stable across renders)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            //  Data considered "fresh" for 5 minutes (no refetch)
            staleTime: 1000 * 60 * 5,

            //  Don't refetch automatically when the tab becomes active
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  //  Provide React Query context (cache + fetching + mutations)
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}