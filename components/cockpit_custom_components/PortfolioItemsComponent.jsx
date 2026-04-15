import Link from "next/link";
import { cn } from "@/lib/utils";
import { COCKPIT_API_URL } from "@/config/cockpit";

const toOrigin = (apiUrl) => {
  if (!apiUrl) return "";

  try {
    return new URL(apiUrl).origin;
  } catch {
    return apiUrl.replace(/\/api(?:\/.*)?$/, "").replace(/\/$/, "");
  }
};

const COCKPIT_ORIGIN = toOrigin(COCKPIT_API_URL);

const normalizeAssetPath = (value) => {
  if (!value) return "";

  const path = String(value).trim();
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;

  const cleanPath = path.replace(/^\/+/, "");

  if (cleanPath.startsWith("storage/")) return `/${cleanPath}`;
  if (cleanPath.startsWith("uploads/")) return `/storage/${cleanPath}`;

  return `/storage/uploads/${cleanPath}`;
};

const asAssetUrl = (path) => {
  if (!path) return "";

  const normalizedPath = normalizeAssetPath(path);
  if (/^https?:\/\//.test(normalizedPath)) return normalizedPath;
  if (!COCKPIT_ORIGIN) return normalizedPath;

  return `${COCKPIT_ORIGIN}${normalizedPath}`;
};

const stripHtml = (value = "") =>
  String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const shortText = (value = "", maxLength = 200) => {
  const text = stripHtml(value);
  if (!text) return "";
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength).trimEnd()}...`;
};

const toArray = (value) => (Array.isArray(value) ? value : []);

export default function PortfolioItemsComponent({ data }) {
  const collection = data?.portofolioItems && typeof data.portofolioItems === "object"
    ? data.portofolioItems
    : data?.collectionPageItemsField && typeof data.collectionPageItemsField === "object"
      ? data.collectionPageItemsField
      : data;

  const items = toArray(collection?.items);
  const title = typeof collection?.title === "string" && collection.title.trim()
    ? collection.title.trim()
    : typeof data?.title === "string" && data.title.trim()
      ? data.title.trim()
      : "Portofolio";
  const description = typeof collection?.description === "string" && collection.description.trim()
    ? collection.description.trim()
    : typeof data?.description === "string" && data.description.trim()
      ? data.description.trim()
      : "";

  if (!items.length) {
    return null;
  }

  return (
    <section className="space-y-8">
      <div className="max-w-3xl space-y-3">
        <h1 className="font-semibold tracking-tight text-green-700 text-4xl md:text-5xl">Selected Works</h1>
        <p className="text-base leading-7 text-muted-foreground max-w-xl">A curation of high-performance web applications built with modern frameworks and pixel-perfect attention to detail.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((entry, index) => {
          const portfolioItem = entry?.item && typeof entry.item === "object" ? entry.item : entry;
          const image = portfolioItem?.image || portfolioItem?.asset || portfolioItem?.media || null;
          const imageSrc = asAssetUrl(image?.path || portfolioItem?.image?.path || "");
          const imageAlt = typeof image?.altText === "string" && image.altText.trim()
            ? image.altText.trim()
            : typeof image?.title === "string" && image.title.trim()
              ? image.title.trim()
              : typeof portfolioItem?.title === "string" && portfolioItem.title.trim()
                ? portfolioItem.title.trim()
                : "Portfolio image";
          const techs = toArray(portfolioItem?.tech?.name).map((tech) => String(tech).trim()).filter(Boolean);
          const route = typeof entry?.route === "string" && entry.route.trim()
            ? entry.route.trim()
            : typeof portfolioItem?.route === "string" && portfolioItem.route.trim()
              ? portfolioItem.route.trim()
              : typeof portfolioItem?.slug === "string" && portfolioItem.slug.trim()
                ? `/projects/${portfolioItem.slug.trim()}`
                : "";
          const excerpt = shortText(portfolioItem?.content || "", 120);

          return (
            <article
              key={portfolioItem?._id || portfolioItem?.slug || `${title}-${index}`}
              className={cn("group overflow-hidden rounded-3xl border border-border bg-card/90 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:border-green-500/40 hover:shadow-green-500/10")}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-green-500/15 via-card to-amber-500/10 text-sm font-medium text-muted-foreground">
                    No preview image
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full border border-green-500/20 bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-green-600 backdrop-blur">
                  Project
                </div>
              </div>

              <div className="space-y-6 p-6">
                <div className="">
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">{portfolioItem?.title || "Untitled project"}</h3>
                </div>

                {excerpt ? <p className="text-sm leading-6 text-muted-foreground">{excerpt}</p> : null}

                {techs.length ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {techs.map((tech, techIndex) => (
                      <span key={`${tech}-${techIndex}`} className="rounded-sm border border-border bg-background/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-green-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}