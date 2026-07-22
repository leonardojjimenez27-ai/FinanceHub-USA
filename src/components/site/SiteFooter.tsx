import { Link } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { FOOTER_GROUPS, categoryName } from "@/lib/categories";
import { NewsletterForm } from "./NewsletterForm";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-border bg-secondary/40">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
                <TrendingUp className="h-4 w-4" />
              </span>
              <span>
                FinanceHub<span className="text-accent"> USA</span>
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Independent US financial news, education, and market analysis to help
              Americans build lasting wealth.
            </p>
            <div className="mt-5">
              <NewsletterForm source="footer" />
            </div>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <div key={group.label}>
              <h3 className="font-display text-sm font-semibold text-foreground">
                {group.label}
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                {group.slugs.map((slug) => (
                  <li key={slug}>
                    <Link
                      to="/category/$slug"
                      params={{ slug }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {categoryName(slug)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} FinanceHub USA. All rights reserved.</p>
          <nav className="flex flex-wrap gap-4">
            {/* ✅ Enlace a la página de autor */}
            <Link to="/author/leonardo-jimenez" className="hover:text-foreground">
              Author
            </Link>
            <Link to="/about" className="hover:text-foreground">About</Link>
            <Link to="/contact" className="hover:text-foreground">Contact</Link>
            <Link to="/editorial-policy" className="hover:text-foreground">Editorial</Link>
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/disclaimer" className="hover:text-foreground">Disclaimer</Link>
            <Link to="/cookie-policy" className="hover:text-foreground">Cookies</Link>
            <a href="/rss.xml" className="hover:text-foreground">RSS</a>
          </nav>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Disclosure: FinanceHub USA is an independent publisher. Articles are for informational
          purposes only and are not personalized investment, tax, or legal advice.
        </p>
      </div>
    </footer>
  );
}