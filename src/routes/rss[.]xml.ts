import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getRssItems } from "@/lib/content.functions";

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { items } = await getRssItems();
        const rssItems = items
          .map(
            (a: any) => `    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>/article/${a.slug}</link>
      <guid isPermaLink="false">/article/${a.slug}</guid>
      <pubDate>${new Date(a.published_at || Date.now()).toUTCString()}</pubDate>
      <description><![CDATA[${a.excerpt ?? ""}]]></description>
    </item>`,
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>FinanceHub USA</title>
    <link>/</link>
    <description>US financial news, investing guides, and personal finance advice.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${rssItems}
  </channel>
</rss>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
