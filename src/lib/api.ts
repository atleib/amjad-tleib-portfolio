/** Base URL of the API Gateway endpoint, injected at build time. Empty when not configured. */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export const isApiConfigured = () => API_URL.length > 0;

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  /** Honeypot: real users leave this empty. */
  company?: string;
}

export async function sendContact(payload: ContactPayload): Promise<void> {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
}

export async function recordVisit(): Promise<number> {
  const res = await fetch(`${API_URL}/visits`, { method: "POST" });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const body = (await res.json()) as { count: number };
  return body.count;
}
