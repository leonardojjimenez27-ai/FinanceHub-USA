import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { getArticleBySlug } from "../lib/content.functions";

export const Route = createFileRoute("/$slug")({
  loader: async ({ params }) => {
    const { slug } = params;

    try {
      // Comprobamos si realmente existe un artículo con este slug.
      const article = await getArticleBySlug({
        data: {
          slug,
        },
      });

      // Si no existe ningún artículo con ese slug,
      // devolvemos un 404 real.
      if (!article) {
        throw notFound();
      }

      // Si existe, redirigimos permanentemente a la URL canónica.
      throw redirect({
        to: "/article/$slug",
        params: {
          slug,
        },
        statusCode: 301,
      });
    } catch (error) {
      // Los redirects y notFound de TanStack Router
      // deben propagarse.
      if (
        error &&
        typeof error === "object" &&
        ("isRedirect" in error ||
          "isNotFound" in error ||
          "statusCode" in error)
      ) {
        throw error;
      }

      console.error(`[legacy article redirect] Error checking slug: ${slug}`, error);

      throw notFound();
    }
  },

  component: () => null,
});