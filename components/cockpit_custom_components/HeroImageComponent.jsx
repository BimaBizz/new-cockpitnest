import { COCKPIT_API_URL } from "@/config/cockpit";
import { getAssetImageUrl } from "@/lib/cockpit";
import { LuZap } from "react-icons/lu";

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

export default function HeroImageComponent({ data }) {
  const image = data?.image || data?.asset || data?.src || data?.media || null;
  const imageAlt = data?.caption || image?.title || data?.alt || "";
  const currentTech = typeof data?.currentengine === "string" && data.currentengine.trim()
    ? data.currentengine.trim()
    : "Liquid Glass Engine v2.0";
  const imageSrc = image?.path ? asAssetUrl(image.path) : "";
  const backgroundSrc = imageSrc || (image?._id ? getAssetImageUrl(image._id) : "");

  if (!backgroundSrc) {
    return null;
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-3xl bg-green-400/20 blur-[100px]" />

      <div
        className="relative overflow-hidden rounded-3xl bg-card/80 p-6 shadow-green-800 shadow-2xl backdrop-blur-xl h-100 lg:h-[600px]"
        role="img"
        aria-label={imageAlt || "preview"}
        style={{ backgroundImage: `url(${backgroundSrc})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-background/40" />
        <div className="absolute inset-0 rounded-3xl bg-green-500/10 blur-[80px]" />

        <div className="absolute bottom-5 left-5 right-5 mt-52 flex items-center justify-between rounded-xl bg-card/50 p-3 backdrop-blur-lg">
          <div>
            <p className="text-xs text-muted-foreground">CURRENT TECH USED</p>
            <p className="text-sm font-medium">{currentTech}</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
            <span aria-hidden="true">
              <LuZap className="h-4 w-4 text-amber-200" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
