import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Menu, Moon, Sun, TrendingUp, User, X } from "lucide-react";
import { PRIMARY_NAV, CATEGORIES } from "@/lib/categories";
import { supabase } from "@/integrations/supabase/client";

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("fh-theme") : null;
    const prefers =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefers;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("fh-theme", next ? "dark" : "light");
  };
  return { dark, toggle };
}

export function SiteHeader() {
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUserId(data.session?.user?.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setUserId(s?.user?.id ?? null),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container-page flex h-14 items-center gap-4">
        <button
          className="md:hidden -ml-1 rounded-md p-2 text-foreground hover:bg-muted"
          aria-label="Menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <TrendingUp className="h-4 w-4" />
          </span>
          <span>
            FinanceHub<span className="text-accent"> USA</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {PRIMARY_NAV.map((slug) => {
            const cat = CATEGORIES.find((c) => c.slug === slug)!;
            return (
              <Link
                key={slug}
                to="/category/$slug"
                params={{ slug }}
                className="rounded-md px-3 py-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {cat.name}
              </Link>
            );
          })}
          <Link
            to="/tools"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            Tools
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            aria-label="Toggle theme"
            onClick={toggle}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {userId ? (
            <Link
              to="/admin"
              className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Account"
            >
              <User className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              to="/auth"
              className="hidden sm:inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      {searchOpen && (
        <form
          className="border-t border-border bg-background"
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) window.location.href = `/search?q=${encodeURIComponent(q.trim())}`;
          }}
        >
          <div className="container-page flex items-center gap-2 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search articles, topics, tickers..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button className="text-xs text-muted-foreground hover:text-foreground" type="submit">
              Enter ↵
            </button>
          </div>
        </form>
      )}

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container-page grid grid-cols-2 gap-1 py-3 text-sm">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to="/category/$slug"
                params={{ slug: cat.slug }}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {cat.name}
              </Link>
            ))}
            <Link to="/tools" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
              Tools
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
