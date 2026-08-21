import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/editorial-policy")({
  head: () => ({
    meta: [
      { title: "Editorial Policy — FinanceHub USA" },
      {
        name: "description",
        content:
          "Learn about FinanceHub USA's editorial standards, sourcing practices, corrections, and commitment to independent financial content.",
      },
      { property: "og:url", content: "/editorial-policy" },
    ],
    links: [{ rel: "canonical", href: "/editorial-policy" }],
  }),

  component: () => (
    <LegalLayout title="Editorial Policy" updated="August 20, 2026">
      <p>
        FinanceHub USA is committed to publishing clear, useful, and
        research-based financial content for readers in the United States.
        This Editorial Policy explains the principles we follow when creating,
        reviewing, updating, and correcting our content.
      </p>

      <h2>Our Editorial Standards</h2>

      <p>
        Our goal is to make financial topics easier to understand without
        sacrificing important context. Articles are created with an emphasis
        on clarity, accuracy, usefulness, and transparency.
      </p>

      <p>
        Before publication, content is reviewed for factual consistency,
        readability, and the reliability of the information and sources used.
        Because financial information can change over time, readers should
        verify important information with official sources before making
        significant financial decisions.
      </p>

      <h2>Research and Sources</h2>

      <p>
        We aim to rely on credible and authoritative sources when researching
        financial topics. Depending on the subject, these may include
        government agencies, regulatory organizations, official company
        information, financial institutions, market data providers, and
        established research organizations.
      </p>

      <p>
        Whenever practical, we prioritize primary sources such as the Internal
        Revenue Service (IRS), U.S. Securities and Exchange Commission (SEC),
        Federal Reserve, Consumer Financial Protection Bureau (CFPB), and other
        relevant government or regulatory organizations.
      </p>

      <p>
        External sources may be referenced or linked within articles so readers
        can review additional information directly.
      </p>

      <h2>Editorial Independence</h2>

      <p>
        FinanceHub USA maintains editorial independence from advertisers and
        commercial relationships. Advertising does not determine the
        conclusions or viewpoints presented in our editorial content.
      </p>

      <p>
        FinanceHub USA may display third-party advertising, including
        advertising served through Google AdSense. The presence of an
        advertisement does not constitute an endorsement of the advertiser,
        product, or service.
      </p>

      <p>
        If FinanceHub USA uses affiliate relationships or sponsored content in
        the future, applicable commercial relationships will be disclosed to
        readers where appropriate.
      </p>

      <h2>Financial Information and Opinions</h2>

      <p>
        FinanceHub USA publishes financial education, news, commentary, and
        analysis for informational purposes. Content may discuss investments,
        financial products, market developments, or financial strategies, but
        it should not be interpreted as personalized financial, investment,
        tax, or legal advice.
      </p>

      <p>
        Financial markets and personal circumstances can change, and no
        investment strategy or financial product is appropriate for every
        reader. Readers should conduct their own research and, when necessary,
        consult an appropriately qualified professional.
      </p>

      <h2>Corrections</h2>

      <p>
        We aim to correct material factual errors when they are identified. If
        an article contains inaccurate or outdated information, we may update
        the content to reflect more reliable or current information.
      </p>

      <p>
        If you believe you have found an error, please contact us at{" "}
        <a
          href="mailto:admin@financehubus.com"
          className="text-accent hover:underline"
        >
          admin@financehubus.com
        </a>
        .
      </p>

      <h2>Content Updates</h2>

      <p>
        Financial information can change frequently. Tax rules, interest
        rates, contribution limits, financial products, regulations, market
        data, and other information may change after an article is published.
      </p>

      <p>
        We may review and update previously published articles when significant
        changes make an update appropriate. Publication or update dates may be
        displayed on articles to help readers evaluate how current the
        information is.
      </p>

      <h2>Advertising and Commercial Relationships</h2>

      <p>
        Advertising helps support the operation of FinanceHub USA. However,
        editorial content is created independently from advertising decisions.
        Advertisers do not receive control over our editorial conclusions
        simply because their advertisements appear on the website.
      </p>

      <h2>Contact Us</h2>

      <p>
        Questions about this Editorial Policy, corrections, or our content can
        be sent to{" "}
        <a
          href="mailto:admin@financehubus.com"
          className="text-accent hover:underline"
        >
          admin@financehubus.com
        </a>
        .
      </p>
    </LegalLayout>
  ),
});