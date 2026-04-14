/**
 * TagsComponent
 * 
 * Renders tags/badges with pulse indicator.
 * 
 * Data structure:
 * {
 *   title: string      - Single tag text
 *   tags: string[]     - Multiple tags (optional)
 * }
 */

export default function TagsComponent({ data }) {
  const singleTag = typeof data?.title === "string" ? data.title.trim() : "";
  const tags = Array.isArray(data?.tags)
    ? data.tags.map((entry) => String(entry).trim()).filter(Boolean)
    : singleTag
      ? [singleTag]
      : [];

  if (!tags.length) return null;

  return (
    <div className="flex gap-2">
      {tags.map((tag, index) => (
        <div key={`${tag}-${index}`} className="uppercase bg-card/50 backdrop-blur-lg rounded-full border border-border px-3 py-1 text-sm font-medium flex items-center">
          <div className="rounded-full animate-pulse w-2 h-2 bg-green-500"></div>
          <div className="ml-2 text-xs">{tag}</div>
        </div>
      ))}
    </div>
  );
}
