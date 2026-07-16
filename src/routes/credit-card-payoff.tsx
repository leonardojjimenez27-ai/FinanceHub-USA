import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const Route = createFileRoute("/credit-card-payoff")({
  head: () => ({
    meta: [
      { title: "Credit Card Payoff Calculator — FinanceHub USA" },
      { name: "description", content: "Calculate how long it will take to pay off your credit card debt and how much interest you'll save." },
      { property: "og:title", content: "Credit Card Payoff Calculator — FinanceHub USA" },
      { property: "og:url", content: "/credit-card-payoff" },
    ],
    links: [{ rel: "canonical", href: "/credit-card-payoff" }],
  }),
  component: CreditCardPayoffPage,
});

function CreditCardPayoffPage() {
  const [balance, setBalance] = useState(5000);
  const [rate, setRate] = useState(22);
  const [monthlyPayment, setMonthlyPayment] = useState(200);

  const result = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    let months = 0;
    let remaining = balance;
    let totalInterest = 0;
    let totalPaid = 0;
    let yearByYear: { month: number; remaining: number; interestPaid: number }[] = [];

    while (remaining > 0 && months < 600) {
      const interest = remaining * monthlyRate;
      totalInterest += interest;
      let payment = Math.min(monthlyPayment, remaining + interest);
      remaining = remaining + interest - payment;
      totalPaid += payment;
      months++;
      
      if (months % 12 === 0 || remaining <= 0) {
        yearByYear.push({ month: months, remaining: Math.max(remaining, 0), interestPaid: totalInterest });
      }
    }

    return { months, years: months / 12, totalInterest, totalPaid, remaining: Math.max(remaining, 0), yearByYear };
  }, [balance, rate, monthlyPayment]);

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Credit Card Payoff" }]} />
      <h1 className="mt-4 font-display text-4xl font-bold">Credit Card Payoff Calculator</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        See how long it will take to pay off your credit card debt and how much interest you'll save.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-5">
          <Slider label="Current Balance" prefix="$" value={balance} min={0} max={100000} step={100} onChange={setBalance} />
          <Slider label="Annual Interest Rate" suffix="%" value={rate} min={0} max={30} step={0.5} onChange={setRate} />
          <Slider label="Monthly Payment" prefix="$" value={monthlyPayment} min={10} max={10000} step={10} onChange={setMonthlyPayment} />
          <p className="text-xs text-muted-foreground">
            Paying more than the minimum payment saves you money on interest.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Payoff time</p>
          <p className="mt-2 font-display text-3xl font-bold text-foreground tabular-nums">
            {result.years < 1 ? `${Math.round(result.months)} months` : `${result.years.toFixed(1)} years`}
          </p>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <Row label="Total paid" value={formatUSD(result.totalPaid)} />
            <Row label="Total interest" value={formatUSD(result.totalInterest)} accent />
            <Row label="Final balance" value={formatUSD(result.remaining)} />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Assumes you make the same payment every month and don't make new purchases.
          </p>
        </div>
      </div>

      {/* Year by Year Table */}
      {result.yearByYear.length > 1 && (
        <div className="mt-8">
          <h3 className="font-display text-xl font-bold">Progress over time</h3>
          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3 text-left">Month</th>
                  <th className="p-3 text-left">Remaining Balance</th>
                  <th className="p-3 text-left">Interest Paid</th>
                </tr>
              </thead>
              <tbody>
                {result.yearByYear.map((row) => (
                  <tr key={row.month} className="border-t border-border">
                    <td className="p-3">{row.month}</td>
                    <td className="p-3">{formatUSD(row.remaining)}</td>
                    <td className="p-3">{formatUSD(row.interestPaid)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
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