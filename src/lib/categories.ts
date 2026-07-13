export type CategorySlug =
  | "personal-finance"
  | "investing"
  | "stock-market"
  | "cryptocurrency"
  | "credit-cards"
  | "loans"
  | "insurance"
  | "retirement"
  | "taxes"
  | "banking"
  | "saving-money"
  | "budgeting"
  | "business"
  | "economy"
  | "financial-education"
  | "news"
  | "markets";

export interface CategoryMeta {
  slug: CategorySlug;
  name: string;
  short: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { slug: "news", name: "News", short: "Breaking financial news" },
  { slug: "markets", name: "Markets", short: "Market overview & indices" },
  { slug: "stock-market", name: "Stocks", short: "US stock market" },
  { slug: "cryptocurrency", name: "Crypto", short: "Bitcoin & altcoins" },
  { slug: "investing", name: "Investing", short: "Portfolio & ETFs" },
  { slug: "personal-finance", name: "Personal Finance", short: "Money mastery" },
  { slug: "credit-cards", name: "Credit Cards", short: "Best cards & rewards" },
  { slug: "loans", name: "Loans", short: "Personal & auto loans" },
  { slug: "insurance", name: "Insurance", short: "Auto, home, life" },
  { slug: "retirement", name: "Retirement", short: "401(k) & IRA" },
  { slug: "taxes", name: "Taxes", short: "IRS & deductions" },
  { slug: "banking", name: "Banking", short: "Best accounts" },
  { slug: "saving-money", name: "Saving Money", short: "Tips to save more" },
  { slug: "budgeting", name: "Budgeting", short: "Plans that work" },
  { slug: "business", name: "Business", short: "SMB & startups" },
  { slug: "economy", name: "Economy", short: "Fed & inflation" },
  { slug: "financial-education", name: "Education", short: "Learn the fundamentals" },
];

export const PRIMARY_NAV: CategorySlug[] = [
  "news",
  "markets",
  "stock-market",
  "cryptocurrency",
  "investing",
  "personal-finance",
  "retirement",
];

export const FOOTER_GROUPS: { label: string; slugs: CategorySlug[] }[] = [
  {
    label: "Markets & News",
    slugs: ["news", "markets", "stock-market", "cryptocurrency", "economy", "business"],
  },
  {
    label: "Personal Finance",
    slugs: ["personal-finance", "budgeting", "saving-money", "banking", "insurance"],
  },
  {
    label: "Money & Wealth",
    slugs: ["investing", "retirement", "taxes", "credit-cards", "loans", "financial-education"],
  },
];

export function categoryName(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}
