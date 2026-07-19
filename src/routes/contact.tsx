import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";
import { useState } from "react";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — FinanceHub USA" },
      { name: "description", content: "Get in touch with the FinanceHub USA editorial team, advertising partners, or general inquiries." },
      { property: "og:title", content: "Contact FinanceHub USA" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <LegalLayout title="Contact us">
      <p>
        We'd love to hear from you — whether it's a story tip, editorial feedback,
        advertising inquiry, or partnership idea.
      </p>
      <div className="not-prose mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border p-5">
          <h3 className="font-display text-lg font-bold">General & editorial</h3>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" /> admin@financehubus.com
          </p>
        </div>
        <div className="rounded-lg border border-border p-5">
          <h3 className="font-display text-lg font-bold">Advertising & partnerships</h3>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" /> admin@financehubus.com
          </p>
        </div>
      </div>

      <form
        className="not-prose mt-8 grid gap-3 rounded-xl border border-border bg-card p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <h3 className="font-display text-xl font-bold">Send us a message</h3>
        {sent ? (
          <p className="rounded-md bg-success/10 p-3 text-sm text-success">
            Thanks — your message has been received.
          </p>
        ) : (
          <>
            <input required placeholder="Your name" maxLength={80} className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none" />
            <input required type="email" placeholder="admin@financehubus.com" maxLength={200} className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none" />
            <input required placeholder="Subject" maxLength={120} className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none" />
            <textarea required rows={5} placeholder="Your message" maxLength={2000} className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none" />
            <button className="justify-self-start rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
              Send message
            </button>
          </>
        )}
      </form>
    </LegalLayout>
  );
}