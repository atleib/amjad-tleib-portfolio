import { VisitCounter } from "./VisitCounter";

export function Footer({ name }: { name: string }) {
  return (
    <footer className="px-6 py-12 text-center font-mono text-xs text-muted">
      Designed &amp; built by {name} · {new Date().getFullYear()}
      <VisitCounter />
    </footer>
  );
}
