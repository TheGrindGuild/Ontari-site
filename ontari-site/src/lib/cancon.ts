// Canadian-content bid estimator
//
// Modelled on the federal Policy on Prioritizing Canadian Suppliers and
// Canadian Content in Strategic Federal Procurements (effective Dec 16, 2025,
// threshold lowered to $5M on June 15, 2026):
//   - Qualifying Canadian suppliers get a 10% credit applied to their bid
//     price for evaluation purposes only (the real contract price is
//     untouched).
//   - Up to 25% of the total evaluation score is tied to the bidder's
//     committed Canadian content %.
//   - Applies to five strategic sectors, at contracts of $5M and up.
//
// This is a simplifying, linear model of the policy for estimation only.
// Actual RFPs set their own detailed scoring formula within the policy's
// bounds, so treat this as directional, not a substitute for reading the
// specific solicitation or getting procurement/legal advice.

export const STRATEGIC_SECTORS = [
  { key: "defence_security", label: "Defence and security" },
  { key: "health_pharma", label: "Health and pharmaceuticals" },
  { key: "infrastructure", label: "Infrastructure, construction and transportation" },
  { key: "ict", label: "Information and communications technology" },
  { key: "goods_materials", label: "Consumer and industrial goods and materials" },
] as const;

export type SectorKey = (typeof STRATEGIC_SECTORS)[number]["key"];

export const THRESHOLD_CAD = 5_000_000;
export const PRICE_CREDIT_PERCENT = 10;
export const MAX_CONTENT_SCORE_PERCENT = 25;
// How far apart (as a fraction of bid value) the line-item total and the
// stated bid value can be before we flag a mismatch to the user.
const MISMATCH_TOLERANCE = 0.01;

export interface CostLineItem {
  id: string;
  label: string;
  /** Total dollar amount for this line item, in CAD. */
  amount: number;
  /** What share of this line item's value is Canadian (0–100). */
  canadianPercent: number;
}

export interface CalculatorInput {
  bidValueCad: number;
  sector: SectorKey;
  /** Per the policy's supplier definition: a permanent, identifiable place of business in Canada. */
  hasPermanentCanadianPlaceOfBusiness: boolean;
  lineItems: CostLineItem[];
}

export interface CalculatorResult {
  totalCost: number;
  canadianContentPercent: number;
  thresholdMet: boolean;
  isQualifyingCanadianSupplier: boolean;
  priceCreditPercent: number;
  scoredPriceCad: number;
  contentScoreEarned: number;
  contentScoreMax: number;
  /** True when the line-item total and the stated bid value diverge meaningfully. */
  lineItemsMismatch: boolean;
}

export function calculate(input: CalculatorInput): CalculatorResult {
  const totalCost = input.lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const canadianWeighted = input.lineItems.reduce(
    (sum, item) => sum + (item.amount || 0) * ((item.canadianPercent || 0) / 100),
    0
  );
  const canadianContentPercent = totalCost > 0 ? (canadianWeighted / totalCost) * 100 : 0;

  const thresholdMet = input.bidValueCad >= THRESHOLD_CAD;
  const isQualifyingCanadianSupplier = thresholdMet && input.hasPermanentCanadianPlaceOfBusiness;

  const priceCreditPercent = isQualifyingCanadianSupplier ? PRICE_CREDIT_PERCENT : 0;
  const scoredPriceCad = input.bidValueCad * (1 - priceCreditPercent / 100);

  const contentScoreEarned = thresholdMet
    ? (canadianContentPercent / 100) * MAX_CONTENT_SCORE_PERCENT
    : 0;

  const lineItemsMismatch =
    input.bidValueCad > 0 &&
    totalCost > 0 &&
    Math.abs(totalCost - input.bidValueCad) / input.bidValueCad > MISMATCH_TOLERANCE;

  return {
    totalCost,
    canadianContentPercent,
    thresholdMet,
    isQualifyingCanadianSupplier,
    priceCreditPercent,
    scoredPriceCad,
    contentScoreEarned,
    contentScoreMax: MAX_CONTENT_SCORE_PERCENT,
    lineItemsMismatch,
  };
}

export function formatCad(value: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}