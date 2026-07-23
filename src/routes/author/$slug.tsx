import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { 
  Twitter, 
  Mail, 
  BookOpen, 
  Award, 
  TrendingUp,
  ExternalLink,
  CheckCircle2,
  Users,
  Shield,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  ArrowLeft
} from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { ArticleCard } from "@/components/site/ArticleCard";
import { supabase } from "@/integrations/supabase/client";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

// ✅ Query para obtener datos del autor por slug
const authorOptions = (slug: string) =>
  queryOptions({
    queryKey: ["author", slug],
    queryFn: async () => {
      // 1. Obtener el perfil del autor
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, display_name, bio, avatar_url, twitter, website, slug, created_at")
        .eq("slug", slug)
        .maybeSingle();

      if (profileError || !profile) {
        // Si no hay perfil, devolvemos null para que el loader devuelva notFound
        return { profile: null, articles: [] };
      }

      // 2. Obtener sus artículos publicados
      const { data: articles, error: articlesError } = await supabase
        .from("articles")
        .select(`
          id,
          slug,
          title,
          excerpt,
          featured_image,
          reading_time,
          published_at,
          updated_at,
          categories(slug, name)
        `)
        .eq("author_id", profile.id)
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(20);

      if (articlesError) {
        console.error("Error fetching author articles:", articlesError);
        return { profile, articles: [] };
      }

      return { profile, articles: articles ?? [] };
    },
  });

// ✅ Ruta dinámica para autores
export const Route = createFileRoute("/author/$slug")({
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(authorOptions(params.slug));
    if (!data.profile) throw notFound();
    return data;
  },
  head: ({ params, loaderData }) => {
    const profile: any = loaderData?.profile;
    if (!profile) {
      return {
        meta: [{ title: "Author not found" }],
      };
    }
    const name = profile.display_name || params.slug;
    const title = `${name} — FinanceHub USA Author`;
    const desc = profile.bio || `Articles by ${name} on FinanceHub USA.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: `/author/${params.slug}` },
        { property: "og:type", content: "profile" },
        { property: "profile:first_name", content: name.split(" ")[0] || name },
        { property: "profile:last_name", content: name.split(" ").slice(1).join(" ") || "" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/author/${params.slug}` }],
    };
  },
  component: AuthorPage,
  notFoundComponent: () => (
    <div className="container-page py-16 text-center">
      <h1 className="font-display text-3xl font-bold">Author not found</h1>
      <p className="mt-2 text-muted-foreground">This author profile doesn't exist.</p>
      <Link to="/" className="mt-4 inline-block text-accent underline">
        Back home
      </Link>
    </div>
  ),
});

// ✅ Componente principal de la página de autor
function AuthorPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(authorOptions(slug));
  const { profile, articles } = data;

  if (!profile) return null;

  const authorName = profile.display_name || slug;
  const authorAvatar = profile.avatar_url || "/placeholder-avatar.jpg";
  const authorBio = profile.bio || 
    `${authorName} is a contributor to FinanceHub USA, writing about US markets, crypto, personal finance, and building lasting wealth.`;

  // ✅ Fecha de membresía
  const memberSince = profile.created_at 
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="container-page py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
        { label: "Authors", href: "/authors" },
        { label: authorName }
      ]} />

      {/* ✅ Botón de volver */}
      <Link
        to="/about"
        className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to About
      </Link>

      {/* ✅ Hero del autor */}
      <div className="mt-6 rounded-2xl bg-gradient-to-br from-primary/95 to-primary/80 p-8 text-primary-foreground md:p-12">
        <div className="grid gap-8 md:grid-cols-[auto,1fr] md:items-center">
          {/* Avatar */}
          <div className="flex justify-center md:justify-start">
            <img
              src={authorAvatar}
              alt={authorName}
              className="h-28 w-28 rounded-full border-4 border-accent/50 object-cover md:h-36 md:w-36"
            />
          </div>
          
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Author
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">
              {authorName}
            </h1>
            {memberSince && (
              <p className="mt-1 text-sm text-primary-foreground/60">
                Member since {memberSince}
              </p>
            )}
            <p className="mt-3 max-w-2xl text-base text-primary-foreground/80">
              {authorBio}
            </p>
            
            {/* Redes sociales */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <span className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/60">
                <MapPin className="h-4 w-4" /> United States
              </span>
              {profile.twitter && (
                <a
                  href={`https://x.com/angelibiza64627${profile.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-white/20 transition"
                >
                  <Twitter className="h-4 w-4" /> X
                </a>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-white/20 transition"
                >
                  <ExternalLink className="h-4 w-4" /> Website
                </a>
              )}
              <a
                href="mailto:admin@financehubus.com"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-white/20 transition"
              >
                <Mail className="h-4 w-4" /> Email
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Credenciales - Sección clave para AdSense */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold text-foreground">Credentials & Experience</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <CredentialCard 
            icon={<Award className="h-5 w-5" />}
            title="Financial Education Advocate"
            description="Committed to making financial literacy accessible to all Americans through clear, practical content."
          />
          <CredentialCard 
            icon={<BookOpen className="h-5 w-5" />}
            title="Published Financial Writer"
            description="Covering US markets, crypto, personal finance, and economic trends since 2024."
          />
          <CredentialCard 
            icon={<TrendingUp className="h-5 w-5" />}
            title="Investment Research"
            description="In-depth analysis of stocks, ETFs, and portfolio strategies for long-term wealth building."
          />
          <CredentialCard 
            icon={<Shield className="h-5 w-5" />}
            title="Editorial Integrity"
            description="Committed to independent, unbiased financial journalism with rigorous fact-checking."
          />
        </div>
      </section>

      {/* ✅ Misión */}
      <section className="mt-10 rounded-2xl border border-border bg-secondary/40 p-6 md:p-8">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-accent" />
          <h2 className="font-display text-2xl font-bold text-foreground">My Mission</h2>
        </div>
        <p className="mt-3 max-w-3xl text-base text-muted-foreground leading-relaxed">
          To help every American reader make smarter money decisions — with content that is 
          easy to understand, rigorously fact-checked, and free of jargon. FinanceHub USA 
          exists to bridge the gap between complex financial concepts and real-world application.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span>Independent & unbiased</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span>Fact-checked content</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span>No jargon, just clarity</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span>Made in the USA 🇺🇸</span>
          </div>
        </div>
      </section>

      {/* ✅ Artículos del autor */}
      <section className="mt-12">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Latest from {authorName}
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-foreground">
              Featured Articles
            </h2>
          </div>
        </div>

        {articles && articles.length > 0 ? (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article: any) => (
              <ArticleCard
                key={article.slug}
                article={{
                  slug: article.slug,
                  title: article.title,
                  excerpt: article.excerpt,
                  featured_image: article.featured_image,
                  reading_time: article.reading_time,
                  published_at: article.published_at,
                  category_slug: article.categories?.slug,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No articles yet. Stay tuned — new content coming soon! 🚀
            </p>
          </div>
        )}
      </section>

      {/* ✅ Newsletter CTA */}
      <section className="mt-12 rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-foreground">
              💌 Get the Money Briefing
            </h3>
            <p className="text-sm text-muted-foreground">
              Markets, macro, and personal finance — delivered daily before the opening bell.
            </p>
          </div>
          <div className="w-full max-w-sm">
            <NewsletterForm source={`author-${slug}`} compact />
          </div>
        </div>
      </section>

      {/* ✅ Aviso legal (OBLIGATORIO para AdSense en finanzas) */}
      <div className="mt-8 rounded-lg border-l-4 border-accent bg-accent/5 p-4">
        <p className="text-xs text-muted-foreground">
          <strong>⚠️ Disclaimer:</strong> All content on FinanceHub USA is for 
          <strong> informational and educational purposes</strong> only. It does not constitute 
          personalized financial, investment, tax, or legal advice. Past performance does not 
          guarantee future results. Always consult a qualified professional for your specific 
          situation. See our <Link to="/disclaimer" className="text-accent hover:underline">full disclaimer</Link>.
        </p>
      </div>
    </div>
  );
}

// ✅ Componente auxiliar para credenciales
function CredentialCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-border bg-card p-4 transition hover:border-accent hover:shadow-[var(--shadow-elegant)]">
      <div className="mt-0.5 text-accent">{icon}</div>
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}