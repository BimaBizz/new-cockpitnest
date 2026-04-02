import { cn } from "@/lib/utils";

const getGridClass = (colWidth) => {
  const width = String(colWidth || "auto");
  if (width === "1-2") return "md:grid-cols-2";
  if (width === "1-3") return "md:grid-cols-3";
  if (width === "1-4") return "md:grid-cols-4";
  return "md:grid-cols-2";
};

export default function GridComponent({ item, data, locale, LayoutRenderer }) {
  return (
    <div className={cn("grid grid-cols-1 gap-5", getGridClass(data.colWidth), data.class)}>
      {(item.columns || []).map((column, index) => (
        <div key={`${item.id || "grid"}-${index}`} className="space-y-5">
          <LayoutRenderer components={column?.components || []} locale={locale} />
        </div>
      ))}
    </div>
  );
}
