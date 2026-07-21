import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getSitemapEntries } from "@/lib/content.functions";
import { CATEGORIES } from "@/lib/categories";

const BASE_URL = "https://www.financehubus.com";

const STATIC_PATHS = [
  "/",
  "/tools",
  "/tools/compound-interest",
  "/tools/mortgage",
  "/tools/loan",
  "/search",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/editorial-policy",
  "/cookie-policy",
  "/dashboard",
  "/dashboard/crypto",
  "/dashboard/stocks",
  "/etf-screener",
  "/dividend-screener",
  "/economic-calendar",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const data = await getSitemapEntries();
        const nowIso = new Date().toISOString();

        const urls: string[] = [];

        for (const path of STATIC_PATHS) {
          urls.push(url(path, nowIso, path === "/" ? "1.0" : "0.6", "weekly"));
        }

        for (const cat of CATEGORIES) {
          urls.push(
            url(
              `/category/${cat.slug}`,
              data.categories.find((c: any) => c.slug === cat.slug)?.updated_at || nowIso,
              "0.8",
              "daily",
            ),
          );
        }

        for (const a of data.articles) {
          urls.push(
            url(
              `/article/${a.slug}`,
              a.updated_at || a.published_at || nowIso,
              "0.7",
              "weekly",
            ),
          );
        }

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});

function url(path: string, lastmod: string, priority: string, changefreq: string) {
  return `  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}