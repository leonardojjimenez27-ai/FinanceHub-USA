import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const Route = createFileRoute("/mortgage")({
  head: () => ({
    meta: [
      { title: "Mortgage Calculator — FinanceHub USA" },
      { name: "description", content: "Free mortgage calculator: estimate your monthly principal and interest payment and total loan cost." },
      { property: "og:title", content: "Mortgage Calculator — FinanceHub USA" },
      { property: "og:url", content: "/mortgage" },
    ],
    links: [{ rel: "canonical", href: "/mortgage" }],
  }),
  component: MortgagePage,
});

// ... (resto del código igual que antes)
function MortgagePage() {
  const [home, setHome] = useState(400000);
  const [down, setDown] = useState(80000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);

  const { monthly, total, interest } = useMemo(() => {
    const p = Math.max(home - down, 0);
    const r = rate / 100 / 12;
    const n = years * 12;
    const m = r === 0 ? p / n : (p * r) / (1 - Math.pow(1 + r, -n));
    return { monthly: m, total: m * n, interest: m * n - p };
  }, [home, down, rate, years]);

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Mortgage" }]} />
      <h1 className="mt-4 font-display text-4xl font-bold">Mortgage Calculator</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Estimate your monthly mortgage payment (principal + interest) and total loan cost.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <NumberField label="Home price" prefix="$" value={home} onChange={setHome} />
          <NumberField label="Down payment" prefix="$" value={down} onChange={setDown} />
          <NumberField label="Interest rate" suffix="%" value={rate} onChange={setRate} step={0.05} />
          <NumberField label="Loan term (years)" value={years} onChange={setYears} step={1} />
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Monthly payment</p>
          <p className="mt-2 font-display text-4xl font-bold text-foreground tabular-nums">
            {formatUSD(monthly)}
          </p>
          <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <Row label="Loan amount" value={formatUSD(home - down)} />
            <Row label="Total paid" value={formatUSD(total)} />
            <Row label="Total interest" value={formatUSD(interest)} accent />
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            Excludes property taxes, homeowners insurance, and PMI.
          </p>
        </div>
      </div>
    </div>
  );
}

function NumberField({
  label, value, onChange, prefix, suffix, step = 1000,
}: {
  label: string; value: number; onChange: (n: number) => void; prefix?: string; suffix?: string; step?: number;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-foreground">{label}</label>
      <div className="mt-1 flex items-center rounded-md border border-input bg-background px-3">
        {prefix && <span className="text-muted-foreground">{prefix}</span>}
        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent px-2 py-2 text-base outline-none tabular-nums"
        />
        {suffix && <span className="text-muted-foreground">{suffix}</span>}
      </div>
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