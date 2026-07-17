import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getCryptoPrices, getFearGreedIndex } from "@/lib/market.functions";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Market Dashboard — FinanceHub USA" },
      { name: "description", content: "Real-time market data, cryptocurrency prices, and Fear & Greed index." },
      { property: "og:title", content: "Market Dashboard — FinanceHub USA" },
      { property: "og:url", content: "/dashboard" },
    ],
    links: [{ rel: "canonical", href: "/dashboard" }],
  }),
  component: DashboardLayout,
});

function DashboardLayout() {
  const { data: cryptos, isLoading: cryptosLoading, error: cryptosError } = useQuery({
    queryKey: ["cryptos"],
    queryFn: () => getCryptoPrices({}),
    refetchInterval: 60000,
  });

  const { data: fearGreed, isLoading: fgLoading } = useQuery({
    queryKey: ["fear-greed"],
    queryFn: () => getFearGreedIndex({}),
    refetchInterval: 3600000,
  });

  // ✅ Verificar si estamos en el cliente antes de usar window
  const isClient = typeof window !== "undefined";
  const isCryptoPage = isClient && window.location.pathname.includes("/dashboard/crypto");
  const isStocksPage = isClient && window.location.pathname.includes("/dashboard/stocks");
  const showCryptos = !isCryptoPage && !isStocksPage;

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Market Dashboard</p>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Real-Time Markets</h1>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard" className="rounded-md border border-input px-4 py-2 text-sm font-semibold hover:bg-muted">
            Overview
          </Link>
          <Link to="/dashboard/crypto" className="rounded-md border border-input px-4 py-2 text-sm font-semibold hover:bg-muted">
            Crypto
          </Link>
          <Link to="/dashboard/stocks" className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:brightness-95">
            Stocks
          </Link>
        </div>
      </div>

      {/* Fear & Greed Index */}
      {!fgLoading && fearGreed && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Fear & Greed Index</p>
              <p className="mt-1 text-4xl font-bold text-foreground">{fearGreed.current.value}</p>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${
                fearGreed.current.classification === "Extreme Fear" || fearGreed.current.classification === "Fear"
                  ? "text-danger"
                  : fearGreed.current.classification === "Greed" || fearGreed.current.classification === "Extreme Greed"
                  ? "text-success"
                  : "text-warning"
              }`}>
                {fearGreed.current.classification}
              </p>
              <p className="text-xs text-muted-foreground">Updated: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Aquí se renderiza el contenido de las rutas hijas (crypto, stocks) */}
      <div className="mt-8">
        <Outlet />
      </div>

      {/* Mostrar criptos solo en la página principal de dashboard */}
      {showCryptos && (
        <>
          <h2 className="font-display text-2xl font-bold text-foreground">Top Cryptocurrencies</h2>
          {cryptosLoading ? (
            <p className="mt-4 text-muted-foreground">Loading crypto data...</p>
          ) : cryptosError ? (
            <p className="mt-4 text-danger">Error loading crypto data: {cryptosError.message}</p>
          ) : cryptos && cryptos.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {cryptos.slice(0, 8).map((coin: any) => (
                <div key={coin.id} className="rounded-lg border border-border bg-card p-4 transition hover:shadow-[var(--shadow-elegant)]">
                  <div className="flex items-center gap-2">
                    <img src={coin.image} alt={coin.name} className="h-6 w-6 rounded-full" />
                    <div>
                      <p className="font-semibold text-foreground">{coin.symbol}</p>
                      <p className="text-xs text-muted-foreground">{coin.name}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xl font-bold text-foreground">${coin.price.toLocaleString()}</p>
                  <p className={`text-sm font-semibold ${coin.change24h >= 0 ? "text-success" : "text-danger"}`}>
                    {coin.change24h >= 0 ? "↑" : "↓"} {coin.change24h.toFixed(2)}%
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Market Cap: ${(coin.marketCap / 1e9).toFixed(2)}B</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-muted-foreground">No crypto data available</p>
          )}
        </>
      )}

      <div className="mt-8 rounded-lg border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
        <p>📊 Data updates every 60 seconds. Cryptocurrency data from CoinGecko, Fear & Greed from Alternative.me.</p>
      </div>
    </div>
  );
}