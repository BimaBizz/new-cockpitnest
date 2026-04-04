import Link from "next/link";

const toLocalHref = (url, locale) => {
  if (!url) return "#";
  if (!url.startsWith("/") || !locale) return url;
  return `/${locale}${url === "/" ? "" : url}`;
};

export default function ButtonComponent({ data, locale }) {
  const href = toLocalHref(data.url, locale);
  return (
    <Link
      href={href}
      target={data.target || "_self"}
      className="inline-flex items-center rounded-lg bg-foreground px-5 py-2.5 mr-4 text-sm font-medium text-card"
    >
      {data.caption || "Open"}
    </Link>
  );
}
