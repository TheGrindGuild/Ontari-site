"use client";

import { useMemo, useState } from "react";
import {
  calculate,
  formatCad,
  MAX_CONTENT_SCORE_PERCENT,
  PRICE_CREDIT_PERCENT,
  STRATEGIC_SECTORS,
  THRESHOLD_CAD,
  type CostLineItem,
  type SectorKey,
} from "@/lib/cancon";

const LINE = "#D8D3C7";
const INK = "#1E1B16";
const MUTED = "#6B655A";
const RED = "#A6192E";
const GOLD = "#B8862E";
const GREEN = "#2F6B4F";

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

const STARTER_LINE_ITEMS: CostLineItem[] = [
  { id: makeId(), label: "Labour", amount: 0, canadianPercent: 100 },
  { id: makeId(), label: "Materials & components", amount: 0, canadianPercent: 0 },
  { id: makeId(), label: "Research & development / IP", amount: 0, canadianPercent: 0 },
];

export default function CanConCalculator() {
  const [bidValue, setBidValue] = useState<string>("");
  const [sector, setSector] = useState<SectorKey>(STRATEGIC_SECTORS[0].key);
  const [hasPlaceOfBusiness, setHasPlaceOfBusiness] = useState(true);
  const [lineItems, setLineItems] = useState<CostLineItem[]>(STARTER_LINE_ITEMS);

  const bidValueCad = Number(bidValue) || 0;

  const result = useMemo(
    () =>
      calculate({
        bidValueCad,
        sector,
        hasPermanentCanadianPlaceOfBusiness: hasPlaceOfBusiness,
        lineItems,
      }),
    [bidValueCad, sector, hasPlaceOfBusiness, lineItems]
  );

  function updateLineItem(id: string, patch: Partial<CostLineItem>) {
    setLineItems((items) => items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function addLineItem() {
    setLineItems((items) => [...items, { id: makeId(), label: "", amount: 0, canadianPercent: 0 }]);
  }

  function removeLineItem(id: string) {
    setLineItems((items) => (items.length > 1 ? items.filter((it) => it.id !== id) : items));
  }

  function downloadSummary() {
    const sectorLabel = STRATEGIC_SECTORS.find((s) => s.key === sector)?.label ?? sector;
    const lines = [
      "CANADIAN CONTENT ESTIMATE — SUMMARY",
      "Generated as a directional estimate, not a certified bid submission.",
      "",
      `Sector: ${sectorLabel}`,
      `Bid value: ${formatCad(bidValueCad)}`,
      `Permanent Canadian place of business: ${hasPlaceOfBusiness ? "Yes" : "No"}`,
      `$5M strategic-procurement threshold met: ${result.thresholdMet ? "Yes" : "No"}`,
      ...(hasReconciliationGap
        ? [
            "",
            `WARNING: line items total ${formatCad(result.totalCost)} but bid value is ${formatCad(
              bidValueCad
            )} — a gap of ${formatCad(Math.abs(gap))}. Reconcile before relying on this estimate.`,
          ]
        : []),
      "",
      "Cost breakdown:",
      ...lineItems.map(
        (it) => `  - ${it.label || "(unlabelled)"}: ${formatCad(it.amount)} (${it.canadianPercent}% Canadian)`
      ),
      "",
      `Estimated Canadian content: ${result.canadianContentPercent.toFixed(1)}%`,
      `Price evaluation credit: ${result.priceCreditPercent}%`,
      `Bid price for evaluation purposes: ${formatCad(result.scoredPriceCad)} (real price unaffected)`,
      `Estimated Canadian-content score: ${result.contentScoreEarned.toFixed(1)} of ${result.contentScoreMax} points`,
      "",
      "This estimate applies a simplified, linear reading of the federal Policy on Prioritizing",
      "Canadian Suppliers and Canadian Content in Strategic Federal Procurements. The specific",
      "RFP sets its own detailed scoring formula within the policy's bounds — verify against the",
      "actual solicitation before submitting a bid.",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cancon-estimate-summary.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  const statusColor = !result.thresholdMet ? MUTED : result.canadianContentPercent >= 50 ? GREEN : GOLD;

  const gap = bidValueCad - result.totalCost;
  const hasReconciliationGap = bidValueCad > 0 && Math.abs(gap) > Math.max(1, bidValueCad * 0.01);

  return (
    <div className="space-y-14">
      {/* Step 01 */}
      <section className="space-y-5">
        <StepHeading number="01" title="Contract details" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Bid value (CAD)">
            <input
              type="number"
              inputMode="decimal"
              min={0}
              value={bidValue}
              onChange={(e) => setBidValue(e.target.value)}
              placeholder="e.g. 6000000"
              className="w-full border-b bg-transparent py-2 text-lg outline-none focus:border-b-2"
              style={{ borderColor: LINE }}
            />
          </Field>
          <Field label="Strategic sector">
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value as SectorKey)}
              className="w-full border-b bg-transparent py-2 text-lg outline-none focus:border-b-2"
              style={{ borderColor: LINE }}
            >
              {STRATEGIC_SECTORS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <label className="flex items-start gap-3 pt-1 text-sm" style={{ color: MUTED }}>
          <input
            type="checkbox"
            checked={hasPlaceOfBusiness}
            onChange={(e) => setHasPlaceOfBusiness(e.target.checked)}
            className="mt-0.5 h-4 w-4"
          />
          <span>
            We have a permanent place of business in Canada, identified by name and accessible
            during normal business hours.
          </span>
        </label>
      </section>

      {/* Step 02 */}
      <section className="space-y-5">
        <StepHeading number="02" title="Cost breakdown" />
        <p className="text-sm" style={{ color: MUTED }}>
          List each major cost line and what share of its value is Canadian-sourced or
          Canadian value-added.
        </p>
        <div className="space-y-3">
          {lineItems.map((item) => (
            <div key={item.id} className="grid grid-cols-[1fr_140px_110px_28px] items-center gap-3">
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateLineItem(item.id, { label: e.target.value })}
                placeholder="Line item"
                className="border-b bg-transparent py-1.5 outline-none focus:border-b-2"
                style={{ borderColor: LINE }}
              />
              <input
                type="number"
                min={0}
                value={item.amount || ""}
                onChange={(e) => updateLineItem(item.id, { amount: Number(e.target.value) || 0 })}
                placeholder="Amount"
                className="border-b bg-transparent py-1.5 text-right outline-none focus:border-b-2"
                style={{ borderColor: LINE }}
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={item.canadianPercent}
                  onChange={(e) =>
                    updateLineItem(item.id, {
                      canadianPercent: Math.min(100, Math.max(0, Number(e.target.value) || 0)),
                    })
                  }
                  className="w-full border-b bg-transparent py-1.5 text-right outline-none focus:border-b-2"
                  style={{ borderColor: LINE }}
                />
                <span style={{ color: MUTED }}>%</span>
              </div>
              <button
                type="button"
                onClick={() => removeLineItem(item.id)}
                aria-label="Remove line item"
                className="justify-self-center text-lg leading-none"
                style={{ color: MUTED }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addLineItem}
          className="text-sm underline decoration-dotted underline-offset-4"
          style={{ color: INK }}
        >
          Add another line item
        </button>
      </section>

      {/* Results ledger */}
      <section
        className="space-y-4 border-t-2 border-b pt-6 pb-8"
        style={{ borderTopColor: INK, borderBottomColor: LINE }}
      >
        <p className="text-xs tracking-wide" style={{ color: MUTED }}>
          Estimated result
        </p>

        {hasReconciliationGap && (
          <div className="border px-4 py-3 text-sm leading-relaxed" style={{ borderColor: RED, color: RED }}>
            Your line items add up to {formatCad(result.totalCost)}, but your bid value is{" "}
            {formatCad(bidValueCad)} — a gap of {formatCad(Math.abs(gap))}. The threshold and
            price credit below are based on bid value; the content % and score are based on the
            line items. Reconcile the two for an accurate estimate.
          </div>
        )}

        <LedgerRow
          label="$5M strategic-procurement threshold"
          value={result.thresholdMet ? "Met" : "Not met at this bid value"}
        />
        <LedgerRow
          label="Canadian content"
          value={`${result.canadianContentPercent.toFixed(1)}%`}
        />
        <LedgerRow
          label={`Price credit (${PRICE_CREDIT_PERCENT}% when qualifying)`}
          value={
            result.isQualifyingCanadianSupplier
              ? `${formatCad(bidValueCad)} → ${formatCad(result.scoredPriceCad)} for scoring`
              : "Not applied"
          }
        />
        <LedgerRow
          label={`Estimated content score (of ${MAX_CONTENT_SCORE_PERCENT} pts)`}
          value={result.contentScoreEarned.toFixed(1)}
        />

        <p className="pt-2 text-sm font-medium" style={{ color: statusColor }}>
          {!result.thresholdMet
            ? "Below the $5M threshold — the strategic-procurement scoring rules likely don't apply to this bid."
            : result.canadianContentPercent >= 50
            ? "Strong position — over half the bid's value is Canadian content."
            : "Room to improve — increasing Canadian-sourced content would raise the score."}
        </p>

        <button
          type="button"
          onClick={downloadSummary}
          className="mt-2 border px-5 py-2.5 text-sm"
          style={{ borderColor: INK, color: INK }}
        >
          Download summary
        </button>

        <p className="pt-4 text-xs leading-relaxed" style={{ color: MUTED }}>
          This is a simplified estimate for planning purposes, not legal or procurement advice.
          The actual RFP sets its own scoring formula within the federal policy&rsquo;s bounds —
          confirm against the specific solicitation before submitting a bid.
        </p>
      </section>
    </div>
  );
}

function StepHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-2xl" style={{ color: RED, fontFamily: "var(--font-heading)" }}>
        {number}
      </span>
      <h2 className="text-xl" style={{ color: INK, fontFamily: "var(--font-heading)" }}>
        {title}
      </h2>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs" style={{ color: MUTED }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function LedgerRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <span style={{ color: MUTED }}>{label}</span>
      <span className="text-right font-medium" style={{ color: INK }}>
        {value}
      </span>
    </div>
  );
}