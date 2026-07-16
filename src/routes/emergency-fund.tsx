import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const Route = createFileRoute("/emergency-fund")({
  head: () => ({
    meta: [
      { title: "Emergency Fund Calculator — FinanceHub USA" },
      { name: "description", content: "Calculate how much you need for your emergency fund and how long it will take to save it." },
      { property: "og:title", content: "Emergency Fund Calculator — FinanceHub USA" },
      { property: "og:url", content: "/emergency-fund" },
    ],
    links: [{ rel: "canonical", href: "/emergency-fund" }],
  }),
  component: EmergencyFundPage,
});

function EmergencyFundPage() {
  const [monthlyExpenses, setMonthlyExpenses] = useState(3000);
  const [months, setMonths] = useState(6);
  const [currentSavings, setCurrentSavings] = useState(5000);
  const [monthlySaving, setMonthlySaving] = useState(500);

  const result = useMemo(() => {
    const goal = monthlyExpenses * months;
    const remaining = goal - currentSavings;
    const monthsToSave = remaining > 0 && monthlySaving > 0 ? Math.ceil(remaining / monthlySaving) : 0;
    const yearsToSave = monthsToSave / 12;
    
    return { goal, remaining, monthsToSave, yearsToSave, currentSavings };
  }, [monthlyExpenses, months, currentSavings, monthlySaving]);

  const progress = Math.min((result.currentSavings / result.goal) * 100, 100);

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Emergency Fund" }]} />
      <h1 className="mt-4 font-display text-4xl font-bold">Emergency Fund Calculator</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Calculate how much you need for your emergency fund and how long it will take to save it.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-5">
          <Slider label="Monthly Expenses" prefix="$" value={monthlyExpenses} min={500} max={20000} step={100} onChange={setMonthlyExpenses} />
          <Slider label="Months of Expenses" value={months} min={1} max={12} step={1} onChange={setMonths} />
          <Slider label="Current Savings" prefix="$" value={currentSavings} min={0} max={100000} step={500} onChange={setCurrentSavings} />
          <Slider label="Monthly Saving" prefix="$" value={monthlySaving} min={0} max={10000} step={50} onChange={setMonthlySaving} />
          <p className="text-xs text-muted-foreground">
            Financial experts recommend 3-6 months of expenses for an emergency fund.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Emergency Fund Goal</p>
          <p className="mt-2 font-display text-3xl font-bold text-foreground tabular-nums">
            {formatUSD(result.goal)}
          </p>
          <p className="text-sm text-muted-foreground">{months} months of expenses</p>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-secondary">
              <div 
                className="h-2 rounded-full bg-accent transition-all" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <Row label="Current savings" value={formatUSD(result.currentSavings)} />
            <Row label="Amount needed" value={formatUSD(result.remaining)} accent />
            <Row label="Time to save" value={result.monthsToSave > 0 
              ? `${result.monthsToSave} months (${result.yearsToSave.toFixed(1)} years)` 
              : "Goal reached! 🎉"} 
            />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            This calculator assumes you save the same amount every month.
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
      <dd className={`tabular-nums font-semibold ${accent ? "text-accent" : "text-foreground"}`}>{value}</dd>
    </div>
  );
}

function formatUSD(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}