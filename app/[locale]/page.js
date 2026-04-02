import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import CockpitImage from "@/components/cockpit-image";
import LayoutRenderer from "@/components/layout-renderer";
import { PRO_PAGES_ENABLED } from "@/config/cockpit";
import { getLatestPosts, getPageBySlug, getSiteSettings } from "@/lib/cockpit-queries";
import { isSupportedLocale, localePath } from "@/lib/i18n";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};

  try {
    const [settings, homePage] = await Promise.all([
      getSiteSettings({ locale }),
      PRO_PAGES_ENABLED ? getPageBySlug({ locale, slug: "/" }).catch(() => null) : Promise.resolve(null),
    ]);

    return {
      title: homePage?.seo?.title || homePage?.seo_title || settings.site_title || "Cockpit Site",
      description:
        homePage?.seo?.description ||
        homePage?.seo_description ||
        settings.site_description ||
        "Content managed from Cockpit",
    };
  } catch {
    return {
      title: "Cockpit Site",
      description: "Content managed from Cockpit",
    };
  }
}

export default async function LocaleHomePage({ params }) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const { isEnabled: preview } = await draftMode();

  if (PRO_PAGES_ENABLED) {
    const homePage = await getPageBySlug({ locale, slug: "/", preview }).catch(() => null);
    
    // console.log("[HomePage] homePage object keys:", homePage ? Object.keys(homePage) : null);
    // console.log("[HomePage] homePage object:", JSON.stringify(homePage, null, 2));
    
    if (homePage) {
      const pageTitle = homePage.title || homePage.seo?.title || homePage.seo_title;
      const pageExcerpt = homePage.excerpt || homePage.seo?.description || homePage.seo_description;
      const htmlContent = homePage.content || homePage.body || "";
      
      const hasHtmlContent = typeof htmlContent === "string" && htmlContent.trim().length > 0;
      
      const layoutComponents = Array.isArray(homePage?.layout)
        ? homePage.layout
        : Array.isArray(homePage?.content)
          ? homePage.content
          : Array.isArray(homePage?.body)
            ? homePage.body
            : [];
      
      // console.log("[HomePage] layoutComponents:", layoutComponents);
      
      if (layoutComponents.length) {
        return <LayoutRenderer components={layoutComponents} locale={locale} />
      }
      
      if (hasHtmlContent || pageTitle || pageExcerpt) {
        return (
          <article className="space-y-6">
            {pageTitle || pageExcerpt ? (
              <header className="space-y-2">
                {pageTitle ? <h1 className="font-heading text-4xl font-semibold tracking-tight">{pageTitle}</h1> : null}
                {pageExcerpt ? <p className="max-w-3xl text-base opacity-80">{pageExcerpt}</p> : null}
              </header>
            ) : null}
            
            {hasHtmlContent ? (
              <div
                className="prose prose-neutral max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            ) : null}
          </article>
        );
      }
    }
  }

  const [settings, posts] = await Promise.all([
    getSiteSettings({ locale, preview }),
    getLatestPosts({ locale, preview, limit: 6 }),
  ]);

  return (
    <section className="space-y-10">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60">Cockpit CMS</p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          {settings.hero_title || settings.site_title || "Kelola konten dari Cockpit"}
        </h1>
        <p className="max-w-2xl text-base opacity-80">
          {settings.hero_description || settings.site_description || "Aplikasi Next.js ini membaca konten langsung dari Cockpit API."}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <article key={post._id} className="overflow-hidden rounded-xl border border-border bg-card">
            <CockpitImage
              asset={post.featured_image}
              alt={post.title}
              width={640}
              height={360}
              className="h-48 w-full object-cover"
            />
            <div className="space-y-2 p-5">
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                <Link href={localePath(locale, `blog/${post.slug}`)}>{post.title}</Link>
              </h2>
              {post.excerpt ? <p className="text-sm opacity-80">{post.excerpt}</p> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
