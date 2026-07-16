import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator, TrendingUp, Home, CreditCard, PiggyBank, LineChart, Percent, Wallet, Coins, ShieldAlert, LayoutDashboard, BarChart3, Bitcoin } from "lucide-react";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Free Financial Calculators — FinanceHub USA" },
      {
        name: "description",
        content:
          "Free US financial calculators: compound interest, mortgage, loan, retirement, savings, investment, inflation, net worth, credit card payoff, and emergency fund.",
      },
      { property: "og:title", content: "Free Financial Calculators — FinanceHub USA" },
      { property: "og:description", content: "10 free calculators to help you plan, save, and invest smarter." },
      { property: "og:url", content: "/tools" },
    ],
    links: [{ rel: "canonical", href: "/tools" }],
  }),
  component: ToolsIndex,
});

const TOOLS = [
  { slug: "compound-interest", name: "Compound Interest", desc: "See how your money grows over time.", icon: TrendingUp, live: true, path: "/compound-interest" },
  { slug: "mortgage", name: "Mortgage", desc: "Estimate your monthly mortgage payment.", icon: Home, live: true, path: "/mortgage" },
  { slug: "loan", name: "Loan", desc: "Personal or auto loan payment calculator.", icon: CreditCard, live: true, path: "/loan" },
  { slug: "retirement", name: "Retirement", desc: "How much will you have at retirement?", icon: PiggyBank, live: true, path: "/retirement" },
  { slug: "savings", name: "Savings", desc: "Reach any savings goal with a plan.", icon: Wallet, live: true, path: "/savings" },
  { slug: "investment", name: "Investment", desc: "Project stock and ETF returns.", icon: LineChart, live: true, path: "/investment" },
  { slug: "inflation", name: "Inflation", desc: "See how inflation affects buying power.", icon: Percent, live: true, path: "/inflation" },
  { slug: "net-worth", name: "Net Worth", desc: "Calculate your total net worth.", icon: Coins, live: true, path: "/net-worth" },
  { slug: "credit-card-payoff", name: "Credit Card Payoff", desc: "Escape credit card debt fast.", icon: CreditCard, live: true, path: "/credit-card-payoff" },
  { slug: "emergency-fund", name: "Emergency Fund", desc: "How much do you really need saved?", icon: ShieldAlert, live: true, path: "/emergency-fund" },
];

const DASHBOARDS = [
  { slug: "dashboard", name: "Market Dashboard", desc: "Real-time crypto and market data.", icon: LayoutDashboard, path: "/dashboard" },
  { slug: "dashboard/crypto", name: "Crypto Dashboard", desc: "Top cryptocurrencies live prices.", icon: Bitcoin, path: "/dashboard/crypto" },
  { slug: "dashboard/stocks", name: "Stock Dashboard", desc: "Search and track US stocks.", icon: BarChart3, path: "/dashboard/stocks" },
];

function ToolsIndex() {
  return (
    <div className="container-page py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">Free tools</p>
      <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Financial Calculators</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Interactive calculators to help you plan, save, and invest with confidence — no signup required.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          const card = (
            <div className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 transition hover:border-accent hover:shadow-[var(--shadow-elegant)]">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-primary text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="font-display text-lg font-bold text-foreground group-hover:text-primary">
                  {t.name}
                </h2>
              </div>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{t.desc}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide">
                <span className="text-accent">Open calculator →</span>
              </p>
            </div>
          );
          return (
            <Link key={t.slug} to={t.path as any}>
              {card}
            </Link>
          );
        })}
      </div>

      {/* Dashboards Section */}
      <div className="mt-16">
        <div className="mb-6 flex items-end justify-between border-b border-border pb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Market Data</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-foreground md:text-3xl">
              Live Dashboards
            </h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DASHBOARDS.map((d) => {
            const Icon = d.icon;
            const card = (
              <div className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 transition hover:border-accent hover:shadow-[var(--shadow-elegant)]">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-md bg-accent text-accent-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="font-display text-lg font-bold text-foreground group-hover:text-primary">
                    {d.name}
                  </h2>
                </div>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{d.desc}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide">
                  <span className="text-accent">Open dashboard →</span>
                </p>
              </div>
            );
            return (
              <Link key={d.slug} to={d.path as any}>
                {card}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-10 flex items-center gap-2 rounded-lg border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
        <Calculator className="h-4 w-4 text-accent" />
        Calculators use simplified formulas for illustrative purposes. Always consult a financial
        professional for personalized advice.
      </div>
    </div>
  );
}