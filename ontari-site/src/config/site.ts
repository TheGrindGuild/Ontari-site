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
  tokenContractAddress: "REPLACE_WITH_TOKEN_CONTRACT_ADDRESS",

  // External links — swap these placeholders for the live URLs when ready
  links: {
    buy: "https://your-buy-link.example.com",
    dexscreener: "https://dexscreener.com/",
    twitter: "https://x.com/ontari_io",
  },

  // Legal
  disclaimer:
    "$ONTARI is a meme coin created for entertainment and cultural satire. It has no guaranteed value or expectation of profit.",

  year: 2026,
} as const;

export type SiteConfig = typeof siteConfig;
