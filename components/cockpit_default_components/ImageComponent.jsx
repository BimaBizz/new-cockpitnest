import CockpitImage from "@/components/cockpit-image";
import { COCKPIT_API_URL } from "@/config/cockpit";

const COCKPIT_ORIGIN = COCKPIT_API_URL.replace(/\/api\/?$/, "");

const asAssetUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  if (!COCKPIT_ORIGIN) return path;
  if (path.startsWith("/")) return `${COCKPIT_ORIGIN}${path}`;
  return `${COCKPIT_ORIGIN}/${path}`;
};

export default function ImageComponent({ data }) {
  return (
    <figure className="space-y-2">
      {data.image?._id ? (
        <CockpitImage asset={data.image} alt={data.caption || data.image?.title || ""} className="h-auto w-full rounded-xl" />
      ) : data.image?.path ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={asAssetUrl(data.image.path)} alt={data.caption || data.image?.title || ""} className="h-auto w-full rounded-xl" />
      ) : null}
      {data.caption ? <figcaption className="text-sm opacity-70">{data.caption}</figcaption> : null}
    </figure>
  );
}
