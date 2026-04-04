import { cn } from "@/lib/utils";

const isTrue = (value) => value === true || value === "true" || value === 1 || value === "1";

export default function SectionComponent({ item, data, nestedComponents, locale, LayoutRenderer }) {
  const meta = item?.meta && typeof item.meta === "object" && !Array.isArray(item.meta)
    ? item.meta
    : data?.meta && typeof data.meta === "object" && !Array.isArray(data.meta)
      ? data.meta
      : {};

  const isFullHeight = isTrue(meta.hScreen);
  const isCentered = isTrue(meta.itemCenter);
  const backgroundColor = typeof meta.color === "string" && meta.color.trim() ? meta.color.trim() : undefined;

  return (
    <section
      className={cn(
        "space-y-5",
        isFullHeight && "min-h-screen",
        isCentered && "flex flex-col justify-center",
        data.class,
      )}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <LayoutRenderer components={nestedComponents} locale={locale} />
    </section>
  );
}
