export function AdSlot({
  slot = "inline",
  className = "",
}: {
  slot?: "inline" | "sidebar" | "leaderboard";
  className?: string;
}) {
  // AdSense / Ezoic placeholder — replace with real ad code when approved.
  const label =
    slot === "sidebar" ? "300 × 250" : slot === "leaderboard" ? "728 × 90" : "Responsive Ad";
  return (
    <aside
      aria-label="Advertisement"
      data-ad-slot={slot}
      className={`grid place-items-center rounded-md border border-dashed border-border bg-muted/50 text-center text-xs uppercase tracking-wider text-muted-foreground ${
        slot === "leaderboard" ? "h-24" : slot === "sidebar" ? "h-64" : "h-32"
      } ${className}`}
    >
      <div>
        <div>Advertisement</div>
        <div className="mt-1 opacity-60">{label}</div>
      </div>
    </aside>
  );
}
