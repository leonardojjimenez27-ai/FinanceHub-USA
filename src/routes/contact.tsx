import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — FinanceHub USA" },
      {
        name: "description",
        content:
          "Contact FinanceHub USA for editorial feedback, corrections, general inquiries, advertising, and partnership opportunities.",
      },
      { property: "og:title", content: "Contact FinanceHub USA" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),

  component: Contact,
});

function Contact() {
  return (
    <LegalLayout title="Contact Us">
      <p>
        Have a question, found something that needs correction, or want to
        discuss a business opportunity? You can contact FinanceHub USA directly
        using the information below.
      </p>

      <div className="not-prose mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border p-5">
          <h3 className="font-display text-lg font-bold">
            General &amp; Editorial
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Questions, editorial feedback, corrections, or general inquiries.
          </p>

          <a
            href="mailto:admin@financehubus.com"
            className="mt-3 flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <Mail className="h-4 w-4" />
            admin@financehubus.com
          </a>
        </div>

        <div className="rounded-lg border border-border p-5">
          <h3 className="font-display text-lg font-bold">
            Advertising &amp; Partnerships
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Advertising inquiries, partnerships, and other business
            opportunities.
          </p>

          <a
            href="mailto:admin@financehubus.com"
            className="mt-3 flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <Mail className="h-4 w-4" />
            admin@financehubus.com
          </a>
        </div>
      </div>

      <div className="not-prose mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-bold">
          Email FinanceHub USA
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Email is currently the best way to reach us. We review messages
          related to corrections, editorial feedback, general questions, and
          business inquiries.
        </p>

        <a
          href="mailto:admin@financehubus.com"
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          <Mail className="h-4 w-4" />
          Send an Email
        </a>
      </div>

      <h2>Corrections and Editorial Feedback</h2>

      <p>
        Accuracy is important to FinanceHub USA. If you believe an article
        contains incorrect, outdated, or unclear information, please contact us
        and include the URL of the article along with a description of the
        issue.
      </p>

      <h2>Business Inquiries</h2>

      <p>
        For advertising, partnerships, or other business-related inquiries,
        contact us at{" "}
        <a
          href="mailto:admin@financehubus.com"
          className="text-accent hover:underline"
        >
          admin@financehubus.com
        </a>
        .
      </p>
    </LegalLayout>
  );
}