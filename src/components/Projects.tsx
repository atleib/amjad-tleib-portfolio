"use client";

import { useEffect, useState } from "react";
import type { Project, ProjectCategory } from "@/data/site";
import { ProjectCard } from "./ProjectCard";
import { SectionTitle, container } from "./ui";

type Filter = "all" | ProjectCategory;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "personal", label: "Personal" },
  { value: "work", label: "Work" },
];

export function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className={`${container} pt-20 pb-10`}>
      <SectionTitle index="02">Projects</SectionTitle>

      <div className="mb-7 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full border px-4 py-1.5 font-mono text-sm transition-colors ${
              filter === f.value
                ? "border-accent bg-accent text-bg"
                : "border-line text-muted hover:border-muted hover:text-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <ProjectCard key={p.name} project={p} onOpenImage={(src, alt) => setLightbox({ src, alt })} />
        ))}
      </div>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030712]/90 p-8"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-6 text-4xl leading-none text-ink"
          >
            ×
          </button>
          {/* Plain <img> so the enlarged image keeps its natural size. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[95vw] rounded-lg"
          />
        </div>
      )}
    </section>
  );
}
