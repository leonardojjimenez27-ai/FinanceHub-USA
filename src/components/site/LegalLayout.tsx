import type { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: title }]} />
      <header className="mt-4 border-b border-border pb-6">
        <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
          {title}
        </h1>
        {updated && (
          <p className="mt-2 text-xs text-muted-foreground">
            Last updated: {updated}
          </p>
        )}
      </header>
      <div className="prose-article mt-8 max-w-3xl">{children}</div>
    </div>
  );
}
