export function PageLinks() {
  return (
    <nav
      aria-label="Explore pages"
      className="mx-auto flex max-w-7xl flex-wrap gap-6 px-6 pb-12 text-sm text-muted-foreground"
    >
      {[
        ["/", "Home"],
        ["/projects", "Projects"],
        ["/experience", "Experience"],
        ["/blogs", "Blogs"],
        ["/contact", "Contact"],
      ].map(([url, label]) => (
        <a href={url} key={url} className="transition-colors hover:text-[color:var(--accent-cyan)]">
          {label}
        </a>
      ))}
    </nav>
  );
}

