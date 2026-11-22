import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/data/site";

const base: Project = {
  name: "Test Project",
  category: "personal",
  display: "link",
  description: "A project used in tests.",
  tech: ["TypeScript"],
};

describe("ProjectCard", () => {
  it("shows live and code links for a link project", () => {
    render(<ProjectCard project={{ ...base, links: { live: "https://example.com", github: "https://github.com/x/y" } }} />);
    expect(screen.getByRole("link", { name: /live site/i })).toHaveAttribute("href", "https://example.com");
    expect(screen.getByRole("link", { name: /code/i })).toHaveAttribute("href", "https://github.com/x/y");
    expect(screen.getByText("Personal Project")).toBeInTheDocument();
  });

  it("shows a clickable screenshot for a screenshot project", async () => {
    const onOpenImage = vi.fn();
    render(
      <ProjectCard
        project={{ ...base, display: "screenshot", image: "/shot.png", imageAlt: "A screenshot" }}
        onOpenImage={onOpenImage}
      />,
    );
    expect(screen.getByAltText("A screenshot")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /enlarge screenshot/i }));
    expect(onOpenImage).toHaveBeenCalledWith("/shot.png", "A screenshot");
  });

  it("shows only text, a Work badge and the note for a text-only work project", () => {
    render(
      <ProjectCard
        project={{ ...base, category: "work", display: "text", note: "Internal project.", highlights: ["Did a thing"] }}
      />,
    );
    expect(screen.getByText("Work Project")).toBeInTheDocument();
    expect(screen.getByText("Internal project.")).toBeInTheDocument();
    expect(screen.getByText("Did a thing")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
