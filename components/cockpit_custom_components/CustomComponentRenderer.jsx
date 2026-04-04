/**
 * CustomComponentRenderer
 * 
 * Dispatcher for custom/third-party Cockpit components.
 * Routes to specific component implementations based on rawComponent type.
 * 
 * Add new components:
 * 1. Create component file (e.g., MyCustomComponent.jsx)
 * 2. Import at top of this file
 * 3. Add mapping condition: if (rawComponent === "my-custom") { return <MyCustomComponent data={data} />; }
 */

import SectionTitleComponent from "./SectionTitleComponent";
import TagsComponent from "./TagsComponent";
import JobTitleComponent from "./JobTitleComponent";
import HeroImage from "./HeroImageComponent";

export default function CustomComponentRenderer({ rawComponent, item, data, nestedComponents, locale, LayoutRenderer }) {
  if (rawComponent === "sectiontitle") {
    return <SectionTitleComponent data={data} />;
  }

  if (rawComponent === "tags") {
    return <TagsComponent data={data} />;
  }

  if (rawComponent === "jobtitle") {
    return <JobTitleComponent data={data} />;
  }

  if (rawComponent === "heroimage") {
    return <HeroImage data={data} />;
  }

  // If component has nested content or HTML, render it as fallback
  if (nestedComponents.length) {
    return <LayoutRenderer components={nestedComponents} locale={locale} />;
  }

  if (typeof data?.html === "string" && data.html.trim()) {
    return <div className="max-w-none" dangerouslySetInnerHTML={{ __html: data.html }} />;
  }

  if (typeof data?.content === "string" && data.content.trim()) {
    return <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: data.content }} />;
  }

  return null;
}
