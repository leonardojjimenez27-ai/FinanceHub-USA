import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { UserCircle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About FinanceHub USA — Our Mission & Editorial Approach" },
      {
        name: "description",
        content:
          "Learn about FinanceHub USA, our mission, editorial approach, and commitment to clear, independent financial education for U.S. readers.",
      },
      { property: "og:title", content: "About FinanceHub USA" },
      {
        property: "og:description",
        content:
          "Learn about the mission and editorial approach behind FinanceHub USA.",
      },
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
        FinanceHub USA is an independent financial publication created to make
        financial topics easier to understand for readers in the United States.
        We publish educational guides, financial news, and analysis covering
        personal finance, investing, retirement, credit, banking, insurance,
        markets, and cryptocurrency.
      </p>

      <p>
        Our goal is to help readers better understand the financial decisions
        they face by presenting complex topics in clear, practical language.
        FinanceHub USA does not provide personalized financial advice, and our
        content is intended for informational and educational purposes.
      </p>

      <h2>Our Mission</h2>

      <p>
        Our mission is to make financial information more understandable and
        useful for everyday readers. Personal finance can be complicated, and
        important financial decisions often involve unfamiliar terminology,
        changing regulations, and competing information.
      </p>

      <p>
        We aim to explain these topics clearly so readers can conduct better
        research, ask better questions, and make more informed decisions about
        their money.
      </p>

      <h2>What We Cover</h2>

      <p>FinanceHub USA publishes content covering topics such as:</p>

      <ul>
        <li>Personal finance and budgeting.</li>
        <li>Investing and exchange-traded funds (ETFs).</li>
        <li>Retirement accounts and long-term financial planning.</li>
        <li>Credit cards, credit scores, and debt.</li>
        <li>Banking, loans, and interest rates.</li>
        <li>Insurance and financial protection.</li>
        <li>U.S. financial markets and economic developments.</li>
        <li>Cryptocurrency and digital assets.</li>
      </ul>

      <h2>Our Editorial Approach</h2>

      <p>
        We aim to produce useful, original content based on research from
        reliable sources. Depending on the subject, these sources may include
        government agencies, regulatory organizations, official company
        information, financial institutions, market data providers, and other
        established sources.
      </p>

      <p>
        Financial information can change quickly. Interest rates, investment
        prices, tax rules, credit card offers, contribution limits, insurance
        terms, and regulations may change after an article is published. We
        encourage readers to verify important information with primary or
        official sources before making significant financial decisions.
      </p>

      <p>
        You can learn more about how we approach our content in our{" "}
        <a
          href="/editorial-policy"
          className="text-accent hover:underline"
        >
          Editorial Policy
        </a>
        .
      </p>

      <h2>Editorial Independence</h2>

      <p>
        FinanceHub USA aims to maintain a clear separation between editorial
        content and advertising. Advertisements or commercial relationships
        should not determine the conclusions presented in our editorial
        content.
      </p>

      <p>
        FinanceHub USA may display third-party advertising, including
        advertising provided through Google AdSense. The presence of an
        advertisement does not necessarily represent an endorsement of the
        advertiser, product, or service.
      </p>

      <h2>Corrections and Updates</h2>

      <p>
        We aim to keep our content accurate and useful. Because financial
        information can change, articles may be reviewed, corrected, or updated
        when new information becomes available or when an error is identified.
      </p>

      <p>
        If you believe an article contains an error or outdated information,
        you can contact us at{" "}
        <a
          href="mailto:admin@financehubus.com"
          className="text-accent hover:underline"
        >
          admin@financehubus.com
        </a>
        .
      </p>

      <h2>About the Founder</h2>

      <div className="mt-6 rounded-xl border border-border bg-card p-6 not-prose">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserCircle className="h-6 w-6" />
          </div>

          <div className="flex-1">
            <h3 className="font-display text-xl font-bold text-foreground">
              Leonardo Jiménez
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Leonardo Jiménez is the founder of FinanceHub USA. He created the
              publication with the goal of making investing, personal finance,
              and other financial topics easier for everyday readers to
              understand through clear, research-based educational content.
            </p>

            <Link
              to="/author/leonardo-jimenez"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
            >
              View full author profile{" "}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <h2>Contact FinanceHub USA</h2>

      <p>
        Questions, corrections, feedback, or other inquiries can be sent to{" "}
        <a
          href="mailto:admin@financehubus.com"
          className="text-accent hover:underline"
        >
          admin@financehubus.com
        </a>
        .
      </p>

      <div className="mt-8 rounded-xl border border-border bg-secondary/40 p-6 not-prose">
        <h3 className="font-display text-xl font-bold">
          Subscribe to The Money Briefing
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Get financial insights and new FinanceHub USA content delivered to
          your inbox.
        </p>

        <div className="mt-4 max-w-md">
          <NewsletterForm source="about" compact />
        </div>
      </div>
    </LegalLayout>
  );
}