import type { Job } from "@/data/site";
import { Bullets, SectionTitle, Tags, container } from "./ui";

export function Experience({ jobs }: { jobs: Job[] }) {
  return (
    <section id="experience" className={`${container} pt-20 pb-10`}>
      <SectionTitle index="01">Work Experience</SectionTitle>
      <ol className="ml-2 border-l-2 border-line pl-6">
        {jobs.map((job) => (
          <li key={`${job.company}-${job.dates}`} className="relative pb-9 pl-5">
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-8 h-3.5 w-3.5 rounded-full border-2 border-accent bg-bg"
            />
            <h3 className="text-xl font-semibold">
              {job.title} <span className="text-accent">@ {job.company}</span>
            </h3>
            <p className="mt-1.5 font-mono text-sm text-muted">
              {job.dates} · {job.location}
            </p>
            <Bullets items={job.highlights} />
            <Tags items={job.tech} />
          </li>
        ))}
      </ol>
    </section>
  );
}
