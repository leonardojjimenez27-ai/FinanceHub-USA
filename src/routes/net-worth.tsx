import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/net-worth")({
  head: () => ({
    meta: [
      { title: "Net Worth Calculator — FinanceHub USA" },
      { name: "description", content: "Calculate your net worth by totaling your assets and liabilities." },
      { property: "og:title", content: "Net Worth Calculator — FinanceHub USA" },
      { property: "og:url", content: "/net-worth" },
    ],
    links: [{ rel: "canonical", href: "/net-worth" }],
  }),
  component: NetWorthPage,
});

type Asset = { id: string; name: string; value: number };
type Liability = { id: string; name: string; value: number };

function NetWorthPage() {
  const [assets, setAssets] = useState<Asset[]>([
    { id: "1", name: "Home", value: 300000 },
    { id: "2", name: "Savings", value: 50000 },
    { id: "3", name: "Investments", value: 100000 },
  ]);
  const [liabilities, setLiabilities] = useState<Liability[]>([
    { id: "1", name: "Mortgage", value: 200000 },
    { id: "2", name: "Credit Card", value: 5000 },
  ]);

  const { totalAssets, totalLiabilities, netWorth } = useMemo(() => {
    const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + l.value, 0);
    return { totalAssets, totalLiabilities, netWorth: totalAssets - totalLiabilities };
  }, [assets, liabilities]);

  const addAsset = () => {
    const newAsset: Asset = { id: Date.now().toString(), name: "", value: 0 };
    setAssets([...assets, newAsset]);
  };

  const addLiability = () => {
    const newLiability: Liability = { id: Date.now().toString(), name: "", value: 0 };
    setLiabilities([...liabilities, newLiability]);
  };

  const updateAsset = (id: string, field: keyof Asset, value: string | number) => {
    setAssets(assets.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const updateLiability = (id: string, field: keyof Liability, value: string | number) => {
    setLiabilities(liabilities.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const removeAsset = (id: string) => {
    setAssets(assets.filter(a => a.id !== id));
  };

  const removeLiability = (id: string) => {
    setLiabilities(liabilities.filter(l => l.id !== id));
  };

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Net Worth" }]} />
      <h1 className="mt-4 font-display text-4xl font-bold">Net Worth Calculator</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Calculate your net worth by adding all your assets and subtracting your liabilities.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Assets */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-success">Assets</h2>
            <button
              onClick={addAsset}
              className="inline-flex items-center gap-1 rounded-md bg-success/10 px-3 py-1.5 text-sm font-semibold text-success hover:bg-success/20"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {assets.map((asset) => (
              <div key={asset.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={asset.name}
                  onChange={(e) => updateAsset(asset.id, "name", e.target.value)}
                  placeholder="Asset name"
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
                />
                <input
                  type="number"
                  value={asset.value || ""}
                  onChange={(e) => updateAsset(asset.id, "value", Number(e.target.value))}
                  placeholder="0"
                  className="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
                />
                <button
                  onClick={() => removeAsset(asset.id)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <div className="flex justify-between text-sm font-semibold">
              <span>Total Assets</span>
              <span className="text-success">{formatUSD(totalAssets)}</span>
            </div>
          </div>
        </div>

        {/* Liabilities */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-danger">Liabilities</h2>
            <button
              onClick={addLiability}
              className="inline-flex items-center gap-1 rounded-md bg-danger/10 px-3 py-1.5 text-sm font-semibold text-danger hover:bg-danger/20"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {liabilities.map((liability) => (
              <div key={liability.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={liability.name}
                  onChange={(e) => updateLiability(liability.id, "name", e.target.value)}
                  placeholder="Liability name"
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
                />
                <input
                  type="number"
                  value={liability.value || ""}
                  onChange={(e) => updateLiability(liability.id, "value", Number(e.target.value))}
                  placeholder="0"
                  className="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
                />
                <button
                  onClick={() => removeLiability(liability.id)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <div className="flex justify-between text-sm font-semibold">
              <span>Total Liabilities</span>
              <span className="text-danger">{formatUSD(totalLiabilities)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Net Worth Result */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Your Net Worth</p>
        <p className={`mt-2 font-display text-5xl font-bold ${netWorth >= 0 ? "text-success" : "text-danger"}`}>
          {formatUSD(netWorth)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {netWorth >= 0 ? "You have a positive net worth. Keep building!" : "Focus on reducing your liabilities."}
        </p>
      </div>
    </div>
  );
}

function formatUSD(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}