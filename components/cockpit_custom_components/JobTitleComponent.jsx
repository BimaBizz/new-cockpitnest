import { LuChevronRight } from "react-icons/lu";

/**
 * JobTitleComponent
 * 
 * Renders a job title badge with icon.
 * 
 * Data structure:
 * {
 *   title: string - Job title text
 * }
 */

export default function JobTitleComponent({ data }) {
  const title = typeof data?.title === "string" ? data.title : "";

  if (!title) return null;

  return (
    <div className="flex items-center gap-4 text-xl font-bold px-5 py-2.5 bg-gray-300/50 backdrop-blur-lg rounded-xl text-green-800">
      <LuChevronRight className="inline-block" />
      <h3 className="text-xl font-bold">{title}</h3>
    </div>
  );
}
