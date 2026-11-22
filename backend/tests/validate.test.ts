import { describe, expect, it } from "vitest";
import { LIMITS, validateContact } from "../src/validate";

const body = (o: unknown) => JSON.stringify(o);
const valid = { name: "Jane Doe", email: "jane@example.com", message: "Hello!" };

describe("validateContact", () => {
  it("accepts a valid message and trims whitespace", () => {
    const r = validateContact(body({ name: "  Jane Doe ", email: " jane@example.com", message: " Hello! " }));
    expect(r).toEqual({ ok: true, value: valid, isBot: false });
  });

  it("rejects invalid JSON and non-objects", () => {
    expect(validateContact("not json")).toMatchObject({ ok: false });
    expect(validateContact(undefined)).toMatchObject({ ok: false });
    expect(validateContact(body([1, 2]))).toMatchObject({ ok: false });
    expect(validateContact(body(null))).toMatchObject({ ok: false });
  });

  it.each([
    ["missing name", { ...valid, name: "" }],
    ["missing email", { ...valid, email: "" }],
    ["bad email", { ...valid, email: "jane@example" }],
    ["email with spaces", { ...valid, email: "jane doe@example.com" }],
    ["missing message", { ...valid, message: "   " }],
    ["non-string name", { ...valid, name: 42 }],
  ])("rejects %s", (_label, input) => {
    expect(validateContact(body(input))).toMatchObject({ ok: false });
  });

  it("enforces length limits", () => {
    expect(validateContact(body({ ...valid, name: "a".repeat(LIMITS.name + 1) }))).toMatchObject({ ok: false });
    expect(validateContact(body({ ...valid, message: "a".repeat(LIMITS.message + 1) }))).toMatchObject({ ok: false });
    expect(validateContact(body({ ...valid, message: "a".repeat(LIMITS.message) }))).toMatchObject({ ok: true });
  });

  it("flags the honeypot field as a bot", () => {
    expect(validateContact(body({ ...valid, company: "Spam Inc" }))).toMatchObject({ ok: true, isBot: true });
  });
});
