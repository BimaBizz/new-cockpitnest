import { cn } from "@/lib/utils";

const isTrue = (value) => value === true || value === "true" || value === 1 || value === "1";

const readMeta = (value) => {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  if (Array.isArray(value)) {
    return value.reduce((acc, entry) => {
      if (entry && typeof entry === "object" && !Array.isArray(entry)) {
        return { ...acc, ...entry };
      }
      return acc;
    }, {});
  }
  return {};
};

const getGridClass = (colWidth) => {
  const width = String(colWidth || "auto");
  if (width === "2") return "md:grid-cols-2";
  if (width === "3") return "md:grid-cols-3";
  if (width === "4") return "md:grid-cols-4";
  if (width === "1-2") return "md:grid-cols-2";
  if (width === "1-3") return "md:grid-cols-3";
  if (width === "1-4") return "md:grid-cols-4";
  return "md:grid-cols-2";
};

export default function GridComponent({ item, data, locale, LayoutRenderer }) {
  const meta = Object.keys(readMeta(item?.meta)).length ? readMeta(item?.meta) : readMeta(data?.meta);

  const columns = Array.isArray(item.columns) ? item.columns : [];
  const isCentered = isTrue(meta.itemCenter);
  

  return (
    <div className={cn("grid grid-cols-1 gap-5 lg:gap-8", getGridClass(data.colWidth), isCentered && "items-center", data.class)}>
      {columns.map((column, index) => {
        const columnMeta = readMeta(column?.meta);
        const columnCentered = isTrue(columnMeta.itemCenter);
        return (
          <div
            key={`${item.id || "grid"}-${index}`}
            className={cn("space-y-5", columnCentered && "flex items-center")}
          >
            <LayoutRenderer
              components={column?.components || []}
              locale={locale}
              className={columnCentered ? "flex flex-col" : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}
