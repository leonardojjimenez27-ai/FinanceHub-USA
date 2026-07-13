import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const Route = createFileRoute("/tools/loan")({
  head: () => ({
    meta: [
      { title: "Loan Calculator — FinanceHub USA" },
      { name: "description", content: "Personal, auto, and student loan calculator. See your monthly payment and total interest cost." },
      { property: "og:title", content: "Loan Calculator — FinanceHub USA" },
      { property: "og:url", content: "/tools/loan" },
    ],
    links: [{ rel: "canonical", href: "/tools/loan" }],
  }),
  component: LoanPage,
});

function LoanPage() {
  const [amount, setAmount] = useState(20000);
  const [rate, setRate] = useState(9.5);
  const [months, setMonths] = useState(60);

  const { monthly, total, interest } = useMemo(() => {
    const r = rate / 100 / 12;
    const m = r === 0 ? amount / months : (amount * r) / (1 - Math.pow(1 + r, -months));
    return { monthly: m, total: m * months, interest: m * months - amount };
  }, [amount, rate, months]);

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Loan" }]} />
      <h1 className="mt-4 font-display text-4xl font-bold">Loan Calculator</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Estimate the monthly payment and total interest cost on any fixed-rate installment loan.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <Field label="Loan amount" prefix="$">
            <input type="number" value={amount} step={100} onChange={(e) => setAmount(Number(e.target.value))} className="w-full bg-transparent px-2 py-2 outline-none tabular-nums" />
          </Field>
          <Field label="Interest rate" suffix="%">
            <input type="number" value={rate} step={0.05} onChange={(e) => setRate(Number(e.target.value))} className="w-full bg-transparent px-2 py-2 outline-none tabular-nums" />
          </Field>
          <Field label="Term (months)">
            <input type="number" value={months} step={1} onChange={(e) => setMonths(Number(e.target.value))} className="w-full bg-transparent px-2 py-2 outline-none tabular-nums" />
          </Field>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Monthly payment</p>
          <p className="mt-2 font-display text-4xl font-bold tabular-nums">{formatUSD(monthly)}</p>
          <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <Row label="Total paid" value={formatUSD(total)} />
            <Row label="Total interest" value={formatUSD(interest)} accent />
          </dl>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, children, prefix, suffix,
}: { label: string; children: React.ReactNode; prefix?: string; suffix?: string }) {
  return (
    <div>
      <label className="text-sm font-semibold text-foreground">{label}</label>
      <div className="mt-1 flex items-center rounded-md border border-input bg-background px-3">
        {prefix && <span className="text-muted-foreground">{prefix}</span>}
        {children}
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
