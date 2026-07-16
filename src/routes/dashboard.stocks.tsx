import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { searchStocks, getStockPrice } from "@/lib/market.functions";
import { Search } from "lucide-react";

export const Route = createFileRoute("/dashboard/stocks")({
  component: StockDashboard,
});

function StockDashboard() {
  const [query, setQuery] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["stock-search", query],
    queryFn: () => searchStocks({ data: { query } }),
    enabled: query.length > 1,
  });

  const { data: stockData, isLoading: stockLoading, error: stockError } = useQuery({
    queryKey: ["stock-price", selectedSymbol],
    queryFn: () => getStockPrice({ data: { symbol: selectedSymbol } }),
    enabled: !!selectedSymbol,
    refetchInterval: 60000,
  });

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground">Stock Dashboard</h2>
      <p className="mt-1 text-muted-foreground">Search and track US stock prices.</p>

      {/* Search Bar */}
      <div className="mt-4 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stocks (e.g., AAPL, TSLA, MSFT)"
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

      {/* Stock Data */}
      {stockLoading ? (
        <p className="mt-4 text-muted-foreground">Loading stock data...</p>
      ) : stockError ? (
        <div className="mt-4 rounded-md bg-danger/10 p-3 text-sm text-danger">
          Error: {stockError.message}
        </div>
      ) : stockData ? (
        <div className="mt-4 rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{stockData.symbol}</p>
              <p className="mt-1 text-3xl font-bold text-foreground">${stockData.price.toFixed(2)}</p>
              <p className={`text-lg font-semibold ${stockData.change >= 0 ? "text-success" : "text-danger"}`}>
                {stockData.change >= 0 ? "↑" : "↓"} ${Math.abs(stockData.change).toFixed(2)} ({stockData.changePercent})
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Open</p>
                <p className="font-semibold text-foreground">${stockData.open.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Previous Close</p>
                <p className="font-semibold text-foreground">${stockData.previousClose.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">High</p>
                <p className="font-semibold text-foreground">${stockData.high.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Low</p>
                <p className="font-semibold text-foreground">${stockData.low.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Volume</p>
                <p className="font-semibold text-foreground">{stockData.volume.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-muted-foreground">Search for a stock to see data.</p>
        </div>
      )}
    </div>
  );
}