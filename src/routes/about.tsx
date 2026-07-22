import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { UserCircle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About FinanceHub USA — Our Mission & Team" },
      { name: "description", content: "FinanceHub USA delivers independent US financial news, expert investing guides, and clear personal finance advice for American readers." },
      { property: "og:title", content: "About FinanceHub USA" },
      { property: "og:description", content: "Our mission: help Americans build lasting wealth with clear, independent financial journalism." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <LegalLayout title="About FinanceHub USA">
      <p>
        FinanceHub USA is an independent financial publication built for American readers.
        We combine reporting on the US economy, markets, and cryptocurrency with clear,
        actionable education on personal finance — from your first budget to your last 401(k) rollover.
      </p>
      
      <h2>Our mission</h2>
      <p>
        Help every American reader make smarter money decisions — with content that is
        easy to understand, rigorously fact-checked, and free of jargon.
      </p>
      
      <h2>Editorial independence</h2>
      <p>
        Our editorial content is independent from advertisers and affiliate partners.
        See our <a href="/editorial-policy">Editorial Policy</a> for details.
      </p>

      {/* ✅ Sección "Meet the Author" */}
      <div className="mt-10 rounded-xl border border-border bg-card p-6 not-prose">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserCircle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-xl font-bold text-foreground">
              Meet the Author
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              FinanceHub USA was founded by <strong>Leonardo Jiménez</strong>, a financial 
              education advocate dedicated to making complex money topics accessible to every American.
            </p>
            <Link
              to="/author/leonardo-jimenez"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
            >
              View full profile <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="mt-8 rounded-xl border border-border bg-secondary/40 p-6 not-prose">
        <h3 className="font-display text-xl font-bold">Subscribe to The Money Briefing</h3>
        <p className="mt-1 text-sm text-muted-foreground">Free daily newsletter. No spam.</p>
        <div className="mt-4 max-w-md">
          <NewsletterForm source="about" compact />
        </div>
      </div>
    </LegalLayout>
  );
}