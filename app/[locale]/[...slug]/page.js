import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { LOCALES } from "@/config/cockpit";
import LayoutRenderer from "@/components/layout-renderer";
import { getAllPageSlugs, getPageBySlug } from "@/lib/cockpit-queries";
import { isSupportedLocale } from "@/lib/i18n";

export async function generateStaticParams() {
  const localeParams = await Promise.all(
    LOCALES.map(async (locale) => {
      const slugs = await getAllPageSlugs({ locale }).catch(() => []);
      return slugs
        .filter((slug) => slug && slug !== "home")
        .map((slug) => ({ locale, slug: slug.split("/") }));
    })
  );

  return localeParams.flat();
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  if (!isSupportedLocale(locale)) return {};

  const slugPath = slug.join("/");
  const page = await getPageBySlug({ locale, slug: slugPath }).catch(() => null);

  if (!page) return {};

  return {
    title: page.seo?.title || page.seo_title || page.title,
    description: page.seo?.description || page.seo_description || page.excerpt || page.title,
  };
}

export default async function DynamicPage({ params }) {
  const { locale, slug } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const { isEnabled: preview } = await draftMode();
  const slugPath = slug.join("/");
  const page = await getPageBySlug({ locale, slug: slugPath, preview });

  // console.log("[DynamicPage] page object keys:", page ? Object.keys(page) : null);
  // console.log("[DynamicPage] page object:", JSON.stringify(page, null, 2));

  if (!page) {
    notFound();
  }

  const layoutComponents = Array.isArray(page.layout)
    ? page.layout
    : Array.isArray(page.content)
      ? page.content
      : Array.isArray(page.body)
        ? page.body
        : [];

  // console.log("[DynamicPage] layoutComponents:", layoutComponents);

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">{page.title || slugPath}</h1>
        {page.excerpt ? <p className="max-w-3xl text-base opacity-80">{page.excerpt}</p> : null}
      </header>

      <div
        className="prose prose-neutral max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: page.content || page.body || "" }}
      />
    </article>
  );
}
