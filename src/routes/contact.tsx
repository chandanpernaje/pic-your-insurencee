import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { AGENT, whatsappLink } from "@/lib/agent";
import { useState } from "react";
import { z } from "zod";
import { Mail, MessageCircle, Phone, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Ask the Advisor — Pic Your Insurance" },
      {
        name: "description",
        content:
          "Have a question? Reach Nandan Pernaje directly on WhatsApp or email.",
      },
      { property: "og:title", content: "Ask the Advisor — Pic Your Insurance" },
      {
        property: "og:description",
        content: "Reach Nandan Pernaje directly on WhatsApp or email.",
      },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  message: z
    .string()
    .trim()
    .min(5, "Your message is a bit short")
    .max(800, "Please keep it under 800 characters"),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      return;
    }
    const msg = `Hi ${AGENT.name}, this is ${parsed.data.name}.\n\n${parsed.data.message}`;
    window.open(whatsappLink(msg), "_blank");
  }

  return (
    <Layout>
      <section className="gradient-hero text-primary-foreground">
        <div className="max-w-4xl mx-auto px-5 py-14 md:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-glow font-semibold">
            Ask the advisor
          </p>
          <h1 className="mt-2 font-display text-4xl md:text-6xl">
            Talk to {AGENT.name}.
          </h1>
          <p className="mt-3 text-primary-foreground/75 max-w-lg">
            Replies usually within an hour during business hours. No call
            centres, no scripts — just direct advice.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 -mt-10 md:-mt-14 pb-16 grid md:grid-cols-[1.2fr_1fr] gap-5">
        <form
          onSubmit={submit}
          className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-elegant grid gap-5"
        >
          <label className="block">
            <span className="block text-sm font-medium text-primary mb-2">Your name</span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full name"
              className="contact-input"
            />
            {errors.name && (
              <span className="block mt-1.5 text-xs text-destructive">{errors.name}</span>
            )}
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-primary mb-2">Your question</span>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={6}
              placeholder="Type your question or insurance need…"
              className="contact-input resize-none"
            />
            {errors.message && (
              <span className="block mt-1.5 text-xs text-destructive">{errors.message}</span>
            )}
          </label>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 py-4 rounded-full gradient-emerald text-accent-foreground font-semibold shadow-emerald hover:translate-y-[-1px] transition"
          >
            Send via WhatsApp <Send className="size-4" />
          </button>
        </form>

        <aside className="grid gap-3 content-start">
          <ContactCard
            icon={MessageCircle}
            label="WhatsApp"
            value="Fastest reply"
            href={whatsappLink(`Hi ${AGENT.name}, I'd like to talk.`)}
          />
          <ContactCard
            icon={Mail}
            label="Email"
            value={AGENT.email}
            href={`mailto:${AGENT.email}`}
          />
          <ContactCard
            icon={Phone}
            label="Call directly"
            value={"+" + AGENT.phone.replace(/(\d{2})(\d{5})(\d{5})/, "$1 $2 $3")}
            href={`tel:+${AGENT.phone}`}
          />
        </aside>
      </section>

      <style>{`
        .contact-input {
          width: 100%;
          padding: 0.85rem 1rem;
          border-radius: 0.9rem;
          background: var(--color-background);
          border: 1px solid var(--color-border);
          color: var(--color-foreground);
          font-size: 0.95rem;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .contact-input:focus {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 4px color-mix(in oklab, var(--color-accent) 18%, transparent);
        }
      `}</style>
    </Layout>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-4 bg-card border border-border rounded-2xl p-5 hover:border-accent/40 hover:shadow-elegant transition-all"
    >
      <div className="size-12 rounded-2xl gradient-emerald grid place-items-center shadow-emerald shrink-0">
        <Icon className="size-5 text-accent-foreground" />
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="font-display text-lg text-primary leading-tight">{value}</div>
      </div>
    </a>
  );
}
