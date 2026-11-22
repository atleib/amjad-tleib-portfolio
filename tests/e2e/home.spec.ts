import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("shows every section", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Amjad Tleib");
  for (const id of ["about", "experience", "projects", "contact"]) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
});

test("navigates to a section from the menu", async ({ page, isMobile }) => {
  if (isMobile) await page.getByRole("button", { name: "Toggle menu" }).click();
  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Projects" }).click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator("#projects")).toBeInViewport();
});

test("filters projects", async ({ page }) => {
  const cards = page.getByTestId("project-card");
  const total = await cards.count();
  await page.getByRole("button", { name: "Work", exact: true }).click();
  const work = await cards.count();
  expect(work).toBeGreaterThan(0);
  expect(work).toBeLessThan(total);
  for (const card of await cards.all()) {
    await expect(card).toHaveAttribute("data-category", "work");
  }
});

test("opens a screenshot in the lightbox", async ({ page }) => {
  await page.getByRole("button", { name: /enlarge screenshot/i }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("contact form requires fields and reports status", async ({ page }) => {
  const form = page.getByRole("form", { name: "Contact form" });
  await form.getByLabel("Name").fill("Test User");
  await form.getByLabel("Email").fill("test@example.com");
  await form.getByLabel("Message").fill("Hello from Playwright");
  await form.getByRole("button", { name: "Send message" }).click();
  // CI builds the e2e copy without an API URL, so the form explains it isn't wired up.
  await expect(form.getByRole("status")).not.toBeEmpty();
});

test("unknown pages show the 404 page", async ({ page }) => {
  await page.goto("/does-not-exist");
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});
