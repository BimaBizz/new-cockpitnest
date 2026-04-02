export default function HeadingComponent({ data }) {
  const level = Math.min(Math.max(Number(data.level || 2), 1), 6);
  const Tag = `h${level}`;
  return <Tag className="font-heading tracking-tight">{data.text}</Tag>;
}
