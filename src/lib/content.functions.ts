import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    },
  );
}

const ARTICLE_COLS =
  "id,slug,title,excerpt,featured_image,og_image,seo_title,seo_description,seo_keywords,canonical_url,reading_time,category_id,author_id,faq,published_at,updated_at,featured,trending,view_count";

export const getHomeData = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const [latest, featured, trending, categories] = await Promise.all([
    sb.from("articles").select(ARTICLE_COLS).eq("status", "published")
      .order("published_at", { ascending: false }).limit(12),
    sb.from("articles").select(ARTICLE_COLS).eq("status", "published").eq("featured", true)
      .order("published_at", { ascending: false }).limit(6),
    sb.from("articles").select(ARTICLE_COLS).eq("status", "published").eq("trending", true)
      .order("view_count", { ascending: false }).limit(6),
    sb.from("categories").select("slug,name,description,seo_description").order("sort_order"),
  ]);
  return {
    latest: latest.data ?? [],
    featured: featured.data ?? [],
    trending: trending.data ?? [],
    categories: categories.data ?? [],
  };
});

export const getCategoryPage = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(80) }).parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: category } = await sb.from("categories").select("*").eq("slug", data.slug).maybeSingle();
    if (!category) return { category: null, articles: [] as any[] };
    const { data: articles } = await sb
      .from("articles")
      .select(ARTICLE_COLS)
      .eq("status", "published")
      .eq("category_id", category.id)
      .order("published_at", { ascending: false })
      .limit(30);
    return { category, articles: articles ?? [] };
  });

export const getArticleBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: article } = await sb
      .from("articles")
      .select(`*, categories(slug,name), profiles:author_id(display_name,slug,avatar_url,bio,twitter,website)`)
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (!article) return { article: null, related: [] as any[] };
    const related = article.category_id
      ? (
          await sb
            .from("articles")
            .select(ARTICLE_COLS)
            .eq("status", "published")
            .eq("category_id", article.category_id)
            .neq("id", article.id)
            .order("published_at", { ascending: false })
            .limit(4)
        ).data ?? []
      : [];
    return { article, related };
  });

export const searchArticles = createServerFn({ method: "GET" })
  .inputValidator((d: { q: string }) => z.object({ q: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const q = data.q.replace(/[%_]/g, "\\$&");
    const { data: results } = await sb
      .from("articles")
      .select(ARTICLE_COLS)
      .eq("status", "published")
      .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
      .order("published_at", { ascending: false })
      .limit(30);
    return { results: results ?? [] };
  });

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string; source?: string }) =>
    z
      .object({
        email: z.string().trim().email().max(255),
        source: z.string().max(80).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { error } = await sb
      .from("newsletter_subscribers")
      .insert({ email: data.email.toLowerCase(), source: data.source ?? "site" });
    if (error && !error.message.includes("duplicate")) {
      return { ok: false as const, message: "Could not subscribe. Please try again." };
    }
    return { ok: true as const, message: "Thanks! You're on the list." };
  });

export const getSitemapEntries = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const [{ data: articles }, { data: categories }] = await Promise.all([
    sb.from("articles").select("slug,updated_at,published_at").eq("status", "published").limit(5000),
    sb.from("categories").select("slug,updated_at"),
  ]);
  return { articles: articles ?? [], categories: categories ?? [] };
});

export const getRssItems = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data } = await sb
    .from("articles")
    .select("slug,title,excerpt,published_at,featured_image")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(30);
  return { items: data ?? [] };
});
