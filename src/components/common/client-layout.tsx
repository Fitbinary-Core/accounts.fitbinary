"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "../ui/theme-provider";
import { ReduxProvider } from "@/store/provider";
import { Toaster } from "react-hot-toast";

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ReduxProvider>
          <Toaster position="top-center" />
          {children}
        </ReduxProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
