"use client";

import { SessionProvider } from "next-auth/react";
import { App } from "../../app/_refine_context";
import { ColorModeContextProvider } from "../color-mode";
import { TranslationProvider } from "../translation.context";
// import { LiveSupportButton } from "../../components/shared/live-support-button";
import ClientProvider from "../provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export const RefineContext = (props: any) => {
  const defaultMode = props?.defaultMode;

  // Create QueryClient at the highest level to ensure it's always available
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      })
  );

  const aiConfig = {
    provider: "openai" as const,
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
    model: "gpt-3.5-turbo",
    maxTokens: 150,
    temperature: 0.7,
    maxRetries: 3,
    retryDelay: 1000, 
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ClientProvider>
          <TranslationProvider>
            <ColorModeContextProvider defaultMode={defaultMode}>
              <App {...props} />
              {/* <LiveSupportButton
                aiConfig={aiConfig}
                companyName="CumiTech"
                supportEmail="info@cumi.dev"
                supportPhone="+237-673-687-549"
                whatsappNumber="+237681289411"
              /> */}
            </ColorModeContextProvider>
          </TranslationProvider>
        </ClientProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};

