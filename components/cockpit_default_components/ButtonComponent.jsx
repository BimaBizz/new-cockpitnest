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
      className="inline-flex items-center rounded-full bg-gradient-to-r from-green-700 to-green-500 p-3 text-white font-semibold hover:bg-gradient-to-r hover:from-green-800 hover:to-green-600 px-6 py-4 mr-4 text-sm font-medium text-card"
    >
      {data.caption || "Open"}
    </Link>
  );
}
