import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — FinanceHub USA" },
      {
        name: "description",
        content:
          "Learn how FinanceHub USA collects, uses, protects, and shares information, including details about cookies, analytics, and advertising.",
      },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),

  component: () => (
    <LegalLayout title="Privacy Policy" updated="August 20, 2026">
      <p>
        FinanceHub USA ("we," "us," or "our") respects your privacy. This
        Privacy Policy explains how information may be collected, used, and
        shared when you visit or interact with FinanceHub USA.
      </p>

      <h2>Information We Collect</h2>

      <p>
        We may collect information that you voluntarily provide to us, such as
        your email address when you subscribe to a newsletter, contact us, or
        otherwise submit information through the website.
      </p>

      <p>
        We may also automatically collect certain technical and usage
        information when you visit FinanceHub USA. This may include your IP
        address, browser type, device type, referring URL, pages viewed,
        approximate location, and general interactions with the website.
      </p>

      <h2>How We Use Your Information</h2>

      <p>We may use information collected through FinanceHub USA to:</p>

      <ul>
        <li>Operate, maintain, and improve the website.</li>
        <li>Understand how visitors use our content and services.</li>
        <li>Measure website performance and audience engagement.</li>
        <li>Send newsletters or communications you have requested.</li>
        <li>Prevent fraud, abuse, or security issues.</li>
        <li>Comply with applicable legal obligations.</li>
      </ul>

      <h2>Cookies and Similar Technologies</h2>

      <p>
        FinanceHub USA and third-party service providers may use cookies, web
        beacons, IP addresses, and similar technologies to operate the website,
        understand visitor activity, measure performance, and support
        advertising.
      </p>

      <p>
        Cookies are small files stored on your device that can help websites
        remember information about your visit. You may be able to control or
        delete cookies through your browser settings. Disabling certain cookies
        may affect some website features.
      </p>

      <h2>Advertising and Google AdSense</h2>

      <p>
        FinanceHub USA may use Google AdSense and other third-party advertising
        services to display advertisements.
      </p>

      <p>
        Third-party vendors, including Google, may use cookies to serve ads
        based on a user's prior visits to FinanceHub USA or other websites.
        Google's use of advertising cookies enables Google and its partners to
        serve ads to users based on visits to this website and other websites
        on the Internet.
      </p>

      <p>
        Third parties may also place and read cookies on your browser or use
        web beacons, IP addresses, or similar technologies to collect
        information as a result of advertisements being served on this website.
      </p>

      <p>
        Users can manage personalized advertising preferences through{" "}
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

      <h2>Analytics</h2>

      <p>
        We may use analytics services to better understand how visitors
        interact with FinanceHub USA. These services may collect information
        such as pages visited, approximate location, device information,
        browser type, referring sources, and interactions with the website.
      </p>

      <p>
        Analytics information helps us understand website performance, improve
        our content, identify technical issues, and improve the overall user
        experience.
      </p>

      <h2>Third-Party Services and Links</h2>

      <p>
        FinanceHub USA may contain links to third-party websites, services, or
        resources. We are not responsible for the privacy practices, security,
        content, or policies of third-party websites.
      </p>

      <p>
        We encourage visitors to review the privacy policies of external
        websites before providing personal information to them.
      </p>

      <h2>Your Privacy Choices</h2>

      <p>
        Depending on your location, you may have certain rights regarding your
        personal information under applicable privacy laws.
      </p>

      <p>These rights may include the ability to:</p>

      <ul>
        <li>Request access to certain personal information.</li>
        <li>Request correction of inaccurate personal information.</li>
        <li>Request deletion of certain personal information.</li>
        <li>
          Exercise choices regarding certain uses of personal information for
          advertising.
        </li>
        <li>Unsubscribe from newsletters or marketing emails.</li>
      </ul>

      <p>
        You may also manage cookies through your browser settings and, where
        available, through consent or privacy controls provided on FinanceHub
        USA.
      </p>

      <h2>Children's Privacy</h2>

      <p>
        FinanceHub USA is intended for a general audience and is not directed
        to children under the age of 13. We do not knowingly collect personal
        information from children under 13.
      </p>

      <p>
        If we become aware that personal information from a child under 13 has
        been collected, we will take reasonable steps to delete it.
      </p>

      <h2>Data Security</h2>

      <p>
        We take reasonable measures to help protect information collected
        through FinanceHub USA. However, no website, Internet transmission, or
        electronic storage system can be guaranteed to be completely secure.
      </p>

      <h2>Changes to This Privacy Policy</h2>

      <p>
        We may update this Privacy Policy from time to time to reflect changes
        to our website, services, advertising practices, technologies, or legal
        requirements.
      </p>

      <p>
        When changes are made, the "Last updated" date displayed at the top of
        this page will be revised.
      </p>

      <h2>Contact Us</h2>

      <p>
        If you have questions about this Privacy Policy or privacy practices at
        FinanceHub USA, contact us at{" "}
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