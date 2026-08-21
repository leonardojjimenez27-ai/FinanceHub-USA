import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — FinanceHub USA" },
      {
        name: "description",
        content:
          "Terms governing your use of the FinanceHub USA website, financial content, resources, and services.",
      },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),

  component: () => (
    <LegalLayout title="Terms of Service" updated="August 20, 2026">
      <p>
        These Terms of Service ("Terms") govern your access to and use of
        FinanceHub USA. By accessing or using this website, you agree to these
        Terms. If you do not agree with these Terms, please discontinue use of
        the website.
      </p>

      <h2>Use of FinanceHub USA</h2>

      <p>
        FinanceHub USA provides financial information, educational resources,
        news, analysis, and related content for general informational purposes.
      </p>

      <p>
        You may access and use the website for lawful personal purposes. You
        agree not to use FinanceHub USA in a way that could damage, disable,
        interfere with, or compromise the security or operation of the website.
      </p>

      <p>
        Unless you have received prior written permission from FinanceHub USA,
        you may not reproduce, republish, distribute, sell, scrape, or
        commercially exploit substantial portions of our original content.
      </p>

      <h2>Financial Information and No Professional Advice</h2>

      <p>
        Content published on FinanceHub USA is provided for informational and
        educational purposes only. Nothing on this website should be considered
        personalized financial, investment, tax, legal, insurance, accounting,
        or other professional advice.
      </p>

      <p>
        Financial decisions involve risk, and individual circumstances vary.
        You should conduct your own research and, when appropriate, consult a
        qualified professional before making significant financial decisions.
      </p>

      <p>
        For additional information, please review our{" "}
        <a href="/disclaimer" className="text-accent hover:underline">
          Disclaimer
        </a>
        .
      </p>

      <h2>Investment Risk</h2>

      <p>
        Investing involves risk, including the possible loss of principal.
        Past performance does not guarantee future results, and no investment
        strategy, security, asset, or financial product discussed on FinanceHub
        USA is guaranteed to produce profits or prevent losses.
      </p>

      <p>
        References to stocks, exchange-traded funds, cryptocurrencies, credit
        products, financial institutions, or other financial products are
        provided for informational purposes and should not be interpreted as a
        recommendation to buy, sell, or hold any particular investment or
        financial product.
      </p>

      <h2>Accuracy of Information</h2>

      <p>
        We make reasonable efforts to provide useful and accurate information.
        However, financial markets, interest rates, tax rules, regulations,
        product terms, fees, offers, and other financial information can change
        over time.
      </p>

      <p>
        FinanceHub USA does not guarantee that all information on the website
        will always be complete, accurate, current, or free from errors. Readers
        should verify important information with official or primary sources
        before making financial decisions.
      </p>

      <h2>Third-Party Websites and Services</h2>

      <p>
        FinanceHub USA may contain links to third-party websites, financial
        institutions, government resources, products, services, or other
        external resources.
      </p>

      <p>
        These links may be provided for convenience, reference, or additional
        information. FinanceHub USA does not control third-party websites and
        is not responsible for their content, availability, security, accuracy,
        products, services, or privacy practices.
      </p>

      <h2>Advertising</h2>

      <p>
        FinanceHub USA may display advertisements provided by third-party
        advertising networks, including Google AdSense.
      </p>

      <p>
        The presence of an advertisement on FinanceHub USA does not necessarily
        constitute an endorsement or recommendation of the advertiser, product,
        or service.
      </p>

      <h2>Intellectual Property</h2>

      <p>
        Unless otherwise indicated, original articles, written content,
        branding, design elements, and other original materials published by
        FinanceHub USA are owned by or licensed to FinanceHub USA and are
        protected by applicable intellectual property laws.
      </p>

      <p>
        Company names, product names, logos, trademarks, and other third-party
        intellectual property referenced on the website remain the property of
        their respective owners.
      </p>

      <h2>Prohibited Uses</h2>

      <p>You agree not to use FinanceHub USA to:</p>

      <ul>
        <li>Violate applicable laws or regulations.</li>
        <li>Attempt to gain unauthorized access to the website or its systems.</li>
        <li>Disrupt or interfere with the security or operation of the website.</li>
        <li>
          Distribute malicious software, harmful code, or other destructive
          technologies.
        </li>
        <li>
          Copy, republish, or commercially exploit substantial portions of our
          original content without authorization.
        </li>
        <li>
          Misrepresent FinanceHub USA content as your own original work.
        </li>
      </ul>

      <h2>No Guarantees</h2>

      <p>
        FinanceHub USA does not guarantee any particular financial,
        investment, credit, tax, insurance, or other outcome resulting from
        information obtained through this website.
      </p>

      <p>
        Any financial examples, calculations, projections, or hypothetical
        scenarios presented on FinanceHub USA are provided for educational
        purposes and may not reflect actual future results.
      </p>

      <h2>Limitation of Liability</h2>

      <p>
        To the maximum extent permitted by applicable law, FinanceHub USA and
        its owners, contributors, and service providers will not be liable for
        losses or damages arising from or related to your use of, or reliance
        on, information provided through the website.
      </p>

      <p>
        You are responsible for evaluating information and making your own
        financial decisions.
      </p>

      <h2>Changes to These Terms</h2>

      <p>
        We may update these Terms from time to time to reflect changes to
        FinanceHub USA, our practices, technologies, or applicable legal
        requirements.
      </p>

      <p>
        When these Terms are updated, the "Last updated" date displayed at the
        top of this page will be revised. Continued use of FinanceHub USA after
        changes become effective constitutes acceptance of the updated Terms.
      </p>

      <h2>Contact Us</h2>

      <p>
        If you have questions about these Terms of Service, contact us at{" "}
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