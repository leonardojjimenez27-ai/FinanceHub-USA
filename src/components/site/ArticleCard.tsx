import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { categoryName } from "@/lib/categories";

export interface ArticleCardData {
  slug: string;
  title: string;
  excerpt?: string | null;
  featured_image?: string | null;
  reading_time?: number | null;
  published_at?: string | null;
  category_slug?: string | null;
}

function formatDate(iso?: string | null) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function ArticleCard({
  article,
  variant = "default",
}: {
  article: ArticleCardData;
  variant?: "default" | "large" | "compact";
}) {
  if (variant === "compact") {
    return (
      <Link
        to="/article/$slug"
        params={{ slug: article.slug }}
        className="group flex gap-3 py-3"
      >
        {article.featured_image ? (
          <img
            src={article.featured_image}
            alt=""
            loading="lazy"
            className="h-16 w-24 flex-none rounded object-cover"
          />
        ) : (
          <div className="h-16 w-24 flex-none rounded bg-secondary" />
        )}
        <div className="min-w-0">
          {article.category_slug && (
            <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">
              {categoryName(article.category_slug)}
            </span>
          )}
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary">
            {article.title}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatDate(article.published_at)}
          </p>
        </div>
      </Link>
    );
  }

  const large = variant === "large";
  return (
    <Link
      to="/article/$slug"
      params={{ slug: article.slug }}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition hover:shadow-[var(--shadow-elegant)]"
    >
      <div className={`relative overflow-hidden bg-secondary ${large ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
        {article.featured_image ? (
          <img
            src={article.featured_image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-4xl font-display text-primary/20">
            $
          </div>
        )}
        {article.category_slug && (
          <span className="absolute left-3 top-3 rounded bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
            {categoryName(article.category_slug)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3
          className={`font-display font-bold text-foreground group-hover:text-primary ${
            large ? "text-2xl leading-tight" : "text-lg leading-snug"
          }`}
        >
          {article.title}
        </h3>
        {article.excerpt && (
          <p className={`mt-2 text-muted-foreground ${large ? "text-base" : "text-sm"} line-clamp-2`}>
            {article.excerpt}
          </p>
        )}
        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{formatDate(article.published_at)}</span>
          {article.reading_time ? (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {article.reading_time} min read
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
