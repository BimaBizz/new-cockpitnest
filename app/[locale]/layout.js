import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { COCKPIT_MULTI_LANGUAGE_ENABLED, LOCALES } from "@/config/cockpit";
import { PRO_PAGES_ENABLED } from "@/config/cockpit";
import { getNavigation, getSiteSettings } from "@/lib/cockpit-queries";
import { isSupportedLocale, localePath } from "@/lib/i18n";
import FooterComponent from "@/components/cockpit_custom_components/FooterComponent";
import Navbar from "@/components/Navbar";

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
  const [settings, menuTree, sosmedMenu] = await Promise.all([
    getSiteSettings({ locale, preview }),
    getNavigation({ locale, preview }),
    (await import("@/lib/cockpit-queries")).getSosmedMenu(),
  ]);

  const menuItems = flattenNavigation(menuTree).filter(
    (item) => item.title && item.slug,
  );

  // Extract links from sosmedMenu (must be after sosmedMenu is defined)
  const sosmedLinks = Array.isArray(sosmedMenu?.links) ? sosmedMenu.links : [];

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <main className="mx-auto w-full">
        <Navbar
          settings={settings}
          menuItems={menuItems}
          locale={locale}
          locales={LOCALES}
          preview={preview}
          proPagesEnabled={PRO_PAGES_ENABLED}
          multiLanguageEnabled={COCKPIT_MULTI_LANGUAGE_ENABLED}
        />
        {children}
      </main>
      {!PRO_PAGES_ENABLED ? (
        <div className="border-t border-border px-5 py-6 text-center text-sm opacity-70">
          {settings.site_description || "Powered by Cockpit CMS"}
        </div>
      ) : (
        <FooterComponent links={sosmedLinks} />
      )}
    </div>
  );
}
