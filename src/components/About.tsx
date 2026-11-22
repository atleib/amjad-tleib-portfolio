import Image from "next/image";
import type { SiteData } from "@/data/site";
import { container } from "./ui";

export function About({ site }: { site: SiteData }) {
  return (
    <section id="about" className={`${container} pt-14 pb-12 md:pt-24`}>
      <p className="mb-3 font-mono text-accent">Hi, my name is</p>
      <h1 className="text-5xl font-bold tracking-tight md:text-7xl">{site.name}.</h1>
      <p className="mt-2 text-2xl font-semibold text-muted md:text-4xl">{site.tagline}</p>

      <div className="mt-10 grid items-start gap-8 md:grid-cols-[1.6fr_1fr] md:gap-12">
        <div className="order-2 space-y-4 md:order-1">
          {site.about.map((p) => (
            <p key={p} className="max-w-prose leading-relaxed text-muted">
              {p}
            </p>
          ))}
        </div>
        <div className="order-1 md:order-2">
          <Image
            src={site.profileImage}
            alt={`Photo of ${site.name}`}
            width={400}
            height={400}
            priority
            className="aspect-square w-44 rounded-xl border border-line object-cover md:ml-auto md:w-72"
          />
        </div>
      </div>

      <h2 className="mt-8 mb-3 font-mono text-sm font-medium text-muted">Tech I work with</h2>
      <ul className="flex flex-wrap gap-2">
        {site.skills.map((s) => (
          <li key={s} className="rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-[0.8rem]">
            {s}
          </li>
        ))}
      </ul>

      <div className="mt-9 flex flex-wrap gap-3.5">
        <a
          href="#projects"
          className="rounded-lg bg-accent px-5 py-3 font-semibold text-bg transition hover:-translate-y-0.5 hover:bg-accent-hover"
        >
          See my work
        </a>
        <a
          href={site.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-accent px-5 py-3 font-semibold text-accent transition hover:-translate-y-0.5 hover:bg-accent/10"
        >
          Resume
        </a>
      </div>
    </section>
  );
}
