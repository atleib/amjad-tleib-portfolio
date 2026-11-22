export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export type ValidationResult =
  | { ok: true; value: ContactMessage; isBot: boolean }
  | { ok: false; error: string };

export const LIMITS = { name: 100, email: 254, message: 5000 } as const;

// Intentionally simple: one "@", something on each side, a dot in the domain, no spaces.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Parses and validates a contact-form request body. Pure function so it's easy to unit test. */
export function validateContact(rawBody: string | undefined | null): ValidationResult {
  let input: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(rawBody ?? "");
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return { ok: false, error: "Body must be a JSON object." };
    }
    input = parsed as Record<string, unknown>;
  } catch {
    return { ok: false, error: "Body must be valid JSON." };
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(input.name);
  const email = str(input.email);
  const message = str(input.message);
  const isBot = str(input.company).length > 0; // honeypot field

  if (!name) return { ok: false, error: "Name is required." };
  if (name.length > LIMITS.name) return { ok: false, error: "Name is too long." };
  if (!email || email.length > LIMITS.email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "A valid email is required." };
  }
  if (!message) return { ok: false, error: "Message is required." };
  if (message.length > LIMITS.message) return { ok: false, error: "Message is too long." };

  return { ok: true, value: { name, email, message }, isBot };
}
