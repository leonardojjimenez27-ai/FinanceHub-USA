import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — FinanceHub USA" },
      { name: "description", content: "Terms governing your use of the FinanceHub USA website and services." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => (
    <LegalLayout title="Terms of Service" updated="July 12, 2026">
      <p>
        These Terms of Service ("Terms") govern your use of FinanceHub USA. By using
        the site you agree to these Terms.
      </p>
      <h2>Use of the site</h2>
      <p>
        You may access the site for personal, non-commercial use. You may not scrape,
        republish, or resell our content without written permission.
      </p>
      <h2>User accounts</h2>
      <p>
        You are responsible for keeping your account credentials secure and for all
        activity performed under your account.
      </p>
      <h2>No investment advice</h2>
      <p>
        All content is provided for informational and educational purposes only and is
        not personalized investment, tax, or legal advice. See our
        <a href="/disclaimer"> Disclaimer</a> for the full text.
      </p>
      <h2>Intellectual property</h2>
      <p>
        All original content is © FinanceHub USA. All third-party trademarks belong to
        their respective owners.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, FinanceHub USA is not liable for any
        indirect, incidental, or consequential damages arising from your use of the site.
      </p>
      <h2>Contact</h2>
      <p>Questions about these Terms? Contact legal@financehubusa.example.</p>
    </LegalLayout>
  ),
});
