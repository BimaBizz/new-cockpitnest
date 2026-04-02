import { cn } from "@/lib/utils";

export default function SectionComponent({ data, nestedComponents, locale, LayoutRenderer }) {
  return (
    <section className={cn("space-y-5", data.class)}>
      <LayoutRenderer components={nestedComponents} locale={locale} />
    </section>
  );
}
