import Image from "next/image";
import type { Project } from "@/data/site";
import { ExternalIcon, GitHubIcon, LockIcon } from "./icons";
import { Bullets, Tags } from "./ui";

interface Props {
  project: Project;
  /** Called when a screenshot is clicked, to open it larger. */
  onOpenImage?: (src: string, alt: string) => void;
}

export function ProjectCard({ project: p, onOpenImage }: Props) {
  const isWork = p.category === "work";
  const showImage = p.display === "screenshot" && p.image;
  const showNote = p.display === "text" && p.note;
  const alt = p.imageAlt ?? p.name;

  return (
    <article
      data-testid="project-card"
      data-category={p.category}
      className={`flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition hover:-translate-y-1 hover:border-[#33476e] ${
        p.display === "text" ? "border-l-[3px] border-l-work" : ""
      }`}
    >
      {showImage && (
        <button
          type="button"
          onClick={() => onOpenImage?.(p.image!, alt)}
          aria-label={`Enlarge screenshot of ${p.name}`}
          className="block cursor-zoom-in border-b border-line bg-surface-2"
        >
          <Image
            src={p.image!}
            alt={alt}
            width={1280}
            height={720}
            className="aspect-video w-full object-cover transition-opacity hover:opacity-85"
          />
        </button>
      )}

      <div className="flex flex-1 flex-col p-5.5">
        <span
          className={`mb-2.5 self-start rounded px-2 py-0.5 font-mono text-[0.7rem] font-medium tracking-wider uppercase ${
            isWork ? "bg-work/10 text-work" : "bg-accent/10 text-accent"
          }`}
        >
          {isWork ? "Work Project" : "Personal Project"}
        </span>

        <h3 className="text-xl font-semibold">{p.name}</h3>
        <p className="mt-2.5 text-muted">{p.description}</p>
        <Bullets items={p.highlights} />
        <Tags items={p.tech} />

        {showNote && (
          <p className="mt-4 flex items-center gap-2 text-sm text-muted italic">
            <LockIcon className="h-4 w-4 shrink-0 text-work" />
            <span>{p.note}</span>
          </p>
        )}

        {(p.links?.live || p.links?.github) && (
          <div className="mt-auto flex gap-4.5 pt-4.5">
            {p.links?.live && (
              <a
                href={p.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-accent"
              >
                <ExternalIcon className="h-4.5 w-4.5" /> Live site
              </a>
            )}
            {p.links?.github && (
              <a
                href={p.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-accent"
              >
                <GitHubIcon className="h-4.5 w-4.5" /> Code
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
