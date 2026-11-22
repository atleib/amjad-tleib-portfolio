"use client";

import { useState, type FormEvent } from "react";
import type { SiteData } from "@/data/site";
import { isApiConfigured, sendContact } from "@/lib/api";
import { GitHubIcon, LinkedInIcon, MailIcon, PinIcon } from "./icons";
import { SectionTitle, container } from "./ui";

type Status = { kind: "idle" | "sending" | "success" | "error"; message: string };

const inputClass =
  "rounded-lg border border-line bg-surface px-3.5 py-3 text-ink outline-none focus:border-accent focus:ring-3 focus:ring-accent/15";

export function Contact({ contact }: { contact: SiteData["contact"] }) {
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    if (!isApiConfigured()) {
      setStatus({ kind: "error", message: "The contact form isn't set up yet. Please email me directly." });
      return;
    }

    const data = new FormData(form);
    setStatus({ kind: "sending", message: "Sending..." });
    try {
      await sendContact({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        message: String(data.get("message") ?? ""),
        company: String(data.get("company") ?? ""),
      });
      form.reset();
      setStatus({ kind: "success", message: "Thanks! Your message was sent." });
    } catch {
      setStatus({ kind: "error", message: "Something went wrong. Please email me directly." });
    }
  }

  const statusColor =
    status.kind === "success" ? "text-green-400" : status.kind === "error" ? "text-red-400" : "text-muted";

  return (
    <section id="contact" className={`${container} pt-20 pb-10`}>
      <SectionTitle index="03">Contact</SectionTitle>
      <p className="mb-8 max-w-prose text-muted">
        I&apos;m open to new opportunities. Whether you have a role in mind, a question, or just want to
        say hi, my inbox is open.
      </p>

      <div className="grid items-start gap-12 md:grid-cols-[1.5fr_1fr]">
        <form onSubmit={onSubmit} className="flex flex-col gap-4" aria-label="Contact form">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Name
            <input name="name" type="text" required maxLength={100} autoComplete="name" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Email
            <input name="email" type="email" required maxLength={254} autoComplete="email" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Message
            <textarea name="message" rows={5} required maxLength={5000} className={`${inputClass} resize-y`} />
          </label>
          {/* Honeypot: hidden from people, bots tend to fill it in. */}
          <input name="company" type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <button
            type="submit"
            disabled={status.kind === "sending"}
            className="self-start rounded-lg bg-accent px-5 py-3 font-semibold text-bg transition hover:-translate-y-0.5 hover:bg-accent-hover disabled:opacity-60"
          >
            Send message
          </button>
          <p role="status" className={`min-h-6 text-sm ${statusColor}`}>
            {status.message}
          </p>
        </form>

        <ul className="flex flex-col gap-3.5">
          <li>
            <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-3 font-medium hover:text-accent">
              <MailIcon className="h-5 w-5 text-accent" /> {contact.email}
            </a>
          </li>
          <li>
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 font-medium hover:text-accent">
              <LinkedInIcon className="h-5 w-5 text-accent" /> LinkedIn
            </a>
          </li>
          <li>
            <a href={contact.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 font-medium hover:text-accent">
              <GitHubIcon className="h-5 w-5 text-accent" /> GitHub
            </a>
          </li>
          <li className="inline-flex items-center gap-3 font-medium">
            <PinIcon className="h-5 w-5 text-accent" /> {contact.location}
          </li>
        </ul>
      </div>
    </section>
  );
}
