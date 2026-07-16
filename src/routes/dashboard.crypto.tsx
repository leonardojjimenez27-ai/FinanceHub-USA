import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getCryptoPrices } from "@/lib/market.functions";
import { ArrowUp, ArrowDown } from "lucide-react";

export const Route = createFileRoute("/dashboard/crypto")({
  head: () => ({
    meta: [
      { title: "Crypto Dashboard — FinanceHub USA" },
      { name: "description", content: "Live cryptocurrency prices, market cap, and 24h changes." },
      { property: "og:title", content: "Crypto Dashboard — FinanceHub USA" },
      { property: "og:url", content: "/dashboard/crypto" },
    ],
    links: [{ rel: "canonical", href: "/dashboard/crypto" }],
  }),
  component: CryptoDashboard,
});

function CryptoDashboard() {
  const { data: cryptos, isLoading, error } = useQuery({
    queryKey: ["cryptos"],
    queryFn: () => getCryptoPrices({}),
    refetchInterval: 30000,
  });

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Cryptocurrency</p>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Crypto Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Live prices, market cap, and 24h changes for top cryptocurrencies.</p>
        </div>
      </div>

      {isLoading ? (
        <p className="mt-8 text-muted-foreground">Loading crypto data...</p>
      ) : error ? (
        <p className="mt-8 text-danger">Error loading data: {error.message}</p>
      ) : cryptos && cryptos.length > 0 ? (
        <div className="mt-8 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">24h Change</th>
                <th className="p-3 text-left">Market Cap</th>
                <th className="p-3 text-left">Volume (24h)</th>
              </tr>
            </thead>
            <tbody>
              {cryptos.map((coin: any, index: number) => (
                <tr key={coin.id} className="border-t border-border hover:bg-secondary/40">
                  <td className="p-3 text-muted-foreground">{index + 1}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <img src={coin.image} alt={coin.name} className="h-6 w-6 rounded-full" />
                      <div>
                        <p className="font-semibold text-foreground">{coin.name}</p>
                        <p className="text-xs text-muted-foreground">{coin.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-foreground">${coin.price.toLocaleString()}</td>
                  <td className={`p-3 font-semibold ${coin.change24h >= 0 ? "text-success" : "text-danger"}`}>
                    {coin.change24h >= 0 ? "↑" : "↓"} {coin.change24h.toFixed(2)}%
                  </td>
                  <td className="p-3 text-muted-foreground">${(coin.marketCap / 1e9).toFixed(2)}B</td>
                  <td className="p-3 text-muted-foreground">${(coin.volume / 1e6).toFixed(0)}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-8 text-muted-foreground">No crypto data available</p>
      )}

      <div className="mt-8 rounded-lg border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
        <p>📊 Data updates every 30 seconds. Powered by CoinGecko API.</p>
      </div>
    </div>
  );
}