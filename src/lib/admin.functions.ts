import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

const ArticleInput = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(1).max(200).optional(),
  excerpt: z.string().trim().max(500).optional().default(""),
  content: z.string().max(200000).optional().default(""),
  featured_image: z.string().url().max(500).optional().or(z.literal("")).optional(),
  og_image: z.string().url().max(500).optional().or(z.literal("")).optional(),
  seo_title: z.string().max(200).optional().default(""),
  seo_description: z.string().max(500).optional().default(""),
  seo_keywords: z.string().max(500).optional().default(""),
  canonical_url: z.string().max(500).optional().default(""),
  reading_time: z.number().int().min(1).max(180).optional().default(5),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
  category_id: z.string().uuid().nullable().optional(),
  faq: z
    .array(z.object({ question: z.string().max(300), answer: z.string().max(2000) }))
    .max(20)
    .optional()
    .default([]),
});

async function ensureEditor(context: any) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (data) return true;
  const { data: isEditor } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "editor",
  });
  if (isEditor) return true;
  if (error) console.error(error);
  throw new Error("Forbidden: editor role required");
}

export const upsertArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => ArticleInput.parse(d))
  .handler(async ({ data, context }) => {
    await ensureEditor(context);
    const slug = data.slug?.trim() || slugify(data.title);
    const published_at =
      data.status === "published" ? new Date().toISOString() : null;
    const payload = {
      title: data.title,
      slug,
      excerpt: data.excerpt || null,
      content: data.content || "",
      featured_image: data.featured_image || null,
      og_image: data.og_image || null,
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
      seo_keywords: data.seo_keywords || null,
      canonical_url: data.canonical_url || null,
      reading_time: data.reading_time ?? 5,
      status: data.status,
      featured: data.featured,
      trending: data.trending,
      category_id: data.category_id || null,
      faq: data.faq ?? [],
      author_id: context.userId,
      published_at,
    };
    if (data.id) {
      const { data: updated, error } = await context.supabase
        .from("articles")
        .update(payload)
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw error;
      return { article: updated };
    }
    const { data: created, error } = await context.supabase
      .from("articles")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return { article: created };
  });

export const deleteArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureEditor(context);
    const { error } = await context.supabase.from("articles").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const listAdminArticles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureEditor(context);
    const { data, error } = await context.supabase
      .from("articles")
      .select("id,title,slug,status,category_id,updated_at,published_at,featured,trending,view_count")
      .order("updated_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return { articles: data ?? [] };
  });

export const getAdminArticle = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureEditor(context);
    const { data: article, error } = await context.supabase
      .from("articles")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw error;
    return { article };
  });

export const getMyRole = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: admin }, { data: editor }] = await Promise.all([
      context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
      context.supabase.rpc("has_role", { _user_id: context.userId, _role: "editor" }),
    ]);
    return { isAdmin: !!admin, isEditor: !!editor };
  });

export const promoteSelfToAdminIfFirst = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    // Bootstrap: if there are zero admins, the caller becomes the first admin.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) > 0) return { promoted: false as const };
    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: context.userId, role: "admin" }, { onConflict: "user_id,role" });
    if (error) throw error;
    return { promoted: true as const };
  });
