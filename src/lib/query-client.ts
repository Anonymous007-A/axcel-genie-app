import { QueryClient } from "@tanstack/react-query";

// 1. Ek function banate hain jo naya client create kare
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,         // 5 min - data stale hone me deri
        gcTime: 10 * 60 * 1000,           // 10 min - garbage collection
        retry: 2,                         // fail hone par 2 baar retry
        refetchOnWindowFocus: false,      // window focus pe auto refetch nahi
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

// 2. Client-side ke liye ek global variable
let browserQueryClient: QueryClient | undefined = undefined;

// 3. Pro-Level Exported Function (Ye function decide karega client kahan ban raha hai)
export function getQueryClient() {
  if (typeof window === "undefined") {
    // SERVER: Har request ke liye strictly naya client (to prevent data leaks between users)
    return makeQueryClient();
  } else {
    // BROWSER: Agar client nahi bana hai tabhi banao, warna purana wala use karo
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}