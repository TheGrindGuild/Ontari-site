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
    dexscreener: "https://dexscreener.com/",
    twitter: "https://x.com/ontari_io",
  },

  // Solana / Cast a Stone game config
  solana: {
    tokenMintAddress: "9D7E8iCw8RmMjXnxVffQDAXLP8y6FCj9wCqPkogLpump",
    tokenDecimals: 6,
    incineratorAddress: "1nc1nerator11111111111111111111111111111111",
    rpcEndpoint: "https://api.mainnet-beta.solana.com",
  },

  // Legal
  disclaimer:
    "$ONTARI is a meme coin created for entertainment and cultural satire. It has no guaranteed value or expectation of profit.",

  year: 2026,
} as const;

export type SiteConfig = typeof siteConfig;
