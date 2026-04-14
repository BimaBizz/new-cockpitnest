import { cn } from "@/lib/utils";

const isTrue = (value) => value === true || value === "true" || value === 1 || value === "1";
const pickString = (...values) => {
  const found = values.find((value) => typeof value === "string" && value.trim());
  return found ? found.trim() : undefined;
};

const normalizeColorValue = (value) => {
  if (!value) return undefined;

  const raw = value.trim();
  const isHexWithoutHash = /^[0-9a-fA-F]{3,4}$|^[0-9a-fA-F]{6}$|^[0-9a-fA-F]{8}$/.test(raw);

  return isHexWithoutHash ? `#${raw}` : raw;
};

export default function SectionComponent({ item, data, nestedComponents, locale, LayoutRenderer }) {
  const meta = item?.meta && typeof item.meta === "object" && !Array.isArray(item.meta)
    ? item.meta
    : data?.meta && typeof data.meta === "object" && !Array.isArray(data.meta)
      ? data.meta
      : {};

  const isFullHeight = isTrue(meta.hScreen);
  const isCentered = isTrue(meta.itemCenter);
  const backgroundColor = normalizeColorValue(
    pickString(
      meta.backgroundColor,
      meta.backgroudColor,
      meta.color,
      data?.backgroundColor,
      data?.backgroudColor,
      data?.color,
    ),
  );

  return (
    <section
      className={cn(
        "space-y-5",
        isFullHeight && "min-h-[92vh]",
        isCentered && "flex flex-col justify-center",
        data.class,
      )}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className="max-w-7xl mx-auto p-4 ">
        <LayoutRenderer components={nestedComponents} locale={locale} />
      </div>
    </section>
  );
}
