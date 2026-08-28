"use client";

import { Buffer } from "buffer";
import { useMemo, type ReactNode } from "react";

// @solana/web3.js expects a global Buffer, which browsers don't have natively.
if (typeof window !== "undefined" && !window.Buffer) {
  window.Buffer = Buffer;
}
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { siteConfig } from "@/config/site";

// wallet-adapter-react-ui ships default styles for the connect modal/button.
import "@solana/wallet-adapter-react-ui/styles.css";

export function SolanaWalletProvider({ children }: { children: ReactNode }) {
  const endpoint = siteConfig.solana.rpcEndpoint;

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
