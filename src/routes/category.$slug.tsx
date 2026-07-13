import { createFileRoute, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getCategoryPage } from "@/lib/content.functions";
import { ArticleCard } from "@/components/site/ArticleCard";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/site/Breadcrumbs";
import { AdSlot } from "@/components/site/AdSlot";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { CATEGORIES } from "@/lib/categories";

const opts = (slug: string) =>
  queryOptions({
    queryKey: ["category", slug],
    queryFn: () => getCategoryPage({ data: { slug } }),
  });

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(opts(params.slug));
    if (!data.category) throw notFound();
    return data;
  },
  head: ({ params, loaderData }) => {
    const cat: any = loaderData?.category;
    const fallback = CATEGORIES.find((c) => c.slug === params.slug);
    const title = cat?.seo_title || `${cat?.name ?? fallback?.name ?? params.slug} — FinanceHub USA`;
    const desc =
      cat?.seo_description ||
      cat?.description ||
      `Latest ${cat?.name ?? fallback?.name ?? params.slug} articles, guides, and analysis on FinanceHub USA.`;
    const url = `/category/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: cat?.name ?? params.slug, url },
            ]),
          ),
        },
      ],
    };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="container-page py-16 text-center">
      <h1 className="font-display text-3xl font-bold">Category not found</h1>
    </div>
  ),
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(opts(slug));
  const { category, articles } = data;
  if (!category) return null;

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: category.name }]} />
      <header className="mt-4 border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          Category
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold text-foreground md:text-5xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-3 max-w-2xl text-muted-foreground">{category.description}</p>
        )}
      </header>

      <AdSlot slot="leaderboard" className="my-8" />

      {articles.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a: any) => (
            <ArticleCard
              key={a.slug}
              article={{
                slug: a.slug,
                title: a.title,
                excerpt: a.excerpt,
                featured_image: a.featured_image,
                reading_time: a.reading_time,
                published_at: a.published_at,
                category_slug: category.slug,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <h2 className="font-display text-xl font-semibold text-foreground">
            No articles yet
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            New {category.name} articles will show up here as they're published.
          </p>
        </div>
      )}

      <div className="mt-14 rounded-xl border border-border bg-secondary/40 p-6">
        <h3 className="font-display text-xl font-bold text-foreground">
          Stay ahead of the market
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The daily briefing: markets, macro, and money — in 5 minutes.
        </p>
        <div className="mt-4 max-w-md">
          <NewsletterForm source={`category-${slug}`} compact />
        </div>
      </div>
    </div>
  );
}
