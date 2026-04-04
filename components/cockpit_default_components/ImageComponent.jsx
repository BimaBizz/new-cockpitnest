import CockpitImage from "@/components/cockpit-image";
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

export default function ImageComponent({ data }) {
  const image = data?.image || data?.asset || data?.src || data?.media || null;
  const imageAlt = data?.caption || image?.title || data?.alt || "";

  return (
    <figure className="space-y-2">
      {image?.path ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={asAssetUrl(image.path)} alt={imageAlt} className="h-auto w-full rounded-xl" />
      ) : image?._id ? (
        <CockpitImage asset={image} alt={imageAlt} className="h-auto w-full rounded-xl" />
      ) : null}
      {data.caption ? <figcaption className="text-sm opacity-70">{data.caption}</figcaption> : null}
    </figure>
  );
}
