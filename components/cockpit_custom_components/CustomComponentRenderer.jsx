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
import PortfolioItemsComponent from "./PortfolioItemsComponent";
import CardComponent from "./CardComponent";
import TerminalComponent from "./TerminalComponent";

export default function CustomComponentRenderer({ rawComponent, item, data, nestedComponents, locale, LayoutRenderer }) {
  const isCollectionPageItems = Array.isArray(data?.items) && data.items.some((entry) => entry && typeof entry === "object" && (entry.item || entry.route));

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

  if (rawComponent === "card" || rawComponent === "cards") {
    return <CardComponent data={data} />;
  }

  if (rawComponent === "terminal") {
    return <TerminalComponent data={data} />;
  }

  if (
    rawComponent === "portofolioitems" ||
    rawComponent === "portfolioitems" ||
    rawComponent === "portofolio-items" ||
    rawComponent === "portfolio-items" ||
    rawComponent === "collectionpageitems" ||
    rawComponent === "collection-page-items" ||
    rawComponent === "collectionpageitem" ||
    rawComponent === "collection-page-item" ||
    isCollectionPageItems
  ) {
    return <PortfolioItemsComponent data={data} />;
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
