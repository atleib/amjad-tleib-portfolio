import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import type { ImgHTMLAttributes } from "react";

afterEach(() => cleanup());

// next/image needs the Next.js runtime; in unit tests a plain <img> is enough.
vi.mock("next/image", () => ({
  default: ({ priority: _priority, ...props }: ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...props} />
  ),
}));
