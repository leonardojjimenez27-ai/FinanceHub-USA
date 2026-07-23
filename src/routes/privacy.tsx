import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — FinanceHub USA" },
      { name: "description", content: "How FinanceHub USA collects, uses, and protects your personal information." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: () => (
    <LegalLayout title="Privacy Policy" updated="July 12, 2026">
      <p>
        This Privacy Policy explains how FinanceHub USA ("we", "us") collects,
        uses, and shares information about you when you use our website.
      </p>
      <h2>Information we collect</h2>
      <p>
        We collect information you provide directly (like your email when you subscribe to
        the newsletter or create an account), plus usage information (such as pages viewed,
        device type, and referring URL) collected automatically.
      </p>
      <h2>How we use your information</h2>
      <ul>
        <li>To operate and improve the website</li>
        <li>To send you newsletters and content you have requested</li>
        <li>To personalize your experience and measure our reach</li>
        <li>To comply with legal obligations</li>
      </ul>
      <h2>Advertising</h2>
      <p>
        We display advertising served by third-party ad networks (including Google AdSense).
        These partners may use cookies and similar technologies to serve ads based on your
        prior visits to this site and other sites on the internet.
      </p>
      <h2>Analytics</h2>
      <p>We use analytics tools to understand how the site is used. Data is aggregated and does not personally identify you.</p>
      <h2>Your choices</h2>
      <p>You can unsubscribe from emails at any time, or delete your account by contacting us.</p>
      <h2>Contact</h2>
      <p>Questions? Contact us at <a href="mailto:admin@financehubus.com" className="text-accent hover:underline">admin@financehubus.com</a>.</p>
    </LegalLayout>
  ),
});