"use client";

import { useCallback, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  createBurnCheckedInstruction,
  getAssociatedTokenAddress,
  getAccount,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from "@solana/spl-token";
import { siteConfig } from "@/config/site";

type BurnStatus = "idle" | "building" | "awaiting-signature" | "confirming" | "success" | "error";

// Solana has two token standards: the classic SPL Token program and the
// newer Token-2022 program. A mint's account is *owned* by whichever
// program created it — so the mint account's owner tells us which one to
// use everywhere else (ATA derivation, instructions, etc). Getting this
// wrong silently computes the wrong account address entirely.
async function resolveTokenProgramId(
  connection: ReturnType<typeof useConnection>["connection"],
  mint: PublicKey
): Promise<PublicKey> {
  const mintAccountInfo = await connection.getAccountInfo(mint);
  if (mintAccountInfo?.owner.equals(TOKEN_2022_PROGRAM_ID)) {
    return TOKEN_2022_PROGRAM_ID;
  }
  return TOKEN_PROGRAM_ID;
}

// getAccount throws TokenAccountNotFoundError when a wallet genuinely has
// never held this token (a real "balance is 0"). Any OTHER error — a bad
// RPC endpoint, a rate limit, a network blip — is a different problem and
// must not be reported to the user as "you hold 0", which is misleading.
async function fetchTokenBalance(
  connection: ReturnType<typeof useConnection>["connection"],
  ata: PublicKey,
  programId: PublicKey,
  decimals: number
): Promise<number> {
  try {
    const account = await getAccount(connection, ata, undefined, programId);
    return Number(account.amount) / 10 ** decimals;
  } catch (err) {
    if (err instanceof TokenAccountNotFoundError || err instanceof TokenInvalidAccountOwnerError) {
      return 0;
    }
    throw new Error(
      `Couldn't check your ${siteConfig.tickerSymbol} balance (RPC error): ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}

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
        const decimals = siteConfig.solana.tokenDecimals;
        const programId = await resolveTokenProgramId(connection, mint);

        const senderAta = await getAssociatedTokenAddress(
          mint,
          publicKey,
          false,
          programId
        );

        // Check the wallet actually holds enough before asking for a signature —
        // otherwise the transaction fails on-chain after the user already signed it.
        const senderBalance = await fetchTokenBalance(connection, senderAta, programId, decimals);
        if (senderBalance < amount) {
          setError(
            `You only hold ${senderBalance.toLocaleString()} ${siteConfig.tickerSymbol}, which isn't enough to burn ${amount.toLocaleString()}.`
          );
          setStatus("error");
          return;
        }

        const rawAmount = BigInt(Math.round(amount * 10 ** decimals));

        // The real Burn instruction — this reduces the mint's total supply
        // directly, rather than moving tokens to a dead wallet.
        const transaction = new Transaction().add(
          createBurnCheckedInstruction(
            senderAta,
            mint,
            publicKey,
            rawAmount,
            decimals,
            [],
            programId
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
  const programId = await resolveTokenProgramId(connection, mint);
  const ata = await getAssociatedTokenAddress(mint, owner, false, programId);
  return fetchTokenBalance(connection, ata, programId, siteConfig.solana.tokenDecimals);
}
