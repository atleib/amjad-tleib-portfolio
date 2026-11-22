"use client";

import { useState } from "react";
import { container } from "./ui";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur">
      <nav className={`${container} flex h-16 items-center justify-between`} aria-label="Main">
        <a href="#top" className="font-mono text-xl font-semibold text-ink">
          AT<span className="text-accent">.</span>
        </a>

        <button
          type="button"
          className="p-2 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="my-1 block h-0.5 w-6 rounded bg-ink" />
          <span className="my-1 block h-0.5 w-6 rounded bg-ink" />
          <span className="my-1 block h-0.5 w-6 rounded bg-ink" />
        </button>

        <ul
          id="nav-links"
          className={`${
            open ? "flex" : "hidden"
          } absolute inset-x-0 top-16 flex-col border-b border-line bg-surface md:static md:flex md:flex-row md:gap-7 md:border-0 md:bg-transparent`}
        >
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-6 py-3.5 text-[0.95rem] font-medium text-muted transition-colors hover:text-accent md:p-0"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
