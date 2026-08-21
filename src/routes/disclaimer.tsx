import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — FinanceHub USA" },
      {
        name: "description",
        content:
          "Important information about the financial, investment, tax, credit, insurance, and educational content published by FinanceHub USA.",
      },
      { property: "og:url", content: "/disclaimer" },
    ],
    links: [{ rel: "canonical", href: "/disclaimer" }],
  }),

  component: () => (
    <LegalLayout title="Disclaimer" updated="August 20, 2026">
      <p>
        The information published on FinanceHub USA is provided for general
        informational and educational purposes only. Nothing on this website
        should be interpreted as personalized financial, investment, tax,
        legal, accounting, insurance, credit, or other professional advice.
      </p>

      <h2>Not Financial or Investment Advice</h2>

      <p>
        FinanceHub USA provides financial education, news, analysis, guides,
        and commentary intended to help readers better understand financial
        topics.
      </p>

      <p>
        The information published on this website does not constitute a
        recommendation or solicitation to buy, sell, or hold any security,
        cryptocurrency, investment product, financial product, or other asset.
      </p>

      <p>
        FinanceHub USA is not a registered investment adviser, broker-dealer,
        financial planner, tax adviser, law firm, or accounting firm.
      </p>

      <h2>Investment Risk</h2>

      <p>
        All investments involve risk, including the possible loss of some or
        all of the money invested. Stocks, exchange-traded funds (ETFs),
        cryptocurrencies, bonds, and other financial assets may increase or
        decrease in value.
      </p>

      <p>
        Past performance does not guarantee future results. Historical
        returns, examples, projections, analyst expectations, or hypothetical
        scenarios discussed on FinanceHub USA should not be interpreted as
        guarantees of future performance.
      </p>

      <p>
        You are responsible for evaluating your own financial circumstances,
        investment objectives, time horizon, and tolerance for risk before
        making investment decisions.
      </p>

      <h2>Accuracy and Timeliness of Information</h2>

      <p>
        FinanceHub USA makes reasonable efforts to publish useful and accurate
        information. However, financial information can change rapidly.
      </p>

      <p>
        Stock prices, cryptocurrency prices, interest rates, credit card
        offers, banking products, insurance terms, tax rules, contribution
        limits, regulations, fees, and other financial information may change
        after an article is published.
      </p>

      <p>
        We do not guarantee that every piece of information on FinanceHub USA
        will always be complete, accurate, current, or free from errors.
        Readers should verify important information using official sources
        before making significant financial decisions.
      </p>

      <h2>Taxes and Legal Information</h2>

      <p>
        Articles discussing taxes, regulations, or legal topics are provided
        for general educational purposes only and should not be considered
        individualized tax or legal advice.
      </p>

      <p>
        Tax laws and regulations may change and can apply differently depending
        on individual circumstances. Consider consulting a qualified tax or
        legal professional when making decisions involving your specific
        situation.
      </p>

      <h2>Credit Cards, Loans, Banking, and Insurance</h2>

      <p>
        FinanceHub USA may publish educational information about credit cards,
        loans, banking products, insurance, credit scores, interest rates, and
        related financial services.
      </p>

      <p>
        Product terms, interest rates, annual percentage rates (APRs), fees,
        rewards, eligibility requirements, insurance premiums, coverage, and
        other conditions are determined by the respective financial
        institution or provider and may change without notice.
      </p>

      <p>
        Readers should verify current terms directly with the relevant
        financial institution, insurer, lender, or other provider before
        applying for or purchasing a financial product.
      </p>

      <h2>Cryptocurrency Risk</h2>

      <p>
        Cryptocurrency and digital assets can be highly volatile and may
        involve significant financial, technological, regulatory, and security
        risks.
      </p>

      <p>
        Cryptocurrency-related content published by FinanceHub USA is provided
        for educational purposes and should not be interpreted as a
        recommendation to purchase or sell any digital asset.
      </p>

      <h2>Third-Party Information and Links</h2>

      <p>
        FinanceHub USA may reference or link to third-party websites,
        government agencies, financial institutions, companies, research
        organizations, and other external resources.
      </p>

      <p>
        External links are provided for convenience or additional information.
        FinanceHub USA does not control third-party websites and cannot
        guarantee their accuracy, availability, security, products, services,
        or privacy practices.
      </p>

      <h2>Advertising Disclosure</h2>

      <p>
        FinanceHub USA may display advertisements provided by third-party
        advertising networks, including Google AdSense.
      </p>

      <p>
        Advertisements displayed on the website do not necessarily represent
        an endorsement or recommendation by FinanceHub USA of the advertiser,
        product, or service.
      </p>

      <h2>Affiliate Disclosure</h2>

      <p>
        FinanceHub USA may introduce affiliate partnerships in the future. If
        affiliate links are used, we may receive compensation when a reader
        completes a qualifying action through certain links, at no additional
        cost to the reader.
      </p>

      <p>
        Where applicable, affiliate relationships will be disclosed in
        accordance with relevant requirements. Compensation does not guarantee
        favorable coverage or recommendations.
      </p>

      <h2>Editorial Independence</h2>

      <p>
        FinanceHub USA aims to provide useful, fact-based financial education
        and analysis. Advertising relationships or potential commercial
        relationships should not determine the conclusions presented in our
        editorial content.
      </p>

      <h2>No Guarantees</h2>

      <p>
        FinanceHub USA does not guarantee that following any strategy,
        suggestion, example, or educational information presented on this
        website will produce a particular financial result.
      </p>

      <p>
        Financial decisions involve individual circumstances and risks, and
        results may vary significantly from person to person.
      </p>

      <h2>Consult a Qualified Professional</h2>

      <p>
        Before making significant investment, tax, legal, insurance, credit,
        retirement, or other financial decisions, consider consulting an
        appropriately qualified professional who can evaluate your individual
        circumstances.
      </p>

      <h2>Contact Us</h2>

      <p>
        If you have questions about this Disclaimer, contact FinanceHub USA at{" "}
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