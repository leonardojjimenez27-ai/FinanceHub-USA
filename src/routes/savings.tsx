import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const Route = createFileRoute("/savings")({
  head: () => ({
    meta: [
      { title: "Savings Goal Calculator — FinanceHub USA" },
      { name: "description", content: "Calculate how long it will take to reach your savings goal and how much to save each month." },
      { property: "og:title", content: "Savings Goal Calculator — FinanceHub USA" },
      { property: "og:url", content: "/savings" },
    ],
    links: [{ rel: "canonical", href: "/savings" }],
  }),
  component: SavingsPage,
});

// ... (resto del código igual)
function SavingsPage() {
  const [goal, setGoal] = useState(100000);
  const [currentSavings, setCurrentSavings] = useState(10000);
  const [monthlySavings, setMonthlySavings] = useState(1000);
  const [interestRate, setInterestRate] = useState(4);

  const result = useMemo(() => {
    const r = interestRate / 100 / 12;
    let months = 0;
    let balance = currentSavings;
    while (balance < goal && months < 600) {
      balance = balance * (1 + r) + monthlySavings;
      months++;
    }
    const totalContributions = currentSavings + monthlySavings * months;
    return { months, years: months / 12, balance, totalContributions, growth: balance - totalContributions };
  }, [goal, currentSavings, monthlySavings, interestRate]);

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Savings" }]} />
      <h1 className="mt-4 font-display text-4xl font-bold">Savings Goal Calculator</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Calculate how long it will take to reach your savings goal with monthly contributions.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-5">
          <Slider label="Savings Goal" prefix="$" value={goal} min={1000} max={1000000} step={1000} onChange={setGoal} />
          <Slider label="Current Savings" prefix="$" value={currentSavings} min={0} max={500000} step={500} onChange={setCurrentSavings} />
          <Slider label="Monthly Contribution" prefix="$" value={monthlySavings} min={0} max={10000} step={50} onChange={setMonthlySavings} />
          <Slider label="Interest Rate" suffix="%" value={interestRate} min={0} max={10} step={0.5} onChange={setInterestRate} />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Time to reach goal</p>
          <p className="mt-2 font-display text-4xl font-bold text-foreground tabular-nums">
            {result.years < 1 ? `${Math.round(result.months)} months` : `${result.years.toFixed(1)} years`}
          </p>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <Row label="Final balance" value={formatUSD(result.balance)} />
            <Row label="Total contributions" value={formatUSD(result.totalContributions)} />
            <Row label="Growth from interest" value={formatUSD(result.growth)} accent />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Assumes monthly compounding and a constant interest rate.
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