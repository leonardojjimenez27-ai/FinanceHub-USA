import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  listAdminArticles,
  upsertArticle,
  deleteArticle,
  getAdminArticle,
  getMyRole,
  promoteSelfToAdminIfFirst,
} from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES } from "@/lib/categories";
import { Pencil, Plus, Trash2, LogOut, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [{ title: "Admin — FinanceHub USA" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AdminPage,
});

type Mode = { type: "list" } | { type: "edit"; id?: string };

function AdminPage() {
  const [role, setRole] = useState<{ isAdmin: boolean; isEditor: boolean } | null>(null);
  const [mode, setMode] = useState<Mode>({ type: "list" });
  const [refreshKey, setRefreshKey] = useState(0);
  const getRole = useServerFn(getMyRole);
  const promote = useServerFn(promoteSelfToAdminIfFirst);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // Bootstrap: first signed-in user becomes admin.
        await promote({});
        const r = await getRole({});
        setRole(r);
      } catch {
        setRole({ isAdmin: false, isEditor: false });
      }
    })();
  }, [getRole, promote]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (!role) {
    return <div className="container-page py-16 text-muted-foreground">Loading…</div>;
  }

  if (!role.isAdmin && !role.isEditor) {
    return (
      <div className="container-page py-16">
        <h1 className="font-display text-2xl font-bold">Access restricted</h1>
        <p className="mt-2 text-muted-foreground">
          Your account doesn't have editor or admin permission.
        </p>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            FinanceHub CMS
          </p>
          <h1 className="font-display text-3xl font-bold">
            {mode.type === "list" ? "Articles" : mode.id ? "Edit article" : "New article"}
          </h1>
        </div>
        <div className="flex gap-2">
          {mode.type === "edit" ? (
            <button
              onClick={() => setMode({ type: "list" })}
              className="inline-flex items-center gap-1 rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <button
              onClick={() => setMode({ type: "edit" })}
              className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground"
            >
              <Plus className="h-4 w-4" /> New article
            </button>
          )}
          <button
            onClick={signOut}
            className="inline-flex items-center gap-1 rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      {mode.type === "list" ? (
        <ArticlesList
          key={refreshKey}
          onEdit={(id) => setMode({ type: "edit", id })}
        />
      ) : (
        <ArticleEditor
          id={mode.id}
          onSaved={() => {
            setMode({ type: "list" });
            setRefreshKey((k) => k + 1);
          }}
        />
      )}
    </div>
  );
}

function ArticlesList({ onEdit }: { onEdit: (id: string) => void }) {
  const list = useServerFn(listAdminArticles);
  const del = useServerFn(deleteArticle);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function reload() {
    setLoading(true);
    try {
      const r = await list({});
      setArticles(r.articles);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  async function onDelete(id: string) {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    await del({ data: { id } });
    reload();
  }

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  if (articles.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <h2 className="font-display text-xl font-semibold">No articles yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Click "New article" to publish your first story.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Updated</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a.id} className="border-t border-border">
              <td className="p-3">
                <div className="font-semibold text-foreground">{a.title}</div>
                <div className="text-xs text-muted-foreground">/{a.slug}</div>
              </td>
              <td className="p-3">
                <span
                  className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                    a.status === "published"
                      ? "bg-success/15 text-success"
                      : a.status === "draft"
                        ? "bg-muted text-muted-foreground"
                        : "bg-danger/15 text-danger"
                  }`}
                >
                  {a.status}
                </span>
              </td>
              <td className="p-3 text-muted-foreground">
                {new Date(a.updated_at).toLocaleDateString()}
              </td>
              <td className="p-3">
                <div className="flex justify-end gap-1">
                  {a.status === "published" && (
                    <Link
                      to="/article/$slug"
                      params={{ slug: a.slug }}
                      className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      View
                    </Link>
                  )}
                  <button
                    onClick={() => onEdit(a.id)}
                    className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(a.id)}
                    className="rounded p-1.5 text-muted-foreground hover:bg-danger/10 hover:text-danger"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ArticleEditor({ id, onSaved }: { id?: string; onSaved: () => void }) {
  const load = useServerFn(getAdminArticle);
  const save = useServerFn(upsertArticle);
  const [form, setForm] = useState<any>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "",
    og_image: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    canonical_url: "",
    reading_time: 5,
    status: "draft",
    featured: false,
    trending: false,
    category_id: "",
    faq: [] as { question: string; answer: string }[],
  });
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("categories").select("id,name").order("sort_order");
      setCategories(data ?? []);
    })();
  }, []);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const r = await load({ data: { id } });
      if (r.article) setForm({ ...r.article, faq: r.article.faq ?? [] });
    })();
  }, [id, load]);

  function update<K extends string>(k: K, v: any) {
    setForm((f: any) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        id: id || undefined,
        category_id: form.category_id || null,
        reading_time: Number(form.reading_time) || 5,
      };
      await save({ data: payload });
      onSaved();
    } catch (err: any) {
      setError(err?.message ?? "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <Field label="Title">
          <input
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-base font-semibold outline-none focus:border-ring"
          />
        </Field>
        <Field label="Slug (URL)">
          <input
            value={form.slug ?? ""}
            onChange={(e) => update("slug", e.target.value)}
            placeholder="auto-generated from title"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
          />
        </Field>
        <Field label="Excerpt">
          <textarea
            value={form.excerpt ?? ""}
            onChange={(e) => update("excerpt", e.target.value)}
            rows={2}
            maxLength={500}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
          />
        </Field>
        <Field label="Content (HTML supported)">
          <textarea
            value={form.content ?? ""}
            onChange={(e) => update("content", e.target.value)}
            rows={20}
            className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-xs outline-none focus:border-ring"
            placeholder={`<h2>Section title</h2>\n<p>Article body...</p>`}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Tip: use &lt;h2&gt; and &lt;h3&gt; headings — table of contents and SEO
            heading IDs are generated automatically.
          </p>
        </Field>

        <fieldset className="rounded-lg border border-border p-4">
          <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            FAQ (JSON-LD)
          </legend>
          {(form.faq ?? []).map((f: any, i: number) => (
            <div key={i} className="mt-2 grid gap-2 rounded border border-border p-3">
              <input
                value={f.question}
                onChange={(e) => {
                  const copy = [...form.faq];
                  copy[i] = { ...copy[i], question: e.target.value };
                  update("faq", copy);
                }}
                placeholder="Question"
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
              />
              <textarea
                value={f.answer}
                onChange={(e) => {
                  const copy = [...form.faq];
                  copy[i] = { ...copy[i], answer: e.target.value };
                  update("faq", copy);
                }}
                rows={2}
                placeholder="Answer"
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
              />
              <button
                type="button"
                onClick={() => update("faq", form.faq.filter((_: any, j: number) => j !== i))}
                className="justify-self-start text-xs text-danger hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => update("faq", [...(form.faq ?? []), { question: "", answer: "" }])}
            className="mt-3 rounded-md border border-input px-3 py-1.5 text-xs hover:bg-muted"
          >
            + Add FAQ item
          </button>
        </fieldset>
      </div>

      <aside className="space-y-4">
        <div className="rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground">Publish</h3>
          <div className="mt-3 space-y-3 text-sm">
            <label className="block">
              <span className="text-xs text-muted-foreground">Status</span>
              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update("featured", e.target.checked)}
              />
              <span>Featured</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.trending}
                onChange={(e) => update("trending", e.target.checked)}
              />
              <span>Trending</span>
            </label>
            {error && <p className="text-xs text-danger">{error}</p>}
            <button
              disabled={saving}
              className="w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save article"}
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground">Taxonomy</h3>
          <label className="mt-3 block text-sm">
            <span className="text-xs text-muted-foreground">Category</span>
            <select
              value={form.category_id ?? ""}
              onChange={(e) => update("category_id", e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">— None —</option>
              {(categories.length ? categories : CATEGORIES.map((c) => ({ id: c.slug, name: c.name }))).map(
                (c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ),
              )}
            </select>
          </label>
          <label className="mt-3 block text-sm">
            <span className="text-xs text-muted-foreground">Reading time (min)</span>
            <input
              type="number"
              min={1}
              max={120}
              value={form.reading_time ?? 5}
              onChange={(e) => update("reading_time", e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground">Media</h3>
          <label className="mt-3 block text-sm">
            <span className="text-xs text-muted-foreground">Featured image URL</span>
            <input
              value={form.featured_image ?? ""}
              onChange={(e) => update("featured_image", e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="mt-3 block text-sm">
            <span className="text-xs text-muted-foreground">Open Graph image URL</span>
            <input
              value={form.og_image ?? ""}
              onChange={(e) => update("og_image", e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground">SEO</h3>
          <label className="mt-3 block text-sm">
            <span className="text-xs text-muted-foreground">SEO title</span>
            <input
              value={form.seo_title ?? ""}
              onChange={(e) => update("seo_title", e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              maxLength={200}
            />
          </label>
          <label className="mt-3 block text-sm">
            <span className="text-xs text-muted-foreground">Meta description</span>
            <textarea
              rows={2}
              value={form.seo_description ?? ""}
              onChange={(e) => update("seo_description", e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              maxLength={500}
            />
          </label>
          <label className="mt-3 block text-sm">
            <span className="text-xs text-muted-foreground">Keywords (comma separated)</span>
            <input
              value={form.seo_keywords ?? ""}
              onChange={(e) => update("seo_keywords", e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="mt-3 block text-sm">
            <span className="text-xs text-muted-foreground">Canonical URL (optional)</span>
            <input
              value={form.canonical_url ?? ""}
              onChange={(e) => update("canonical_url", e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </label>
        </div>
      </aside>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
