import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — FinanceHub USA" },
      { name: "description", content: "FinanceHub USA content is educational only and not personalized financial, tax, or legal advice." },
      { property: "og:url", content: "/disclaimer" },
    ],
    links: [{ rel: "canonical", href: "/disclaimer" }],
  }),
  component: () => (
    <LegalLayout title="Disclaimer" updated="July 12, 2026">
      <p>
        The information provided on FinanceHub USA is for general informational and
        educational purposes only. Nothing on this site should be construed as
        personalized investment, tax, legal, accounting, or other professional advice.
      </p>
      <h2>Not investment advice</h2>
      <p>
        We are not a registered investment adviser or broker-dealer. All investing
        involves risk, including possible loss of principal. Past performance does not
        guarantee future results.
      </p>
      <h2>Affiliate & advertising disclosure</h2>
      <p>
        FinanceHub USA may earn commissions on some of the products and services featured
        on the site. This does not influence our editorial reviews or ratings.
      </p>
      <h2>Consult a professional</h2>
      <p>
        Before making financial, tax, or legal decisions, consult a qualified licensed
        professional who can evaluate your specific situation.
      </p>
    </LegalLayout>
  ),
});
