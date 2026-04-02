import Link from "next/link";

const toLocalHref = (url, locale) => {
  if (!url) return "#";
  if (!url.startsWith("/") || !locale) return url;
  return `/${locale}${url === "/" ? "" : url}`;
};

export default function HeroComponent({ data, locale }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card p-8">
      <div className="space-y-3">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">{data.headline}</h1>
        {data.subheadline ? <p className="max-w-2xl opacity-80">{data.subheadline}</p> : null}
        {data.cta_url ? (
          <Link href={toLocalHref(data.cta_url, locale)} className="inline-flex rounded-lg bg-foreground px-4 py-2 text-sm text-background">
            {data.cta_text || "Learn more"}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
