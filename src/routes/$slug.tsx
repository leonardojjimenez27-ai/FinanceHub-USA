import {
  createFileRoute,
  notFound,
  redirect,
} from "@tanstack/react-router";

import { getArticleBySlug } from "@/lib/content.functions";

export const Route = createFileRoute("/$slug")({
  loader: async ({ params }) => {
    const slug = params.slug?.trim();

    if (!slug) {
      throw notFound();
    }

    console.log(
      "🔀 [legacy article route] Checking slug:",
      slug,
    );

    let result;

    try {
      result = await getArticleBySlug({
        data: {
          slug,
        },
      });
    } catch (error) {
      console.error(
        "❌ [legacy article route] Error checking slug:",
        slug,
        error,
      );

      throw error;
    }

    // getArticleBySlug devuelve:
    // {
    //   article: ...,
    //   related: [...]
    // }
    //
    // Si el artículo no existe o no está publicado,
    // esta URL debe ser un 404 real.
    if (!result?.article) {
      console.log(
        "⚠️ [legacy article route] Article not found:",
        slug,
      );

      throw notFound();
    }

    console.log(
      "➡️ [legacy article route] Redirecting:",
      `/${slug}`,
      "→",
      `/article/${slug}`,
    );

    // La URL oficial/canónica de los artículos es:
    // /article/$slug
    //
    // Las URLs antiguas /$slug redirigen permanentemente
    // hacia la URL oficial.
    throw redirect({
      to: "/article/$slug",
      params: {
        slug,
      },
      statusCode: 301,
    });
  },

  component: LegacyArticleRedirectPage,

  notFoundComponent: LegacyArticleNotFound,
});

function LegacyArticleRedirectPage() {
  return null;
}

function LegacyArticleNotFound() {
  return (
    <main className="container-page py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent">
        404
      </p>

      <h1 className="mt-3 font-display text-4xl font-bold text-foreground">
        Page not found
      </h1>

      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="mt-8">
        <a
          href="/"
          className="inline-flex rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground"
        >
          Go home
        </a>
      </div>
    </main>
  );
}