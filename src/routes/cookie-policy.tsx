import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — FinanceHub USA" },
      { name: "description", content: "How FinanceHub USA uses cookies and similar technologies, and how you can manage them." },
      { property: "og:url", content: "/cookie-policy" },
    ],
    links: [{ rel: "canonical", href: "/cookie-policy" }],
  }),
  component: () => (
    <LegalLayout title="Cookie Policy" updated="July 12, 2026">
      <p>
        We use cookies to run the site, remember your preferences, measure traffic, and
        serve advertising.
      </p>
      <h2>Categories we use</h2>
      <ul>
        <li><strong>Strictly necessary</strong> — sign-in and security.</li>
        <li><strong>Preferences</strong> — dark mode, saved articles.</li>
        <li><strong>Analytics</strong> — aggregate audience measurement.</li>
        <li><strong>Advertising</strong> — third-party ad networks (e.g. Google AdSense, Ezoic).</li>
      </ul>
      <h2>Managing cookies</h2>
      <p>
        You can control cookies in your browser settings. Blocking some cookies may
        break parts of the site.
      </p>
    </LegalLayout>
  ),
});
