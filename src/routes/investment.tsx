import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const Route = createFileRoute("/investment")({
  head: () => ({
    meta: [
      { title: "Investment Calculator — FinanceHub USA" },
      { name: "description", content: "Project the future value of your investments with different contribution scenarios." },
      { property: "og:title", content: "Investment Calculator — FinanceHub USA" },
      { property: "og:url", content: "/investment" },
    ],
    links: [{ rel: "canonical", href: "/investment" }],
  }),
  component: InvestmentPage,
});

// ... (resto del código igual)
function InvestmentPage() {
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [returnRate, setReturnRate] = useState(8);
  const [years, setYears] = useState(20);

  const result = useMemo(() => {
    const r = returnRate / 100 / 12;
    const n = years * 12;
    const futureValue = initial * Math.pow(1 + r, n) + monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const totalContributions = initial + monthly * n;
    const growth = futureValue - totalContributions;
    return { futureValue, totalContributions, growth };
  }, [initial, monthly, returnRate, years]);

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Investment" }]} />
      <h1 className="mt-4 font-display text-4xl font-bold">Investment Calculator</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Project the future value of your investments with compound growth.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-5">
          <Slider label="Initial Investment" prefix="$" value={initial} min={0} max={1000000} step={500} onChange={setInitial} />
          <Slider label="Monthly Contribution" prefix="$" value={monthly} min={0} max={10000} step={50} onChange={setMonthly} />
          <Slider label="Annual Return" suffix="%" value={returnRate} min={0} max={20} step={0.5} onChange={setReturnRate} />
          <Slider label="Time Horizon" suffix=" years" value={years} min={1} max={50} step={1} onChange={setYears} />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Projected value</p>
          <p className="mt-2 font-display text-4xl font-bold text-foreground tabular-nums">
            {formatUSD(result.futureValue)}
          </p>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <Row label="Total contributions" value={formatUSD(result.totalContributions)} />
            <Row label="Investment growth" value={formatUSD(result.growth)} accent />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Assumes monthly compounding and a constant annual return.
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