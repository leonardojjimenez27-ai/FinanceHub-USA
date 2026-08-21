import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import {
  Twitter,
  Mail,
  BookOpen,
  TrendingUp,
  ExternalLink,
  CheckCircle2,
  Shield,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { ArticleCard } from "@/components/site/ArticleCard";
import { supabase } from "@/integrations/supabase/client";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

const authorOptions = (slug: string) =>
  queryOptions({
    queryKey: ["author", slug],
    queryFn: async () => {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select(
          "id, display_name, bio, avatar_url, twitter, website, slug, created_at",
        )
        .eq("slug", slug)
        .maybeSingle();

      if (profileError || !profile) {
        return { profile: null, articles: [] };
      }

      const { data: articles, error: articlesError } = await supabase
        .from("articles")
        .select(`
          id,
          slug,
          title,
          excerpt,
          featured_image,
          reading_time,
          published_at,
          updated_at,
          categories(slug, name)
        `)
        .eq("author_id", profile.id)
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(20);

      if (articlesError) {
        console.error("Error fetching author articles:", articlesError);
        return { profile, articles: [] };
      }

      return {
        profile,
        articles: articles ?? [],
      };
    },
  });

export const Route = createFileRoute("/author/$slug")({
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(
      authorOptions(params.slug),
    );

    if (!data.profile) {
      throw notFound();
    }

    return data;
  },

  head: ({ params, loaderData }) => {
    const profile: any = loaderData?.profile;

    if (!profile) {
      return {
        meta: [{ title: "Author not found" }],
      };
    }

    const name = profile.display_name || params.slug;
    const title = `${name} — FinanceHub USA Author`;
    const desc =
      profile.bio ||
      `Articles and financial education content by ${name} on FinanceHub USA.`;

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: `/author/${params.slug}` },
        { property: "og:type", content: "profile" },
        {
          property: "profile:first_name",
          content: name.split(" ")[0] || name,
        },
        {
          property: "profile:last_name",
          content: name.split(" ").slice(1).join(" ") || "",
        },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/author/${params.slug}` }],
    };
  },

  component: AuthorPage,

  notFoundComponent: () => (
    <div className="container-page py-16 text-center">
      <h1 className="font-display text-3xl font-bold">Author not found</h1>

      <p className="mt-2 text-muted-foreground">
        This author profile does not exist.
      </p>

      <Link to="/" className="mt-4 inline-block text-accent underline">
        Back home
      </Link>
    </div>
  ),
});

function AuthorPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(authorOptions(slug));

  const { profile, articles } = data;

  if (!profile) {
    return null;
  }

  const authorName = profile.display_name || slug;

  const authorAvatar =
    profile.avatar_url || "/placeholder-avatar.jpg";

  const authorBio =
    profile.bio ||
    `${authorName} contributes financial education content to FinanceHub USA, covering investing, personal finance, retirement, markets, banking, credit, and related topics.`;

  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { label: "Authors", href: "/authors" },
          { label: authorName },
        ]}
      />

      <Link
        to="/about"
        className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to About
      </Link>

      <div className="mt-6 rounded-2xl bg-gradient-to-br from-primary/95 to-primary/80 p-8 text-primary-foreground md:p-12">
        <div className="grid gap-8 md:grid-cols-[auto,1fr] md:items-center">
          <div className="flex justify-center md:justify-start">
            <img
              src={authorAvatar}
              alt={authorName}
              className="h-28 w-28 rounded-full border-4 border-accent/50 object-cover md:h-36 md:w-36"
            />
          </div>

          <div className="text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Author
            </p>

            <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">
              {authorName}
            </h1>

            {memberSince && (
              <p className="mt-1 text-sm text-primary-foreground/60">
                Contributor since {memberSince}
              </p>
            )}

            <p className="mt-3 max-w-2xl text-base text-primary-foreground/80">
              {authorBio}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              {profile.twitter && (
                <a
                  href={`https://x.com/${profile.twitter.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:bg-white/20"
                >
                  <Twitter className="h-4 w-4" />
                  X
                </a>
              )}

              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:bg-white/20"
                >
                  <ExternalLink className="h-4 w-4" />
                  Website
                </a>
              )}

              <a
                href="mailto:admin@financehubus.com"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:bg-white/20"
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Background & Focus
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <InfoCard
            icon={<BookOpen className="h-5 w-5" />}
            title="Financial Education"
            description="Focused on explaining personal finance, investing, retirement, credit, banking, and related financial topics in clear language."
          />

          <InfoCard
            icon={<TrendingUp className="h-5 w-5" />}
            title="Markets & Investing"
            description="Covers U.S. markets, ETFs, stocks, portfolio concepts, economic developments, and long-term investing topics."
          />

          <InfoCard
            icon={<Shield className="h-5 w-5" />}
            title="Source-Based Research"
            description="Uses primary and reputable sources whenever practical, including government agencies, regulators, official company information, and established financial institutions."
          />

          <InfoCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            title="Editorial Transparency"
            description="FinanceHub USA discloses its editorial approach, corrections policy, advertising relationships, and financial disclaimer across the site."
          />
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-border bg-secondary/40 p-6 md:p-8">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-accent" />

          <h2 className="font-display text-2xl font-bold text-foreground">
            Editorial Mission
          </h2>
        </div>

        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
          FinanceHub USA aims to make financial topics easier to understand by
          combining practical explanations with research from reliable
          sources. The goal is to help readers better understand financial
          decisions, ask better questions, and conduct informed research before
          acting.
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span>Independent editorial approach</span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span>Primary sources when practical</span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span>Clear financial education</span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span>Focused on U.S. financial topics</span>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Editorial Standards
        </h2>

        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
          Content published under this author profile is created with an
          emphasis on clarity, usefulness, and accurate representation of
          financial information. Where appropriate, articles reference official
          or established sources so readers can review additional information
          directly.
        </p>

        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
          Financial information can change over time. Interest rates, tax rules,
          contribution limits, credit products, insurance terms, market data,
          and regulations may change after publication. Articles may be updated
          when meaningful new information becomes available.
        </p>

        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
          Learn more in the{" "}
          <Link
            to="/editorial-policy"
            className="text-accent hover:underline"
          >
            FinanceHub USA Editorial Policy
          </Link>
          .
        </p>
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Latest from {authorName}
            </p>

            <h2 className="mt-1 font-display text-2xl font-bold text-foreground">
              Featured Articles
            </h2>
          </div>
        </div>

        {articles && articles.length > 0 ? (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article: any) => (
              <ArticleCard
                key={article.slug}
                article={{
                  slug: article.slug,
                  title: article.title,
                  excerpt: article.excerpt,
                  featured_image: article.featured_image,
                  reading_time: article.reading_time,
                  published_at: article.published_at,
                  category_slug: article.categories?.slug,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No articles are currently available from this author.
            </p>
          </div>
        )}
      </section>

      <section className="mt-12 rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-foreground">
              Get The Money Briefing
            </h3>

            <p className="text-sm text-muted-foreground">
              Receive FinanceHub USA articles and financial insights by email.
            </p>
          </div>

          <div className="w-full max-w-sm">
            <NewsletterForm source={`author-${slug}`} compact />
          </div>
        </div>
      </section>

      <div className="mt-8 rounded-lg border-l-4 border-accent bg-accent/5 p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Disclaimer:</strong> All content on FinanceHub USA is for{" "}
          <strong>informational and educational purposes</strong> only. It does
          not constitute personalized financial, investment, tax, legal,
          insurance, credit, or other professional advice. Investing involves
          risk, including possible loss of principal. Past performance does not
          guarantee future results. See our{" "}
          <Link
            to="/disclaimer"
            className="text-accent hover:underline"
          >
            full disclaimer
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-border bg-card p-4 transition hover:border-accent hover:shadow-[var(--shadow-elegant)]">
      <div className="mt-0.5 text-accent">{icon}</div>

      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>

        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}