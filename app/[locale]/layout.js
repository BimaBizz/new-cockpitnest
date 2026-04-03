import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { COCKPIT_MULTI_LANGUAGE_ENABLED, LOCALES } from "@/config/cockpit";
import { PRO_PAGES_ENABLED } from "@/config/cockpit";
import { getNavigation, getSiteSettings } from "@/lib/cockpit-queries";
import { isSupportedLocale, localePath } from "@/lib/i18n";

function flattenNavigation(items = []) {
  return items.flatMap((item) => {
    const current = {
      _id: item._id || item.title,
      title: item.title || item.name,
      slug: item.slug || item.path || item.route || item.url,
    };

    if (Array.isArray(item.children) && item.children.length) {
      return [current, ...flattenNavigation(item.children)];
    }

    return [current];
  });
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const { isEnabled: preview } = await draftMode();
  const [settings, menuTree] = await Promise.all([
    getSiteSettings({ locale, preview }),
    getNavigation({ locale, preview }),
  ]);

  const menuItems = flattenNavigation(menuTree).filter(
    (item) => item.title && item.slug,
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-5 py-4">
          <Link
            href={localePath(locale)}
            className="font-semibold tracking-tight"
          >
            {settings.site_title || "Cockpit Site"}
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {PRO_PAGES_ENABLED ? (
              null
            ) : (
              <Link href={localePath(locale, "blog")}>Blog</Link>
            )}
            {menuItems.slice(0, 4).map((item) => (
              <Link
                key={item._id || item.slug}
                href={localePath(locale, item.slug)}
              >
                {item.title}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 text-xs">
            {COCKPIT_MULTI_LANGUAGE_ENABLED
              ? LOCALES.map((entry) => (
                  <Link
                    key={entry}
                    href={localePath(entry)}
                    className={
                      entry === locale ? "font-semibold" : "opacity-70"
                    }
                  >
                    {entry.toUpperCase()}
                  </Link>
                ))
              : null}
            {preview ? (
              <span className="rounded bg-amber-200 px-2 py-1 text-amber-950">
                Draft
              </span>
            ) : null}
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-5 py-8">{children}</main>
      <footer className="border-t border-border px-5 py-6 text-center text-sm opacity-70">
        {settings.site_description || "Powered by Cockpit CMS"}
      </footer>
    </div>
  );
}
