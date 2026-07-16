import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const Route = createFileRoute("/inflation")({
  head: () => ({
    meta: [
      { title: "Inflation Calculator — FinanceHub USA" },
      { name: "description", content: "See how inflation affects your purchasing power over time." },
      { property: "og:title", content: "Inflation Calculator — FinanceHub USA" },
      { property: "og:url", content: "/inflation" },
    ],
    links: [{ rel: "canonical", href: "/inflation" }],
  }),
  component: InflationPage,
});

// ... (resto del código igual)
function InflationPage() {
  const [amount, setAmount] = useState(1000);
  const [inflationRate, setInflationRate] = useState(3);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const futureValue = amount * Math.pow(1 + inflationRate / 100, years);
    const loss = futureValue - amount;
    const purchasingPower = amount / Math.pow(1 + inflationRate / 100, years);
    return { futureValue, loss, purchasingPower };
  }, [amount, inflationRate, years]);

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Inflation" }]} />
      <h1 className="mt-4 font-display text-4xl font-bold">Inflation Calculator</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        See how inflation affects your purchasing power over time.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-5">
          <Slider label="Amount Today" prefix="$" value={amount} min={100} max={100000} step={100} onChange={setAmount} />
          <Slider label="Inflation Rate" suffix="%" value={inflationRate} min={0} max={15} step={0.5} onChange={setInflationRate} />
          <Slider label="Years" value={years} min={1} max={50} step={1} onChange={setYears} />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Future value</p>
          <p className="mt-2 font-display text-4xl font-bold text-foreground tabular-nums">
            {formatUSD(result.futureValue)}
          </p>
          <p className="text-sm text-muted-foreground">Amount needed to maintain purchasing power</p>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <Row label="Initial amount" value={formatUSD(amount)} />
            <Row label="Inflation impact" value={formatUSD(result.loss)} accent />
            <Row label="Future purchasing power" value={formatUSD(result.purchasingPower)} />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            This shows how much an item that costs ${amount.toLocaleString()} today will cost in {years} years with {inflationRate}% annual inflation.
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
      <dd className={`tabular-nums font-semibold ${accent ? "text-danger" : "text-foreground"}`}>{value}</dd>
    </div>
  );
}

function formatUSD(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}