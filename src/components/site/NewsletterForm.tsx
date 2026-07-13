import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { subscribeNewsletter } from "@/lib/content.functions";
import { Mail, CheckCircle2 } from "lucide-react";

export function NewsletterForm({ source = "footer", compact = false }: { source?: string; compact?: boolean }) {
  const subscribe = useServerFn(subscribeNewsletter);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await subscribe({ data: { email, source } });
      if (res.ok) {
        setStatus("ok");
        setMessage(res.message);
        setEmail("");
      } else {
        setStatus("err");
        setMessage(res.message);
      }
    } catch {
      setStatus("err");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "ok") {
    return (
      <div className={`flex items-center gap-2 rounded-md bg-success/10 px-3 py-2 text-sm text-success ${compact ? "" : "w-full"}`}>
        <CheckCircle2 className="h-4 w-4" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      {!compact && (
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Get the daily money briefing
        </label>
      )}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <button
          disabled={status === "loading"}
          className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:brightness-95 disabled:opacity-60"
        >
          {status === "loading" ? "…" : "Subscribe"}
        </button>
      </div>
      {status === "err" && (
        <p className="mt-2 text-xs text-danger">{message}</p>
      )}
      {!compact && (
        <p className="mt-2 text-xs text-muted-foreground">
          Free. No spam. Unsubscribe anytime.
        </p>
      )}
    </form>
  );
}
