import { Fraunces, Inter } from "next/font/google";
import CanConCalculator from "./CanConCalculator";

const heading = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-heading",
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata = {
  title: "Canadian Content Estimator — ontari.io",
  description:
    "Estimate your Canadian content score and price credit under the federal Buy Canadian procurement policy.",
};

export default function Page() {
  return (
    <main
      className={`${heading.variable} ${body.variable} min-h-screen bg-[#FAF9F5] text-[#1E1B16]`}
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="mx-auto max-w-[680px] px-6 py-16 sm:py-20">
        <p className="text-sm" style={{ color: "#B8862E" }}>
          Bid content estimator
        </p>
        <h1
          className="mt-2 text-4xl leading-tight sm:text-5xl"
          style={{ fontFamily: "var(--font-heading)", fontStyle: "italic" }}
        >
          Canadian Content Estimator
        </h1>
        <p className="mt-5 max-w-[54ch] text-base leading-relaxed" style={{ color: "#6B655A" }}>
          Since December 2025, qualifying Canadian suppliers on strategic federal
          procurements get a 10% price credit for evaluation purposes, and up to 25% of
          the total evaluation score is tied to committed Canadian content. As of June
          2026 that applies to contracts of $5 million and up. Enter your bid to see
          roughly where it lands.
        </p>

        <div className="mt-6 border px-5 py-4 text-sm leading-relaxed" style={{ borderColor: "#D8D3C7", color: "#6B655A" }}>
          This tool gives a directional estimate based on public policy summaries. It
          isn&rsquo;t legal or procurement advice, and it doesn&rsquo;t replace reading the
          actual solicitation you&rsquo;re bidding on.
        </div>

        <div className="mt-14">
          <CanConCalculator />
        </div>
      </div>
    </main>
  );
}