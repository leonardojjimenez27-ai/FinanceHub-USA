import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getEconomicCalendar } from "@/lib/market.functions";
import { Calendar, Clock, TrendingUp, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/economic-calendar")({
  head: () => ({
    meta: [
      { title: "Economic Calendar — FinanceHub USA" },
      { name: "description", content: "Stay informed with key economic events and market-moving news." },
      { property: "og:title", content: "Economic Calendar — FinanceHub USA" },
      { property: "og:url", content: "/economic-calendar" },
    ],
    links: [{ rel: "canonical", href: "/economic-calendar" }],
  }),
  component: EconomicCalendar,
});

function EconomicCalendar() {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ["economic-calendar"],
    queryFn: () => getEconomicCalendar({}),
    refetchInterval: 300000, // Cada 5 minutos
  });

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Economic Calendar</p>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Economic Calendar</h1>
          <p className="mt-2 text-muted-foreground">Stay informed with key economic events and market-moving news.</p>
        </div>
      </div>

      {isLoading ? (
        <p className="mt-8 text-muted-foreground">Loading economic events...</p>
      ) : error ? (
        <div className="mt-8 rounded-md bg-danger/10 p-4 text-sm text-danger">
          Error loading economic events: {error.message}
        </div>
      ) : events && events.length > 0 ? (
        <div className="mt-8 space-y-4">
          {events.map((event: any, index: number) => (
            <div key={index} className="rounded-lg border border-border bg-card p-5 transition hover:shadow-[var(--shadow-elegant)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-foreground">{event.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{event.summary}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(event.time).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(event.time).toLocaleTimeString()}
                    </span>
                    <span className="flex items-center gap-1">
                      📰 {event.source}
                    </span>
                  </div>
                </div>
                {event.sentiment !== undefined && (
                  <div className="flex items-center gap-2 rounded-full bg-secondary/60 px-3 py-1">
                    {event.sentiment > 0.1 ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-success" />
                        <span className="text-xs font-semibold text-success">Bullish</span>
                      </>
                    ) : event.sentiment < -0.1 ? (
                      <>
                        <TrendingDown className="h-4 w-4 text-danger" />
                        <span className="text-xs font-semibold text-danger">Bearish</span>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-muted-foreground">Neutral</span>
                    )}
                  </div>
                )}
              </div>
              {event.topics && event.topics.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {event.topics.slice(0, 3).map((topic: string) => (
                    <span key={topic} className="rounded-full bg-secondary/60 px-2.5 py-0.5 text-xs text-muted-foreground">
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">No economic events available.</p>
        </div>
      )}

      <div className="mt-8 rounded-lg border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
        <p>📊 Economic events sourced from Alpha Vantage. Data updates every 5 minutes.</p>
      </div>
    </div>
  );
}