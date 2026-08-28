"use client";

import { useCallback, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  getAccount,
} from "@solana/spl-token";
import { siteConfig } from "@/config/site";

type BurnStatus = "idle" | "building" | "awaiting-signature" | "confirming" | "success" | "error";

export function useBurnTokens() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [status, setStatus] = useState<BurnStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const burn = useCallback(
    async (amount: number) => {
      setError(null);
      setSignature(null);

      if (!publicKey) {
        setError("Connect a wallet first.");
        setStatus("error");
        return;
      }
      if (!amount || amount <= 0) {
        setError("Enter an amount greater than zero.");
        setStatus("error");
        return;
      }

      try {
        setStatus("building");

        const mint = new PublicKey(siteConfig.solana.tokenMintAddress);
        const incinerator = new PublicKey(siteConfig.solana.incineratorAddress);
        const decimals = siteConfig.solana.tokenDecimals;

        const senderAta = await getAssociatedTokenAddress(mint, publicKey);

        // Check the wallet actually holds enough before asking for a signature —
        // otherwise the transaction fails on-chain after the user already signed it.
        let senderBalance = 0;
        try {
          const account = await getAccount(connection, senderAta);
          senderBalance = Number(account.amount) / 10 ** decimals;
        } catch {
          senderBalance = 0;
        }
        if (senderBalance < amount) {
          setError(
            `You only hold ${senderBalance.toLocaleString()} ${siteConfig.tickerSymbol}, which isn't enough to burn ${amount.toLocaleString()}.`
          );
          setStatus("error");
          return;
        }

        const incineratorAta = await getAssociatedTokenAddress(mint, incinerator, true);

        const transaction = new Transaction();

        // The incinerator address has no known private key, so it has never
        // "logged in" to create its own token account — we may need to create
        // it (funded by the sender) the first time anyone burns this token.
        const incineratorAccountInfo = await connection.getAccountInfo(incineratorAta);
        if (!incineratorAccountInfo) {
          transaction.add(
            createAssociatedTokenAccountInstruction(
              publicKey,
              incineratorAta,
              incinerator,
              mint
            )
          );
        }

        const rawAmount = BigInt(Math.round(amount * 10 ** decimals));

        transaction.add(
          createTransferCheckedInstruction(
            senderAta,
            mint,
            incineratorAta,
            publicKey,
            rawAmount,
            decimals
          )
        );

        setStatus("awaiting-signature");
        const sig = await sendTransaction(transaction, connection);

        setStatus("confirming");
        const latestBlockhash = await connection.getLatestBlockhash();
        const confirmation = await connection.confirmTransaction(
          { signature: sig, ...latestBlockhash },
          "confirmed"
        );

        // confirmTransaction resolves even when the transaction failed
        // on-chain (e.g. insufficient funds) — the failure shows up here,
        // not as a thrown error, so it has to be checked explicitly.
        if (confirmation.value.err) {
          throw new Error(
            `Transaction landed but failed on-chain: ${JSON.stringify(confirmation.value.err)}`
          );
        }

        setSignature(sig);
        setStatus("success");
        return sig;
      } catch (err) {
        console.error("Burn transaction failed:", err);
        setError(err instanceof Error ? err.message : "Transaction failed.");
        setStatus("error");
      }
    },
    [publicKey, connection, sendTransaction]
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setSignature(null);
  }, []);

  return { burn, status, error, signature, reset };
}

// Re-exported so callers can sanity-check a wallet actually holds enough
// balance before attempting a burn, giving a friendlier error than a failed tx.
export async function getTokenBalance(
  connection: ReturnType<typeof useConnection>["connection"],
  owner: PublicKey
): Promise<number> {
  const mint = new PublicKey(siteConfig.solana.tokenMintAddress);
  const ata = await getAssociatedTokenAddress(mint, owner);
  try {
    const account = await getAccount(connection, ata);
    return Number(account.amount) / 10 ** siteConfig.solana.tokenDecimals;
  } catch {
    return 0;
  }
}
