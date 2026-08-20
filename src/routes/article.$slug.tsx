import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getArticleBySlug } from "@/lib/content.functions";
import { ArticleCard } from "@/components/site/ArticleCard";
import {
  Breadcrumbs,
  breadcrumbJsonLd,
} from "@/components/site/Breadcrumbs";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import {
  Facebook,
  Linkedin,
  Twitter,
  Link as LinkIcon,
  Clock,
  Calendar,
} from "lucide-react";
import { useMemo, type ReactNode } from "react";

const SITE_URL = "https://www.financehubus.com";

export const Route = createFileRoute("/article/$slug")({
  loader: async ({ params }) => {
    // Cargamos el artículo directamente desde la Server Function.
    // No dependemos de React Query para el render SSR.
    const data = await getArticleBySlug({
      data: {
        slug: params.slug,
      },
    });

    if (!data.article) {
      throw notFound();
    }

    return data;
  },

  head: ({ params, loaderData }) => {
    const a: any = loaderData?.article;

    if (!a) {
      return {
        meta: [
          {
            title: "Article not found — FinanceHub USA",
          },
          {
            name: "robots",
            content: "noindex, follow",
          },
        ],
      };
    }

    const relativeUrl = `/article/${params.slug}`;
    const absoluteUrl = `${SITE_URL}${relativeUrl}`;

    const title = a.seo_title || a.title;

    const desc =
      a.seo_description ||
      a.excerpt ||
      `${a.title} — FinanceHub USA`;

    const authorName =
      a.profiles?.display_name ||
      a.author_name ||
      "FinanceHub USA";

    const canonicalUrl =
      a.canonical_url || absoluteUrl;

    const meta: any[] = [
      {
        title: `${title} — FinanceHub USA`,
      },
      {
        name: "description",
        content: desc,
      },
      {
        name: "robots",
        content: "index, follow",
      },
      {
        property: "og:site_name",
        content: "FinanceHub USA",
      },
      {
        property: "og:title",
        content: title,
      },
      {
        property: "og:description",
        content: desc,
      },
      {
        property: "og:url",
        content: absoluteUrl,
      },
      {
        property: "og:type",
        content: "article",
      },
      {
        property: "article:published_time",
        content: a.published_at ?? undefined,
      },
      {
        property: "article:modified_time",
        content: a.updated_at ?? undefined,
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: title,
      },
      {
        name: "twitter:description",
        content: desc,
      },
    ];

    if (a.seo_keywords) {
      meta.push({
        name: "keywords",
        content: a.seo_keywords,
      });
    }

    if (a.og_image || a.featured_image) {
      meta.push({
        property: "og:image",
        content: a.og_image || a.featured_image,
      });

      meta.push({
        name: "twitter:image",
        content: a.og_image || a.featured_image,
      });
    }

    const articleJsonLd: any = {
      "@context": "https://schema.org",
      "@type": "Article",

      headline: a.title,

      description: desc,

      image:
        a.og_image ||
        a.featured_image ||
        undefined,

      datePublished:
        a.published_at || undefined,

      dateModified:
        a.updated_at ||
        a.published_at ||
        undefined,

      author: {
        "@type": "Person",
        name: authorName,

        ...(a.profiles?.slug
          ? {
              url: `${SITE_URL}/author/${a.profiles.slug}`,
            }
          : {}),
      },

      publisher: {
        "@type": "Organization",
        name: "FinanceHub USA",
        url: SITE_URL,
      },

      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": absoluteUrl,
      },
    };

    const scripts: any[] = [
      {
        type: "application/ld+json",
        children: JSON.stringify(articleJsonLd),
      },

      {
        type: "application/ld+json",

        children: JSON.stringify(
          breadcrumbJsonLd([
            a.categories
              ? {
                  name: a.categories.name,
                  url: `/category/${a.categories.slug}`,
                }
              : {
                  name: "Article",
                  url: relativeUrl,
                },

            {
              name: a.title,
              url: relativeUrl,
            },
          ]),
        ),
      },
    ];

    if (
      Array.isArray(a.faq) &&
      a.faq.length > 0
    ) {
      scripts.push({
        type: "application/ld+json",

        children: JSON.stringify({
          "@context": "https://schema.org",

          "@type": "FAQPage",

          mainEntity: a.faq.map(
            (f: any) => ({
              "@type": "Question",

              name: f.question,

              acceptedAnswer: {
                "@type": "Answer",
                text: f.answer,
              },
            }),
          ),
        }),
      });
    }

    return {
      meta,

      links: [
        {
          rel: "canonical",
          href: canonicalUrl,
        },
      ],

      scripts,
    };
  },

  component: ArticlePage,

  notFoundComponent: () => (
    <div className="container-page py-16 text-center">
      <h1 className="font-display text-3xl font-bold">
        Article not found
      </h1>

      <p className="mt-2 text-muted-foreground">
        This story may have moved or been
        unpublished.
      </p>

      <Link
        to="/"
        className="mt-4 inline-block text-accent underline"
      >
        Back home
      </Link>
    </div>
  ),
});

function ArticlePage() {
  const { slug } = Route.useParams();

  // IMPORTANTE:
  // Usamos directamente los datos devueltos por el loader.
  // No usamos useSuspenseQuery ni React Query aquí.
  const data = Route.useLoaderData();

  const article: any = data.article;
  const related = data.related ?? [];

  const toc = useMemo(
    () =>
      extractHeadings(
        article.content || "",
      ),
    [article.content],
  );

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `${SITE_URL}/article/${slug}`;

  const shareText =
    encodeURIComponent(article.title);

  const authorName =
    article.profiles?.display_name ||
    article.author_name ||
    "FinanceHub USA";

  return (
    <div>
      <article className="container-page py-8">
        <Breadcrumbs
          items={[
            article.categories
              ? {
                  label:
                    article.categories.name,

                  href: `/category/${article.categories.slug}`,
                }
              : {
                  label: "Article",
                },

            {
              label: article.title,
            },
          ]}
        />

        <header className="mt-4 max-w-3xl">
          {article.categories && (
            <Link
              to="/category/$slug"
              params={{
                slug:
                  article.categories.slug,
              }}
              className="text-xs font-semibold uppercase tracking-widest text-accent"
            >
              {article.categories.name}
            </Link>
          )}

          <h1 className="mt-2 font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="mt-4 text-lg text-muted-foreground">
              {article.excerpt}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            {article.profiles?.slug ? (
              <Link
                to="/author/$slug"
                params={{
                  slug:
                    article.profiles.slug,
                }}
                className="hover:text-accent hover:underline"
              >
                By {authorName}
              </Link>
            ) : (
              <span>
                By {authorName}
              </span>
            )}

            {article.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />

                {new Date(
                  article.published_at,
                ).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  },
                )}
              </span>
            )}

            {article.reading_time && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />

                {article.reading_time} min
                read
              </span>
            )}

            {article.updated_at &&
              article.updated_at !==
                article.published_at && (
                <span className="opacity-70">
                  Updated{" "}
                  {new Date(
                    article.updated_at,
                  ).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                </span>
              )}
          </div>
        </header>

        {article.featured_image && (
          <div className="mt-8 overflow-hidden rounded-xl">
            <img
              src={
                article.featured_image
              }
              alt={article.title}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            {toc.length > 1 && (
              <nav
                aria-label="Table of contents"
                className="mb-8 rounded-lg border border-border bg-secondary/40 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Table of contents
                </p>

                <ol className="mt-2 space-y-1 text-sm">
                  {toc.map((h) => (
                    <li
                      key={h.id}
                      className={
                        h.level === 3
                          ? "pl-4"
                          : ""
                      }
                    >
                      <a
                        href={`#${h.id}`}
                        className="text-foreground hover:text-accent"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div
              className="prose-article"
              dangerouslySetInnerHTML={{
                __html:
                  renderContent(
                    article.content ||
                      "",
                  ),
              }}
            />

            {Array.isArray(
              article.faq,
            ) &&
              article.faq.length >
                0 && (
                <section className="mt-12">
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Frequently asked
                    questions
                  </h2>

                  <div className="mt-4 divide-y divide-border rounded-lg border border-border">
                    {article.faq.map(
                      (
                        f: any,
                        i: number,
                      ) => (
                        <details
                          key={i}
                          className="group p-4"
                        >
                          <summary className="cursor-pointer list-none font-semibold text-foreground marker:hidden">
                            {
                              f.question
                            }
                          </summary>

                          <p className="mt-2 text-sm text-muted-foreground">
                            {
                              f.answer
                            }
                          </p>
                        </details>
                      ),
                    )}
                  </div>
                </section>
              )}

            {article.profiles && (
              <aside className="mt-10 flex gap-4 rounded-lg border border-border bg-card p-5">
                <Link
                  to="/author/$slug"
                  params={{
                    slug:
                      article.profiles
                        .slug ||
                      "leonardo-jimenez",
                  }}
                  className="flex-none"
                >
                  {article.profiles
                    .avatar_url ? (
                    <img
                      src={
                        article
                          .profiles
                          .avatar_url
                      }
                      alt={
                        article
                          .profiles
                          .display_name ||
                        "Author"
                      }
                      className="h-14 w-14 rounded-full object-cover transition hover:opacity-80"
                    />
                  ) : (
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-primary font-bold text-primary-foreground">
                      {article.profiles
                        .display_name?.[0] ??
                        "A"}
                    </div>
                  )}
                </Link>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                    Written by
                  </p>

                  <Link
                    to="/author/$slug"
                    params={{
                      slug:
                        article.profiles
                          .slug ||
                        "leonardo-jimenez",
                    }}
                    className="text-lg font-display font-bold text-foreground transition hover:text-accent"
                  >
                    {article.profiles
                      .display_name ||
                      "Leonardo Jiménez"}
                  </Link>

                  {article.profiles
                    .bio && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {
                        article
                          .profiles
                          .bio
                      }
                    </p>
                  )}
                </div>
              </aside>
            )}

            <section className="mt-10 rounded-xl border border-border bg-secondary/40 p-6">
              <NewsletterForm
                source={`article-${slug}`}
              />
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Share
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                <ShareBtn
                  href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(
                    shareUrl,
                  )}`}
                  icon={
                    <Twitter className="h-4 w-4" />
                  }
                  label="X"
                />

                <ShareBtn
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    shareUrl,
                  )}`}
                  icon={
                    <Facebook className="h-4 w-4" />
                  }
                  label="Facebook"
                />

                <ShareBtn
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    shareUrl,
                  )}`}
                  icon={
                    <Linkedin className="h-4 w-4" />
                  }
                  label="LinkedIn"
                />

                <button
                  type="button"
                  onClick={() => {
                    if (
                      typeof navigator !==
                      "undefined"
                    ) {
                      navigator.clipboard?.writeText(
                        shareUrl,
                      );
                    }
                  }}
                  className="inline-flex items-center gap-1 rounded-md border border-input px-2 py-1 text-xs hover:bg-muted"
                >
                  <LinkIcon className="h-4 w-4" />
                  Copy
                </button>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="container-page mt-16">
          <h2 className="mb-5 font-display text-2xl font-bold text-foreground">
            Related articles
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map(
              (r: any) => (
                <ArticleCard
                  key={r.slug}
                  article={{
                    slug: r.slug,

                    title: r.title,

                    excerpt:
                      r.excerpt,

                    featured_image:
                      r.featured_image,

                    reading_time:
                      r.reading_time,

                    published_at:
                      r.published_at,

                    category_slug:
                      article.categories
                        ?.slug,
                  }}
                />
              ),
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function ShareBtn({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-md border border-input px-2 py-1 text-xs hover:bg-muted"
      aria-label={`Share on ${label}`}
    >
      {icon} {label}
    </a>
  );
}

function renderContent(
  html: string,
): string {
  return html.replace(
    /<(h2|h3)>([^<]+)<\/\1>/g,

    (_m, tag, text) => {
      const id =
        slugifyHeading(text);

      return `<${tag} id="${id}">${text}</${tag}>`;
    },
  );
}

function slugifyHeading(
  text: string,
) {
  return text
    .toLowerCase()
    .replace(
      /[^a-z0-9\s-]/g,
      "",
    )
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function extractHeadings(
  html: string,
) {
  const re =
    /<(h2|h3)>([^<]+)<\/\1>/g;

  const out: {
    level: number;
    id: string;
    text: string;
  }[] = [];

  let m;

  while (
    (m = re.exec(html))
  ) {
    out.push({
      level:
        m[1] === "h2"
          ? 2
          : 3,

      id: slugifyHeading(
        m[2],
      ),

      text: m[2],
    });
  }

  return out;
}