import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { searchETF, getStockPrice, getPopularETFs } from "@/lib/market.functions";
import { Search, TrendingUp, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/etf-screener")({
  head: () => ({
    meta: [
      { title: "ETF Screener — FinanceHub USA" },
      { name: "description", content: "Search and track ETFs, see prices and performance." },
      { property: "og:title", content: "ETF Screener — FinanceHub USA" },
      { property: "og:url", content: "/etf-screener" },
    ],
    links: [{ rel: "canonical", href: "/etf-screener" }],
  }),
  component: ETFScreener,
});

function ETFScreener() {
  const [query, setQuery] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("SPY");

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["etf-search", query],
    queryFn: () => searchETF({ data: { query } }),
    enabled: query.length > 1,
  });

  const { data: etfData, isLoading: etfLoading, error: etfError } = useQuery({
    queryKey: ["etf-price", selectedSymbol],
    queryFn: () => getStockPrice({ data: { symbol: selectedSymbol } }),
    enabled: !!selectedSymbol,
    refetchInterval: 60000,
  });

  const { data: popularETFs, isLoading: popularLoading } = useQuery({
    queryKey: ["popular-etfs"],
    queryFn: () => getPopularETFs({}),
    refetchInterval: 60000,
  });

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">ETFs</p>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">ETF Screener</h1>
          <p className="mt-2 text-muted-foreground">Search and track ETFs, see prices and performance.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ETFs (e.g., SPY, QQQ, VTI)"
            className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm outline-none focus:border-ring"
          />
        </div>
        {searchLoading && <p className="mt-2 text-xs text-muted-foreground">Searching...</p>}
        {searchResults && searchResults.length > 0 && (
          <div className="mt-2 rounded-md border border-border bg-card p-2 max-h-60 overflow-y-auto">
            {searchResults.map((result: any) => (
              <button
                key={result.symbol}
                onClick={() => {
                  setSelectedSymbol(result.symbol);
                  setQuery("");
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-secondary"
              >
                <span className="font-semibold text-foreground">{result.symbol}</span>
                <span className="ml-2 text-muted-foreground">{result.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Popular ETFs */}
      <div className="mt-8">
        <h2 className="font-display text-xl font-bold text-foreground">Popular ETFs</h2>
        {popularLoading ? (
          <p className="mt-2 text-muted-foreground">Loading popular ETFs...</p>
        ) : popularETFs && popularETFs.length > 0 ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {popularETFs.map((etf: any) => (
              <button
                key={etf.symbol}
                onClick={() => setSelectedSymbol(etf.symbol)}
                className="rounded-lg border border-border bg-card p-3 text-center transition hover:border-accent hover:shadow-[var(--shadow-elegant)]"
              >
                <p className="font-semibold text-foreground">{etf.symbol}</p>
                <p className="text-sm text-muted-foreground">${etf.price.toFixed(2)}</p>
                <p className={`text-xs font-semibold ${etf.change >= 0 ? "text-success" : "text-danger"}`}>
                  {etf.change >= 0 ? "↑" : "↓"} {etf.changePercent}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-muted-foreground">No popular ETFs available.</p>
        )}
      </div>

      {/* ETF Data */}
      {etfLoading ? (
        <p className="mt-6 text-muted-foreground">Loading ETF data...</p>
      ) : etfError ? (
        <div className="mt-6 rounded-md bg-danger/10 p-4 text-sm text-danger">
          Error: {etfError.message}
        </div>
      ) : etfData ? (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{etfData.symbol}</p>
              <p className="mt-1 text-4xl font-bold text-foreground">${etfData.price.toFixed(2)}</p>
              <p className={`text-lg font-semibold ${etfData.change >= 0 ? "text-success" : "text-danger"}`}>
                {etfData.change >= 0 ? "↑" : "↓"} ${Math.abs(etfData.change).toFixed(2)} ({etfData.changePercent})
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Open</p>
                <p className="font-semibold text-foreground">${etfData.open.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">High</p>
                <p className="font-semibold text-foreground">${etfData.high.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Low</p>
                <p className="font-semibold text-foreground">${etfData.low.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Volume</p>
                <p className="font-semibold text-foreground">{etfData.volume.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-muted-foreground">Search for an ETF to see data.</p>
        </div>
      )}

      <div className="mt-8 rounded-lg border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
        <p>📊 Data updates every 60 seconds. Powered by Alpha Vantage API.</p>
      </div>
    </div>
  );
}