/**
 * CustomComponentRenderer
 * 
 * Render custom/third-party Cockpit components that are not in the default set.
 * 
 * Add custom component mappings here as needed:
 * - Pro Pages custom components (e.g., personi:variants, layout:components)
 * - Custom modules
 * - Addon-provided components
 * 
 * Example mapping:
 * if (rawComponent === "my-custom-component") {
 *   return <MyCustomComponent data={data} nestedComponents={nestedComponents} locale={locale} />;
 * }
 */

export default function CustomComponentRenderer({ rawComponent, item, data, nestedComponents, locale, LayoutRenderer }) {
  // Placeholder: Add custom component logic here
  
  // If component has nested content or HTML, render it as fallback
  if (nestedComponents.length) {
    return <LayoutRenderer components={nestedComponents} locale={locale} />;
  }

  if (typeof data.html === "string" && data.html.trim()) {
    return <div className="max-w-none" dangerouslySetInnerHTML={{ __html: data.html }} />;
  }

  if (typeof data.content === "string" && data.content.trim()) {
    return <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: data.content }} />;
  }

  return null;
}
