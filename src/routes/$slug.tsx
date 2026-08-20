import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { getArticleBySlug } from "../lib/content.functions";

export const Route = createFileRoute("/$slug")({
  loader: async ({ params }) => {
    const { slug } = params;

    console.log(`[legacy redirect] Checking slug: ${slug}`);

    let article;

    try {
      article = await getArticleBySlug({
        data: {
          slug,
        },
      });
    } catch (error) {
      console.error(
        `[legacy redirect] Error checking article: ${slug}`,
        error
      );

      throw notFound();
    }

    if (!article) {
      console.log(`[legacy redirect] Article not found: ${slug}`);
      throw notFound();
    }

    console.log(
      `[legacy redirect] Redirecting /${slug} -> /article/${slug}`
    );

    throw redirect({
      to: "/article/$slug",
      params: {
        slug,
      },
      statusCode: 301,
    });
  },

  component: () => null,
});