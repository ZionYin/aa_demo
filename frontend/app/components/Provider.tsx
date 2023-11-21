"use client";

import React from "react";
import { MetaMaskUIProvider } from "@metamask/sdk-react-ui";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <React.StrictMode>
        <MetaMaskUIProvider
        sdkOptions={{
          dappMetadata: {
            name: "AA Demo",
          },
        }}
      >
        {children}
      </MetaMaskUIProvider>
    </React.StrictMode>
  );
}
