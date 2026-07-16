import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const Route = createFileRoute("/compound-interest")({
  head: () => ({
    meta: [
      { title: "Compound Interest Calculator — FinanceHub USA" },
      { name: "description", content: "Free compound interest calculator. See how your investments grow with monthly contributions and any annual return." },
      { property: "og:title", content: "Compound Interest Calculator — FinanceHub USA" },
      { property: "og:url", content: "/tools/compound-interest" },
    ],
    links: [{ rel: "canonical", href: "/tools/compound-interest" }],
  }),
  component: CompoundInterestPage,
});

function CompoundInterestPage() {
  const [principal, setPrincipal] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(20);

  const result = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    let balance = principal;
    for (let i = 0; i < n; i++) {
      balance = balance * (1 + r) + monthly;
    }
    const contributions = principal + monthly * n;
    return { final: balance, contributions, growth: balance - contributions };
  }, [principal, monthly, rate, years]);

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Compound Interest" }]} />
      <h1 className="mt-4 font-display text-4xl font-bold">Compound Interest Calculator</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        See how consistent investing plus market returns can compound into serious wealth.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <Slider label="Starting amount" prefix="$" value={principal} min={0} max={200000} step={500} onChange={setPrincipal} />
          <Slider label="Monthly contribution" prefix="$" value={monthly} min={0} max={5000} step={50} onChange={setMonthly} />
          <Slider label="Annual return" suffix="%" value={rate} min={0} max={15} step={0.1} onChange={setRate} />
          <Slider label="Years" value={years} min={1} max={50} step={1} onChange={setYears} />
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Projected balance</p>
          <p className="mt-2 font-display text-4xl font-bold text-foreground tabular-nums">
            {formatUSD(result.final)}
          </p>
          <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <Row label="Total contributions" value={formatUSD(result.contributions)} />
            <Row label="Growth from returns" value={formatUSD(result.growth)} accent />
            <Row label="Time horizon" value={`${years} years`} />
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            Assumes contributions at the end of each month and a constant annual return, compounded monthly.
          </p>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label, value, min, max, step, onChange, prefix, suffix,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (n: number) => void; prefix?: string; suffix?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-semibold text-foreground">{label}</label>
        <span className="tabular-nums text-sm text-muted-foreground">
          {prefix ?? ""}{value.toLocaleString()}{suffix ?? ""}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--color-accent)]"
      />
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`tabular-nums font-semibold ${accent ? "text-success" : "text-foreground"}`}>{value}</dd>
    </div>
  );
}

function formatUSD(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}