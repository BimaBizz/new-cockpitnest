// Server component: receives links as prop
const FooterComponent = ({ links = [] }) => {
  return (
    <footer className="bg-card py-10">
      <div className="max-w-6xl p-4 mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h3 className="text-2xl font-semibold">BMDev.</h3>
          <p className="text-sm text-muted-foreground font-semibold mt-2 uppercase tracking-wide">
            &copy; 2023 Digital Architect BMDev. Built with Liquid Glass
            Protocol.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          {links.map((item) => (
            <a
              key={item._id || item.name || item.url}
              href={item.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-green-700 font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wide"
            >
              {item.icon ? (
                <span dangerouslySetInnerHTML={{ __html: item.icon }} />
              ) : null}
              {item.name || item.label || item.title || item.url}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
