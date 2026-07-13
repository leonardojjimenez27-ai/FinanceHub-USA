import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { TrendingUp, TrendingDown, ArrowRight, Sparkles } from "lucide-react";
import { getHomeData } from "@/lib/content.functions";
import { ArticleCard } from "@/components/site/ArticleCard";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { AdSlot } from "@/components/site/AdSlot";
import { CATEGORIES } from "@/lib/categories";

const homeOptions = () =>
  queryOptions({
    queryKey: ["home"],
    queryFn: () => getHomeData(),
  });

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(homeOptions());
  },
  component: HomePage,
});

// Static placeholder market snapshot until a live data API is plugged in.
const MARKET_SNAPSHOT = [
  { name: "S&P 500", value: "5,842.31", change: "+0.42%", up: true },
  { name: "Dow Jones", value: "42,978.15", change: "+0.18%", up: true },
  { name: "Nasdaq", value: "18,530.66", change: "-0.09%", up: false },
  { name: "Russell 2000", value: "2,297.42", change: "+0.71%", up: true },
  { name: "10-Yr Yield", value: "4.28%", change: "-0.03", up: false },
  { name: "Bitcoin", value: "$97,412", change: "+1.24%", up: true },
  { name: "Ethereum", value: "$3,485", change: "+0.83%", up: true },
  { name: "Gold", value: "$2,712", change: "+0.31%", up: true },
];

function HomePage() {
  const { data } = useSuspenseQuery(homeOptions());
  const { latest, featured, trending } = data;
  const hero = featured[0] ?? latest[0];
  const secondary = (featured.length > 1 ? featured.slice(1) : latest.slice(1)).slice(0, 4);
  const rest = latest.slice(0, 8);

  return (
    <>
      {/* Market ticker */}
      <div className="border-b border-border bg-primary text-primary-foreground">
        <div className="container-page flex items-center gap-6 overflow-x-auto py-2 text-xs font-medium">
          {MARKET_SNAPSHOT.map((m) => (
            <div key={m.name} className="flex flex-none items-center gap-2">
              <span className="opacity-80">{m.name}</span>
              <span className="font-semibold">{m.value}</span>
              <span
                className={`flex items-center gap-0.5 ${
                  m.up ? "text-accent" : "text-danger"
                }`}
              >
                {m.up ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {m.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="container-page py-8">
        {hero ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ArticleCard article={heroArticle(hero)} variant="large" />
            </div>
            <div className="grid gap-4">
              {secondary.map((a: any) => (
                <ArticleCard key={a.slug} article={heroArticle(a)} variant="compact" />
              ))}
              {secondary.length === 0 && <EmptyPitch />}
            </div>
          </div>
        ) : (
          <EmptyHero />
        )}
      </section>

      <AdSlot slot="leaderboard" className="container-page mb-8" />

      {/* Latest news */}
      <section className="container-page">
        <SectionHeader
          eyebrow="Just in"
          title="Latest Financial News"
          href="/category/news"
        />
        {rest.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {rest.map((a: any) => (
              <ArticleCard key={a.slug} article={heroArticle(a)} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No articles yet. Sign in and open the <Link to="/admin" className="underline">admin</Link> to publish your first story.
          </p>
        )}
      </section>

      {/* Trending topics grid */}
      <section className="container-page mt-14">
        <SectionHeader
          eyebrow="Explore"
          title="Trending Topics"
        />
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to="/category/$slug"
              params={{ slug: cat.slug }}
              className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 transition hover:border-accent hover:shadow-[var(--shadow-elegant)]"
            >
              <div>
                <div className="font-display text-base font-semibold text-foreground group-hover:text-primary">
                  {cat.name}
                </div>
                <div className="text-xs text-muted-foreground">{cat.short}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent" />
            </Link>
          ))}
        </div>
      </section>

      {/* Market overview + crypto side by side */}
      <section className="container-page mt-14 grid gap-6 lg:grid-cols-2">
        <MarketPanel
          title="US Stock Market"
          items={MARKET_SNAPSHOT.slice(0, 4)}
          href="/category/stock-market"
        />
        <MarketPanel
          title="Crypto Market"
          items={[
            { name: "Bitcoin (BTC)", value: "$97,412", change: "+1.24%", up: true },
            { name: "Ethereum (ETH)", value: "$3,485", change: "+0.83%", up: true },
            { name: "Solana (SOL)", value: "$212.40", change: "+2.11%", up: true },
            { name: "BNB", value: "$641.20", change: "-0.42%", up: false },
            { name: "XRP", value: "$1.32", change: "+0.90%", up: true },
            { name: "Dogecoin (DOGE)", value: "$0.362", change: "-1.31%", up: false },
          ]}
          href="/category/cryptocurrency"
        />
      </section>

      {/* Trending + popular sidebar-style block */}
      {trending.length > 0 && (
        <section className="container-page mt-14 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeader eyebrow="Editors' Picks" title="Featured Articles" />
            <div className="grid gap-6 sm:grid-cols-2">
              {trending.slice(0, 4).map((a: any) => (
                <ArticleCard key={a.slug} article={heroArticle(a)} />
              ))}
            </div>
          </div>
          <aside className="space-y-3 rounded-lg border border-border bg-card p-5">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
              <Sparkles className="h-4 w-4 text-accent" /> Popular
            </h3>
            <ul className="divide-y divide-border">
              {trending.slice(0, 5).map((a: any) => (
                <li key={a.slug}>
                  <ArticleCard article={heroArticle(a)} variant="compact" />
                </li>
              ))}
            </ul>
          </aside>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="container-page mt-16">
        <div className="overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground md:p-12">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Free Newsletter
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
                The Money Briefing
              </h2>
              <p className="mt-3 max-w-md text-sm opacity-90">
                Markets, macro, and personal finance in a 5-minute email. Delivered every
                weekday before the opening bell.
              </p>
            </div>
            <div className="rounded-xl bg-background/95 p-4 text-foreground">
              <NewsletterForm source="hero-cta" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function heroArticle(a: any) {
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    featured_image: a.featured_image,
    reading_time: a.reading_time,
    published_at: a.published_at,
    category_slug: a.categories?.slug ?? undefined,
  };
}

function SectionHeader({
  eyebrow,
  title,
  href,
}: {
  eyebrow: string;
  title: string;
  href?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between border-b border-border pb-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          {eyebrow}
        </p>
        <h2 className="mt-1 font-display text-2xl font-bold text-foreground md:text-3xl">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          to={href as any}
          className="hidden items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground sm:inline-flex"
        >
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

function MarketPanel({
  title,
  items,
  href,
}: {
  title: string;
  items: { name: string; value: string; change: string; up: boolean }[];
  href: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
        <Link to={href as any} className="text-xs text-muted-foreground hover:text-foreground">
          More →
        </Link>
      </div>
      <ul className="divide-y divide-border">
        {items.map((m) => (
          <li key={m.name} className="flex items-center justify-between py-2.5 text-sm">
            <span className="font-medium text-foreground">{m.name}</span>
            <div className="flex items-center gap-3">
              <span className="tabular-nums text-muted-foreground">{m.value}</span>
              <span
                className={`inline-flex w-16 justify-end tabular-nums font-semibold ${
                  m.up ? "text-success" : "text-danger"
                }`}
              >
                {m.change}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[10px] text-muted-foreground">
        Snapshot values — live data will be wired in via API in a future release.
      </p>
    </div>
  );
}

function EmptyHero() {
  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-primary to-primary-hover p-10 text-primary-foreground md:p-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">
        Welcome to FinanceHub USA
      </p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold leading-tight md:text-5xl">
        US financial news, education, and market analysis — built to help you build wealth.
      </h1>
      <p className="mt-4 max-w-xl text-base opacity-90">
        Publish your first article to bring the homepage to life. Every category below is
        already wired to your database with SEO, sitemap, RSS and structured data ready to go.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/admin"
          className="inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:brightness-95"
        >
          Open the CMS
        </Link>
        <Link
          to="/tools"
          className="inline-flex items-center rounded-md border border-primary-foreground/30 px-5 py-2.5 text-sm font-semibold hover:bg-primary-foreground/10"
        >
          Try the calculators
        </Link>
      </div>
    </div>
  );
}

function EmptyPitch() {
  return (
    <div className="rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">
      Feature more stories from the CMS and they'll appear here automatically.
    </div>
  );
}
