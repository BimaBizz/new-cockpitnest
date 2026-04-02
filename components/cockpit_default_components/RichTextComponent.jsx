export default function RichTextComponent({ data }) {
  return <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: data.html || "" }} />;
}
