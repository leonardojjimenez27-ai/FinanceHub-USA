import { createServerFn } from "@tanstack/react-start";
import { supabase as supabaseClient } from "@/integrations/supabase/client";
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
  is_published: z.boolean().default(false),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
  category_id: z.string().uuid().nullable().optional(),
  userId: z.string().optional(),
  faq: z
    .array(z.object({ question: z.string().max(300), answer: z.string().max(2000) }))
    .max(20)
    .optional()
    .default([]),
});

// ✅ Función para obtener el rol de un usuario desde la base de datos
async function getUserRole(userId: string): Promise<string | null> {
  const { data, error } = await supabaseClient.rpc('get_user_role', {
    user_id: userId
  });
  
  if (error) {
    console.error('Error getting user role:', error);
    return null;
  }
  
  return data;
}

// ✅ Función para promover al primer usuario como admin
async function promoteFirstUserToAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabaseClient.rpc('promote_first_user_to_admin', {
    user_id: userId
  });
  
  if (error) {
    console.error('Error promoting user:', error);
    return false;
  }
  
  return data || false;
}

// ✅ Función para verificar si el usuario es admin o editor
async function ensureEditor(userId: string) {
  const role = await getUserRole(userId);
  
  if (role === 'admin' || role === 'editor') {
    return true;
  }
  
  throw new Error("Forbidden: editor or admin role required");
}

export const upsertArticle = createServerFn({ method: "POST" })
  .validator((d: any) => ArticleInput.parse(d))
  .handler(async ({ data }) => {
    const { userId, ...articleData } = data;
    
    if (!userId) {
      throw new Error("User ID is required");
    }
    
    await ensureEditor(userId);

    const slug = articleData.slug?.trim() || slugify(articleData.title);
    const published_at = articleData.is_published ? new Date().toISOString() : null;
    
    const payload = {
      title: articleData.title,
      slug,
      excerpt: articleData.excerpt || null,
      content: articleData.content || "",
      featured_image: articleData.featured_image || null,
      og_image: articleData.og_image || null,
      seo_title: articleData.seo_title || null,
      seo_description: articleData.seo_description || null,
      seo_keywords: articleData.seo_keywords || null,
      canonical_url: articleData.canonical_url || null,
      reading_time: articleData.reading_time ?? 5,
      is_published: articleData.is_published,
      featured: articleData.featured,
      trending: articleData.trending,
      category_id: articleData.category_id || null,
      faq: articleData.faq ?? [],
      author_id: userId,
      published_at,
    };

    if (articleData.id) {
      const { data: updated, error: updateError } = await supabaseClient
        .from("articles")
        .update(payload)
        .eq("id", articleData.id)
        .select()
        .single();
      
      if (updateError) throw updateError;
      return { article: updated };
    }

    const { data: created, error: insertError } = await supabaseClient
      .from("articles")
      .insert(payload)
      .select()
      .single();
    
    if (insertError) throw insertError;
    return { article: created };
  });

export const deleteArticle = createServerFn({ method: "POST" })
  .validator((d: { id: string; userId: string }) => z.object({ id: z.string().uuid(), userId: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { id, userId } = data;
    
    if (!userId) {
      throw new Error("User ID is required");
    }
    
    await ensureEditor(userId);

    const { error: deleteError } = await supabaseClient
      .from("articles")
      .delete()
      .eq("id", id);
    
    if (deleteError) throw deleteError;
    return { ok: true };
  });

export const listAdminArticles = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error: listError } = await supabaseClient
      .from("articles")
      .select("id,title,slug,is_published,category_id,updated_at,published_at,featured,trending,view_count")
      .order("updated_at", { ascending: false })
      .limit(200);
    
    if (listError) throw listError;
    return { articles: data ?? [] };
  });

export const getAdminArticle = createServerFn({ method: "GET" })
  .validator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { data: article, error: getError } = await supabaseClient
      .from("articles")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    
    if (getError) throw getError;
    return { article };
  });

// ✅ Función para obtener el rol del usuario desde el servidor
export const getUserRoleFn = createServerFn({ method: "POST" })
  .validator((d: { userId: string }) => z.object({ userId: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { userId } = data;
    const role = await getUserRole(userId);
    
    return { 
      role: role || 'user',
      isAdmin: role === 'admin',
      isEditor: role === 'editor' || role === 'admin'
    };
  });

// ✅ Función para promover al primer usuario como admin
export const promoteFirstUserFn = createServerFn({ method: "POST" })
  .validator((d: { userId: string }) => z.object({ userId: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { userId } = data;
    const promoted = await promoteFirstUserToAdmin(userId);
    
    return { promoted };
  });