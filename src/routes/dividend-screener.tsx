import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getDividendData, searchStocks } from "@/lib/market.functions";
import { Search, TrendingUp, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/dividend-screener")({
  head: () => ({
    meta: [
      { title: "Dividend Screener — FinanceHub USA" },
      { name: "description", content: "Find stocks with high dividend yields and track dividend payments." },
      { property: "og:title", content: "Dividend Screener — FinanceHub USA" },
      { property: "og:url", content: "/dividend-screener" },
    ],
    links: [{ rel: "canonical", href: "/dividend-screener" }],
  }),
  component: DividendScreener,
});

function DividendScreener() {
  const [query, setQuery] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["stock-search", query],
    queryFn: () => searchStocks({ data: { query } }),
    enabled: query.length > 1,
  });

  const { data: dividendData, isLoading: dividendLoading, error: dividendError } = useQuery({
    queryKey: ["dividend", selectedSymbol],
    queryFn: () => getDividendData({ data: { symbol: selectedSymbol } }),
    enabled: !!selectedSymbol,
    refetchInterval: 60000,
  });

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Dividends</p>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Dividend Screener</h1>
          <p className="mt-2 text-muted-foreground">Find stocks with high dividend yields and track dividend payments.</p>
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
            placeholder="Search stocks (e.g., AAPL, KO, JNJ)"
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

      {/* Dividend Data */}
      {dividendLoading ? (
        <p className="mt-6 text-muted-foreground">Loading dividend data...</p>
      ) : dividendError ? (
        <div className="mt-6 rounded-md bg-danger/10 p-4 text-sm text-danger">
          Error: {dividendError.message}
        </div>
      ) : dividendData ? (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{dividendData.symbol}</p>
              <p className="mt-1 text-3xl font-bold text-foreground">${dividendData.price.toFixed(2)}</p>
              <p className={`text-sm font-semibold ${dividendData.change >= 0 ? "text-success" : "text-danger"}`}>
                {dividendData.change >= 0 ? "↑" : "↓"} ${Math.abs(dividendData.change).toFixed(2)} ({dividendData.changePercent})
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-muted-foreground">Dividend Yield</p>
                <p className="text-2xl font-bold text-success">{dividendData.dividendYield}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Dividend Per Share</p>
                <p className="text-xl font-bold text-foreground">${dividendData.dividendPerShare}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payout Ratio</p>
                <p className="font-semibold text-foreground">{dividendData.payoutRatio}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Ex-Dividend Date</p>
                <p className="font-semibold text-foreground">{dividendData.exDividendDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Dividend Date</p>
                <p className="font-semibold text-foreground">{dividendData.dividendDate}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-muted-foreground">Search for a stock to see dividend data.</p>
        </div>
      )}

      {/* Top Dividend Stocks (sugerencias) */}
      <div className="mt-8">
        <h3 className="font-display text-lg font-bold text-foreground">Top Dividend Stocks</h3>
        <p className="text-sm text-muted-foreground">Try searching for these high-yield stocks:</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["KO", "JNJ", "PG", "XOM", "CVX", "PFE", "T", "VZ", "IBM", "MO"].map((symbol) => (
            <button
              key={symbol}
              onClick={() => setSelectedSymbol(symbol)}
              className="rounded-full border border-border px-4 py-1.5 text-sm hover:bg-secondary"
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
        <p>📊 Dividend data powered by Alpha Vantage API.</p>
      </div>
    </div>
  );
}