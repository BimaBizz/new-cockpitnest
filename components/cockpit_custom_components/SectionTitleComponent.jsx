/**
 * SectionTitleComponent
 * 
 * Renders a section title with optional text highlighting.
 * 
 * Data structure:
 * {
 *   title: string      - Main heading text
 *   highlight: string  - Text to highlight (optional)
 * }
 */

export default function SectionTitleComponent({ data }) {
  const title = typeof data?.title === "string" ? data.title : "";
  const highlight = typeof data?.highlight === "string" ? data.highlight.trim() : "";

  if (!title) return null;

  if (!highlight) {
    return <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold">{title}</h2>;
  }

  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedHighlight})`, "gi");
  const parts = title.split(regex);

  return (
    <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold">
      {parts.map((part, index) => (
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={`${part}-${index}`} className="text-green-500">
            {part}
          </span>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        )
      ))}
    </h2>
  );
}
