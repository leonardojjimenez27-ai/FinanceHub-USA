import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  
  console.log("🔍 [publicClient] URL:", url);
  console.log("🔍 [publicClient] KEY existe:", !!key);
  
  if (!url || !key) {
    console.error("❌ [publicClient] Faltan variables de entorno:", { url: !!url, key: !!key });
  }
  
  return createClient<Database>(
    url!,
    key!,
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
    sb.from("articles").select(ARTICLE_COLS)
      .eq("is_published", true)
      .order("published_at", { ascending: false }).limit(12),
    sb.from("articles").select(ARTICLE_COLS)
      .eq("is_published", true)
      .eq("featured", true)
      .order("published_at", { ascending: false }).limit(6),
    sb.from("articles").select(ARTICLE_COLS)
      .eq("is_published", true)
      .eq("trending", true)
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
  .validator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(80) }).parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: category } = await sb.from("categories").select("*").eq("slug", data.slug).maybeSingle();
    if (!category) return { category: null, articles: [] as any[] };
    const { data: articles } = await sb
      .from("articles")
      .select(ARTICLE_COLS)
      .eq("is_published", true)
      .eq("category_id", category.id)
      .order("published_at", { ascending: false })
      .limit(30);
    return { category, articles: articles ?? [] };
  });

export const getArticleBySlug = createServerFn({ method: "GET" })
  .validator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    
    console.log("🔍 [getArticleBySlug] Buscando slug:", data.slug);
    
    const { data: article, error } = await sb
      .from("articles")
      .select(`*, categories(slug,name)`)
      .eq("slug", data.slug)
      .maybeSingle();
    
    if (error) {
      console.error("❌ [getArticleBySlug] Error en la consulta:", error);
      return { article: null, related: [] as any[] };
    }
    
    console.log("📄 [getArticleBySlug] Artículo encontrado:", article ? article.title : "❌ NULL");
    
    if (!article) return { article: null, related: [] as any[] };
    
    const related = article.category_id
      ? (
          await sb
            .from("articles")
            .select(ARTICLE_COLS)
            .eq("is_published", true)
            .eq("category_id", article.category_id)
            .neq("id", article.id)
            .order("published_at", { ascending: false })
            .limit(4)
        ).data ?? []
      : [];
    return { article, related };
  });

export const searchArticles = createServerFn({ method: "GET" })
  .validator((d: { q: string }) => z.object({ q: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const q = data.q.replace(/[%_]/g, "\\$&");
    const { data: results } = await sb
      .from("articles")
      .select(ARTICLE_COLS)
      .eq("is_published", true)
      .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
      .order("published_at", { ascending: false })
      .limit(30);
    return { results: results ?? [] };
  });

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator((d: { email: string; source?: string }) =>
    z
      .object({
        email: z.string().trim().email().max(255),
        source: z.string().max(80).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const sb = publicClient();
    
    // Guardar en la base de datos
    const { error } = await sb
      .from("newsletter_subscribers")
      .insert({ email: data.email.toLowerCase(), source: data.source ?? "site" });
    
    if (error) {
      if (error.message.includes("duplicate")) {
        return { ok: false as const, message: "You're already subscribed!" };
      }
      console.error("Subscribe error:", error);
      return { ok: false as const, message: "Could not subscribe. Please try again." };
    }

    // ✅ Enviar correo de bienvenida
    try {
      const { sendWelcomeEmail } = await import("./email.functions");
      await sendWelcomeEmail({ data: { email: data.email } });
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // No fallamos la suscripción si el email falla
    }

    return { ok: true as const, message: "Thanks! You're on the list. Check your email! 📧" };
  });

export const getSitemapEntries = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const [{ data: articles }, { data: categories }] = await Promise.all([
    sb.from("articles").select("slug,updated_at,published_at").eq("is_published", true).limit(5000),
    sb.from("categories").select("slug,updated_at"),
  ]);
  return { articles: articles ?? [], categories: categories ?? [] };
});

export const getRssItems = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data } = await sb
    .from("articles")
    .select("slug,title,excerpt,published_at,featured_image")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(30);
  return { items: data ?? [] };
});