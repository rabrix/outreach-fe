"use client";

type CampaignStatCellProps = {
  label: string;
  value: string;
};

export function CampaignStatCell({ label, value }: CampaignStatCellProps) {
  return (
    <div className="rounded-xl bg-secondary/40 px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-lg font-bold tabular-nums">{value}</p>
    </div>
  );
}
