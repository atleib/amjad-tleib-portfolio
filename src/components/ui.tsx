/** Small shared building blocks. */

export function SectionTitle({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <h2 className="mb-9 flex items-center gap-3 text-3xl font-bold">
      <span className="font-mono text-lg font-normal text-accent">{index}.</span>
      {children}
      <span aria-hidden="true" className="h-px max-w-xs flex-1 bg-line" />
    </h2>
  );
}

export function Tags({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
      {items.map((t) => (
        <li key={t} className="rounded-md bg-accent/10 px-2.5 py-0.5 font-mono text-xs text-accent">
          {t}
        </li>
      ))}
    </ul>
  );
}

export function Bullets({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return (
    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted marker:text-accent">
      {items.map((h) => (
        <li key={h}>{h}</li>
      ))}
    </ul>
  );
}

export const container = "mx-auto w-full max-w-5xl px-6";
