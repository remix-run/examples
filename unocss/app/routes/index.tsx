const Index = () => {
  const links = [
    {
      href: "https://remix.run/tutorials/blog",
      text: "15m Quickstart Blog Tutorial",
    },
    {
      href: "https://remix.run/tutorials/jokes",
      text: "Deep Dive Jokes App Tutorial",
    },
    {
      href: "https://remix.run/docs",
      text: "Remix Docs",
    },
    {
      href: "https://github.com/unocss/unocss",
      text: "UnoCSS Repository",
    },
    {
      href: "https://uno.antfu.me/",
      text: "UnoCSS Docs",
    },
  ];

  return (
    <main className="py-16 px-4 max-w-screen-md mx-auto w-full">
      <h1 className="text-4xl font-bold  mb-6">
        Welcome to Remix + UnoCSS 💿
      </h1>

      <ul className="list-disc grid gap-2 px-4.5">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-blue-500 underline"
              target="_blank"
              rel="noreferrer"
            >
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Index;