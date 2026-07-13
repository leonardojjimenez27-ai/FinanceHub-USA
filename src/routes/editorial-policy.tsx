import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/editorial-policy")({
  head: () => ({
    meta: [
      { title: "Editorial Policy — FinanceHub USA" },
      { name: "description", content: "Our editorial standards, fact-checking process, and how we keep FinanceHub USA independent from advertisers." },
      { property: "og:url", content: "/editorial-policy" },
    ],
    links: [{ rel: "canonical", href: "/editorial-policy" }],
  }),
  component: () => (
    <LegalLayout title="Editorial Policy" updated="July 12, 2026">
      <h2>Our standards</h2>
      <p>
        Every FinanceHub USA article is written by a knowledgeable contributor, reviewed
        by an editor, and fact-checked against primary sources (SEC filings, IRS
        publications, Federal Reserve data, and reputable news outlets).
      </p>
      <h2>Independence</h2>
      <p>
        Our editorial team is independent from our advertising and affiliate teams. Our
        opinions and ratings are our own and are never influenced by compensation.
      </p>
      <h2>Corrections</h2>
      <p>
        If you spot an error, please email <em>editors@financehubusa.example</em>. We
        promptly update articles and disclose material corrections.
      </p>
      <h2>Sources</h2>
      <p>
        We link to primary sources when possible. Where we cite research, we identify
        the researcher, publication, and date.
      </p>
    </LegalLayout>
  ),
});
