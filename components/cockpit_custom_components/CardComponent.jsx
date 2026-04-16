export default function CardComponent({ data }) {
  const title = typeof data?.title === "string" && data.title.trim() ? data.title.trim() : "";
  const subTitle = typeof data?.subTitle === "string" && data.subTitle.trim() ? data.subTitle.trim() : "";

  const imageData = data?.image && typeof data.image === "object" ? data.image : null;
  const isImageHidden = Boolean(imageData?.hidden);
  const imagePath = imageData?.img?.path || imageData?.img?.url || "";

  return (
    <article className="rounded-2xl bg-gray-100 border p-6 md:p-8 shadow-sm">
      {!isImageHidden && imagePath ? (
        <img
          src={imagePath}
          alt={title || "Card image"}
          className="mb-4 h-12 w-12 rounded-md object-cover"
          loading="lazy"
        />
      ) : null}

      {title ? <h3 className="text-2xl md:text-3xl font-semibold text-green-700 tracking-tight leading-none">{title}</h3> : null}
      {subTitle ? <p className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">{subTitle}</p> : null}
    </article>
  );
}