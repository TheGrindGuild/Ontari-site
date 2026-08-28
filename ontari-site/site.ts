/**
 * ONTARI.IO — SITE CONFIGURATION
 * ───────────────────────────────
 * Every editable value for the site lives here. Nothing below should be
 * hardcoded elsewhere in the app — change it once, it updates everywhere.
 */

export const siteConfig = {
  // Brand
  name: "ONTARI.IO",
  tickerSymbol: "$ONTARI",
  tagline: "MEME ONTARI'IO",
  proclamation: ["THE MEME IS BEAUTIFUL.", "THE MEME IS BIG."],

  // Token
  tokenContractAddress: "9D7E8iCw8RmMjXnxVffQDAXLP8y6FCj9wCqPkogLpump",

  // External links — swap these placeholders for the live URLs when ready
  links: {
    buy: "https://pump.fun/coin/9D7E8iCw8RmMjXnxVffQDAXLP8y6FCj9wCqPkogLpump",
    dexscreener: "https://dexscreener.com/solana/9D7E8iCw8RmMjXnxVffQDAXLP8y6FCj9wCqPkogLpump",
    twitter: "https://x.com/ontari_io",
  },

  // Solana / Cast a Stone game config
  solana: {
    // pump.fun tokens are minted with 6 decimals by default — confirm on Solscan
    // if you're not sure, since a wrong value will burn the wrong amount.
    tokenMintAddress: "9D7E8iCw8RmMjXnxVffQDAXLP8y6FCj9wCqPkogLpump",
    tokenDecimals: 6,
    // The well-known Solana "incinerator" address — has no known private key,
    // so anything sent here is permanently unspendable.
    incineratorAddress: "1nc1nerator11111111111111111111111111111111",
    // Public RPC is fine for testing but rate-limits under real traffic.
    // Swap in a Helius/QuickNode/Alchemy mainnet endpoint before launch.
    rpcEndpoint: "https://api.mainnet-beta.solana.com",
  },

  // Legal
  disclaimer:
    "$ONTARI is a meme coin created for entertainment and cultural satire. It has no guaranteed value or expectation of profit.",

  year: 2026,
} as const;

export type SiteConfig = typeof siteConfig;
