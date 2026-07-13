import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { searchArticles } from "@/lib/content.functions";
import { ArticleCard } from "@/components/site/ArticleCard";
import { Search as SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

const schema = z.object({ q: fallback(z.string(), "").default("") });

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(schema),
  head: () => ({
    meta: [
      { title: "Search — FinanceHub USA" },
      { name: "description", content: "Search FinanceHub USA articles, guides, and analysis." },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const [input, setInput] = useState(q);
  useEffect(() => setInput(q), [q]);

  const query = useQuery({
    queryKey: ["search", q],
    enabled: q.length > 0,
    queryFn: () => searchArticles({ data: { q } }),
  });

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-4xl font-bold text-foreground">Search</h1>
      <form
        className="mt-4 flex max-w-2xl gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ search: { q: input.trim() } });
        }}
      >
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search articles..."
            className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
          Search
        </button>
      </form>

      {q && (
        <p className="mt-4 text-sm text-muted-foreground">
          Results for <span className="font-semibold text-foreground">"{q}"</span>
        </p>
      )}

      <div className="mt-6">
        {!q && (
          <p className="text-sm text-muted-foreground">
            Type a keyword above to search articles.
          </p>
        )}
        {q && query.isLoading && <p className="text-sm text-muted-foreground">Searching…</p>}
        {q && query.data && query.data.results.length === 0 && (
          <p className="text-sm text-muted-foreground">No results.</p>
        )}
        {q && query.data && query.data.results.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {query.data.results.map((a: any) => (
              <ArticleCard
                key={a.slug}
                article={{
                  slug: a.slug,
                  title: a.title,
                  excerpt: a.excerpt,
                  featured_image: a.featured_image,
                  reading_time: a.reading_time,
                  published_at: a.published_at,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
