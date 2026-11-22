import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Projects } from "@/components/Projects";
import type { Project } from "@/data/site";

const projects: Project[] = [
  { name: "Personal A", category: "personal", display: "link", description: "a", tech: [] },
  { name: "Work B", category: "work", display: "text", description: "b", tech: [] },
  {
    name: "Personal C",
    category: "personal",
    display: "screenshot",
    description: "c",
    tech: [],
    image: "/c.png",
    imageAlt: "Screenshot C",
  },
];

describe("Projects", () => {
  it("filters by category", async () => {
    render(<Projects projects={projects} />);
    expect(screen.getAllByTestId("project-card")).toHaveLength(3);

    await userEvent.click(screen.getByRole("button", { name: "Work" }));
    expect(screen.getAllByTestId("project-card")).toHaveLength(1);
    expect(screen.getByText("Work B")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Personal" }));
    expect(screen.getAllByTestId("project-card")).toHaveLength(2);

    await userEvent.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getAllByTestId("project-card")).toHaveLength(3);
  });

  it("opens and closes the screenshot lightbox", async () => {
    render(<Projects projects={projects} />);
    await userEvent.click(screen.getByRole("button", { name: /enlarge screenshot of personal c/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
