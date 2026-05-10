/** Shared display helpers — keep pages free of duplicate formatting logic. */

export function formatCompactCount(n: number): string {
  if (!Number.isFinite(n)) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1)}k`;
  if (n >= 1_000) return n.toLocaleString();
  return String(Math.round(n));
}

export function formatSignedPercent1dp(changePercent: number): string {
  const sign = changePercent > 0 ? "+" : "";
  return `${sign}${changePercent.toFixed(1)}%`;
}

export function formatSignedPercent2dp(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatLastSentLabel(iso: string | null, emptyLabel = "Not sent yet"): string {
  if (!iso) return emptyLabel;
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "—";
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export function formatShortDateTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "—";
  return d.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
}

/** Integer percent for compact UI (e.g. dashboard row). */
export function replyRatePercentInt(sent: number, replies: number): string {
  if (sent <= 0) return "0";
  return ((replies / sent) * 100).toFixed(0);
}

/** One decimal for detailed stats. */
export function replyRatePercent1dp(sent: number, replies: number): string {
  if (sent <= 0) return "0.0";
  return ((replies / sent) * 100).toFixed(1);
}
