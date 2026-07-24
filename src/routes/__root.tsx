import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">404</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-foreground">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
          >
            Go home
          </Link>
          <Link
            to="/category/$slug"
            params={{ slug: "news" }}
            className="inline-flex items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Latest news
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-semibold text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const SITE_NAME = "FinanceHub USA";
const SITE_DESC =
  "US financial news, investing guides, market analysis, and personal finance advice from FinanceHub USA — independent, expert-led, and updated daily.";
const SITE_URL = "https://financehubus.com";
const SITE_IMAGE = "https://financehubus.com/og-image.jpg";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${SITE_NAME} — US Financial News & Money Guides` },
      { name: "description", content: SITE_DESC },
      { name: "author", content: SITE_NAME },
      { name: "theme-color", content: "#0b2545" },
      
      // Open Graph (Facebook, LinkedIn)
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: `${SITE_NAME} — US Financial News & Money Guides` },
      { property: "og:description", content: SITE_DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: SITE_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      
      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@FinanceHubUSA" },
      { name: "twitter:title", content: `${SITE_NAME} — US Financial News & Money Guides` },
      { name: "twitter:description", content: SITE_DESC },
      { name: "twitter:image", content: SITE_IMAGE },
      
      // Keywords adicionales
      { name: "keywords", content: "US financial news, investing, stocks, crypto, personal finance, retirement, taxes, credit cards, loans, insurance, banking, saving money, budgeting, business, economy, financial education" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap",
      },
      // ✅ Favicon actualizado
      { rel: "icon", type: "image/png", href: "/favicon-96x96.png", sizes: "96x96" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "canonical", href: SITE_URL },
      { rel: "alternate", type: "application/rss+xml", title: "FinanceHub USA RSS Feed", href: "/rss.xml" },
    ],
    scripts: [
      // ✅ Google CMP (Consent Management Platform) - RGPD
      {
        async: true,
        src: "https://fundingchoicesmessages.google.com/i/pub-6695449986047593?ers=1",
      },
      // ✅ Google AdSense
      {
        async: true,
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6695449986047593",
        crossorigin: "anonymous",
      },
      // Schema.org - WebSite
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          description: SITE_DESC,
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }),
      },
      // Schema.org - Organization
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          slogan: "Master your money.",
          sameAs: [
            "https://twitter.com/FinanceHubUSA",
            "https://facebook.com/FinanceHubUSA",
            "https://linkedin.com/company/financehubusa",
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-QLVFC6V3SG"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QLVFC6V3SG');
            `,
          }}
        />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://api.coingecko.com" />
        <link rel="dns-prefetch" href="https://www.alphavantage.co" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "/" }
            ]
          })}
        </script>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}