import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const Route = createFileRoute("/retirement")({
  head: () => ({
    meta: [
      { title: "Retirement Calculator — FinanceHub USA" },
      { name: "description", content: "Calculate how much you need to save for retirement and how your savings will grow over time." },
      { property: "og:title", content: "Retirement Calculator — FinanceHub USA" },
      { property: "og:url", content: "/retirement" },
    ],
    links: [{ rel: "canonical", href: "/retirement" }],
  }),
  component: RetirementPage,
});

// ... (resto del código igual)
function RetirementPage() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [inflationRate, setInflationRate] = useState(3);

  const result = useMemo(() => {
    const years = retirementAge - currentAge;
    const r = annualReturn / 100 / 12;
    const n = years * 12;
    const futureValue = currentSavings * Math.pow(1 + r, n) + 
      monthlyContribution * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    
    const inflationAdjusted = futureValue / Math.pow(1 + inflationRate / 100, years);
    
    const retirementYears = 25;
    const monthlyIncome = inflationAdjusted / (retirementYears * 12);
    
    return {
      futureValue,
      inflationAdjusted,
      monthlyIncome,
      totalContributions: currentSavings + monthlyContribution * n,
      growth: futureValue - (currentSavings + monthlyContribution * n),
    };
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, annualReturn, inflationRate]);

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Retirement" }]} />
      <h1 className="mt-4 font-display text-4xl font-bold">Retirement Calculator</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Estimate how much you'll have saved by retirement and what your monthly income could be.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-5">
          <Slider label="Current Age" value={currentAge} min={18} max={70} step={1} onChange={setCurrentAge} />
          <Slider label="Retirement Age" value={retirementAge} min={50} max={80} step={1} onChange={setRetirementAge} />
          <Slider label="Current Savings" prefix="$" value={currentSavings} min={0} max={1000000} step={1000} onChange={setCurrentSavings} />
          <Slider label="Monthly Contribution" prefix="$" value={monthlyContribution} min={0} max={10000} step={50} onChange={setMonthlyContribution} />
          <Slider label="Annual Return" suffix="%" value={annualReturn} min={0} max={15} step={0.5} onChange={setAnnualReturn} />
          <Slider label="Inflation Rate" suffix="%" value={inflationRate} min={0} max={10} step={0.5} onChange={setInflationRate} />
          <p className="text-xs text-muted-foreground">
            Assumes contributions at the end of each month and a constant annual return, compounded monthly.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Retirement projection</p>
          <p className="mt-2 font-display text-3xl font-bold text-foreground tabular-nums">
            {formatUSD(result.futureValue)}
          </p>
          <p className="text-sm text-muted-foreground">Future value at retirement</p>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <Row label="Inflation adjusted" value={formatUSD(result.inflationAdjusted)} />
            <Row label="Monthly income (25 years)" value={formatUSD(result.monthlyIncome)} accent />
            <Row label="Total contributions" value={formatUSD(result.totalContributions)} />
            <Row label="Growth from returns" value={formatUSD(result.growth)} />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            The monthly income assumes you withdraw the inflation-adjusted amount over 25 years of retirement.
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