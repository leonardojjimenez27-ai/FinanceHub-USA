import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — FinanceHub USA" },
      {
        name: "description",
        content:
          "Learn how FinanceHub USA uses cookies and similar technologies for website functionality, analytics, advertising, and user preferences.",
      },
      { property: "og:url", content: "/cookie-policy" },
    ],
    links: [{ rel: "canonical", href: "/cookie-policy" }],
  }),

  component: () => (
    <LegalLayout title="Cookie Policy" updated="August 20, 2026">
      <p>
        This Cookie Policy explains how FinanceHub USA ("we," "us," or "our")
        uses cookies and similar technologies when you visit our website. It
        also explains the choices available to you regarding these
        technologies.
      </p>

      <h2>What Are Cookies?</h2>

      <p>
        Cookies are small text files that websites may store on your device
        when you visit them. They can help websites function properly,
        remember certain preferences, understand how visitors interact with
        content, and support advertising.
      </p>

      <p>
        Cookies may be placed directly by FinanceHub USA or by third-party
        services that operate on our website.
      </p>

      <h2>How We Use Cookies</h2>

      <p>FinanceHub USA may use cookies and similar technologies to:</p>

      <ul>
        <li>Operate and maintain essential website functionality.</li>
        <li>Understand how visitors interact with our website.</li>
        <li>Measure traffic and website performance.</li>
        <li>Remember certain user preferences where applicable.</li>
        <li>Improve our content and overall user experience.</li>
        <li>Support advertising and measure advertising performance.</li>
      </ul>

      <h2>Types of Cookies We May Use</h2>

      <h3>Essential Cookies</h3>

      <p>
        These cookies may be necessary for certain parts of the website to
        function correctly. They can support basic functionality, security,
        and website performance.
      </p>

      <h3>Analytics Cookies</h3>

      <p>
        Analytics cookies help us understand how visitors use FinanceHub USA.
        They may collect information such as pages visited, time spent on the
        website, referring sources, browser type, device information, and
        general interactions with our content.
      </p>

      <p>
        We use this information to understand website performance and improve
        our content and user experience.
      </p>

      <h3>Advertising Cookies</h3>

      <p>
        FinanceHub USA may use third-party advertising services, including
        Google AdSense. These services may use cookies, web beacons, IP
        addresses, or similar technologies to display, personalize, and
        measure advertisements.
      </p>

      <p>
        Third-party vendors, including Google, may use cookies to serve ads
        based on a user's prior visits to FinanceHub USA or other websites.
        Google's use of advertising cookies enables Google and its partners to
        serve ads based on visits to this website and other websites on the
        Internet.
      </p>

      <h3>Preference Cookies</h3>

      <p>
        Where applicable, preference cookies may help remember choices made
        during previous visits so that certain website features can provide a
        more consistent experience.
      </p>

      <h2>Third-Party Cookies</h2>

      <p>
        Some cookies used on FinanceHub USA may be placed by third-party
        services, such as analytics providers or advertising partners. These
        third parties may collect information according to their own privacy
        policies.
      </p>

      <p>
        FinanceHub USA does not directly control all cookies placed by
        third-party services.
      </p>

      <h2>Google Advertising Cookies</h2>

      <p>
        Google may use cookies and similar technologies in connection with
        advertisements displayed on FinanceHub USA.
      </p>

      <p>
        Users can manage their personalized advertising preferences through{" "}
        <a
          href="https://adssettings.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          Google Ads Settings
        </a>
        .
      </p>

      <h2>Managing Cookies</h2>

      <p>
        Most web browsers allow you to control cookies through their settings.
        Depending on your browser, you may be able to block cookies, delete
        existing cookies, or receive notifications before cookies are stored.
      </p>

      <p>
        Disabling certain cookies may affect some website functionality or
        prevent certain features from working as intended.
      </p>

      <h2>Your Privacy Choices</h2>

      <p>
        Depending on your location and applicable privacy laws, you may have
        additional choices regarding cookies, personalized advertising, and
        certain uses of your information.
      </p>

      <p>
        Where required, FinanceHub USA may provide additional consent or
        privacy controls that allow visitors to manage certain categories of
        cookies.
      </p>

      <h2>Changes to This Cookie Policy</h2>

      <p>
        We may update this Cookie Policy from time to time to reflect changes
        in the technologies we use, our advertising practices, website
        functionality, or applicable legal requirements.
      </p>

      <p>
        When changes are made, the "Last updated" date displayed at the top of
        this page will be revised.
      </p>

      <h2>Contact Us</h2>

      <p>
        If you have questions about this Cookie Policy or how FinanceHub USA
        uses cookies, contact us at{" "}
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