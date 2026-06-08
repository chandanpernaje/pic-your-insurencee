import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { AGENT, whatsappLink } from "@/lib/agent";
import { useRef, useState } from "react";
import { z } from "zod";
import {
  Upload,
  FileCheck2,
  ShieldCheck,
  Send,
  AlertCircle,
  X,
} from "lucide-react";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply for a Policy — Pic Your Insurance" },
      {
        name: "description",
        content:
          "Share your KYC documents securely with Nandan over WhatsApp — Aadhaar, PAN, RC and old policy copy.",
      },
      { property: "og:title", content: "Apply for a Policy" },
      {
        property: "og:description",
        content: "Send KYC documents to your IRDAI-certified advisor.",
      },
    ],
  }),
  component: ApplyPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid phone number"),
  category: z.enum(["Health", "Car", "Bike", "Bus / Auto / Commercial"]),
  notes: z.string().trim().max(400).optional().or(z.literal("")),
});

const categories = [
  { key: "Health", kn: "ಆರೋಗ್ಯ" },
  { key: "Car", kn: "ಕಾರು" },
  { key: "Bike", kn: "ಬೈಕ್" },
  { key: "Bus / Auto / Commercial", kn: "ಬಸ್ / ಆಟೋ / ವಾಣಿಜ್ಯ" },
] as const;

type DocKey =
  | "aadhaarFront"
  | "aadhaarBack"
  | "panFront"
  | "panBack"
  | "oldPolicy"
  | "rc";

const docFields: { key: DocKey; label: string; labelKn: string; required: boolean }[] = [
  { key: "aadhaarFront", label: "Aadhaar — Front", labelKn: "ಆಧಾರ್ — ಮುಂಭಾಗ", required: true },
  { key: "aadhaarBack", label: "Aadhaar — Back", labelKn: "ಆಧಾರ್ — ಹಿಂಭಾಗ", required: true },
  { key: "panFront", label: "PAN — Front", labelKn: "ಪ್ಯಾನ್ — ಮುಂಭಾಗ", required: true },
  { key: "panBack", label: "PAN — Back", labelKn: "ಪ್ಯಾನ್ — ಹಿಂಭಾಗ", required: false },
  { key: "oldPolicy", label: "Old Insurance Copy", labelKn: "ಹಳೆಯ ವಿಮೆ ಪ್ರತಿ", required: false },
  { key: "rc", label: "Vehicle RC (for vehicle cover)", labelKn: "ವಾಹನ RC", required: false },
];

function ApplyPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    category: "Car" as (typeof categories)[number]["key"],
    notes: "",
  });
  const [files, setFiles] = useState<Partial<Record<DocKey, File>>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  function pickFile(key: DocKey, file: File | undefined) {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setErrors((e) => ({ ...e, [key]: "Max file size 8 MB" }));
      return;
    }
    setErrors((e) => {
      const n = { ...e };
      delete n[key];
      return n;
    });
    setFiles((f) => ({ ...f, [key]: file }));
  }

  function removeFile(key: DocKey) {
    setFiles((f) => {
      const n = { ...f };
      delete n[key];
      return n;
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    const errs: Record<string, string> = {};
    if (!parsed.success) {
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
    }
    docFields.forEach((d) => {
      if (d.required && !files[d.key]) errs[d.key] = "Required";
    });
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const fileList = docFields
      .filter((d) => files[d.key])
      .map((d) => `• ${d.label} — ${files[d.key]!.name}`)
      .join("\n");

    const msg = `Hi ${AGENT.name}, I'd like to apply for an insurance policy.

Name: ${form.name}
Phone: ${form.phone}
Category: ${form.category}
${form.notes ? `Notes: ${form.notes}\n` : ""}
Documents I'll attach in this chat:
${fileList}

Please share the best quotes and the payment link.`;

    window.open(whatsappLink(msg), "_blank");
  }

  return (
    <Layout>
      <section className="gradient-hero text-primary-foreground">
        <div className="max-w-4xl mx-auto px-5 py-14 md:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-glow font-semibold">
            Broker application · ಬ್ರೋಕರ್ ಅರ್ಜಿ
          </p>
          <h1 className="mt-2 font-display text-4xl md:text-6xl">
            Apply with your documents.
          </h1>
          <p className="mt-1 font-display text-2xl md:text-3xl text-accent-glow">
            ದಾಖಲೆಗಳೊಂದಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.
          </p>
          <p className="mt-4 text-primary-foreground/75 max-w-2xl text-sm md:text-base">
            Fill in your details and pick the KYC documents Nandan needs to
            issue your policy. On submit, your details open in WhatsApp — then
            simply attach the selected document images in the same chat.
          </p>
          <p className="mt-2 text-primary-foreground/60 text-sm max-w-2xl">
            ನಿಮ್ಮ ವಿವರಗಳನ್ನು ತುಂಬಿ ಮತ್ತು KYC ದಾಖಲೆಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ. WhatsApp ತೆರೆದ ನಂತರ ಚಿತ್ರಗಳನ್ನು ಲಗತ್ತಿಸಿ.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 -mt-10 md:-mt-14 pb-16">
        <form
          onSubmit={submit}
          className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-elegant grid gap-6"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Full name · ಪೂರ್ಣ ಹೆಸರು" error={errors.name}>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="As on Aadhaar"
                className="input-field"
              />
            </Field>
            <Field label="Mobile number · ಮೊಬೈಲ್ ಸಂಖ್ಯೆ" error={errors.phone}>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98xxxxxxxx"
                className="input-field"
              />
            </Field>
          </div>

          <Field label="Insurance category · ವಿಮಾ ವರ್ಗ">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {categories.map((c) => {
                const active = form.category === c.key;
                return (
                  <button
                    type="button"
                    key={c.key}
                    onClick={() => setForm({ ...form, category: c.key })}
                    className={`py-3 px-3 rounded-2xl text-xs md:text-sm font-medium border transition-all leading-tight ${
                      active
                        ? "border-accent gradient-emerald text-accent-foreground shadow-emerald"
                        : "border-border bg-background hover:border-accent/50"
                    }`}
                  >
                    {c.key}
                    <span className="block text-[10px] opacity-80 mt-0.5">{c.kn}</span>
                  </button>
                );
              })}
            </div>
          </Field>

          <div>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="font-display text-xl text-primary">
                Upload documents · ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ
              </h2>
              <span className="text-xs text-muted-foreground">JPG / PNG / PDF · max 8 MB</span>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {docFields.map((d) => (
                <DocUpload
                  key={d.key}
                  label={d.label}
                  labelKn={d.labelKn}
                  required={d.required}
                  file={files[d.key]}
                  error={errors[d.key]}
                  onPick={(f) => pickFile(d.key, f)}
                  onRemove={() => removeFile(d.key)}
                />
              ))}
            </div>
          </div>

          <Field label="Anything else? · ಬೇರೆ ವಿಷಯ?">
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Vehicle make/model, previous insurer, sum insured needed, etc."
              rows={3}
              className="input-field resize-none"
            />
          </Field>

          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 flex gap-3 text-sm">
            <AlertCircle className="size-5 text-accent shrink-0 mt-0.5" />
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-primary">How it works:</strong> we open
              WhatsApp with your details pre-filled. In the same chat, tap the
              attachment icon and send the document images you picked above.
              Nandan will reply with the best quote and a secure payment link.
            </p>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 py-4 rounded-full gradient-emerald text-accent-foreground font-semibold shadow-emerald hover:translate-y-[-1px] transition"
          >
            Send details to {AGENT.shortName} on WhatsApp <Send className="size-4" />
          </button>

          <p className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
            <ShieldCheck className="size-4 text-accent" />
            Your documents are shared only with your IRDAI-certified advisor.
          </p>
        </form>
      </section>

      <style>{`
        .input-field {
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
        .input-field:focus {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 4px color-mix(in oklab, var(--color-accent) 18%, transparent);
        }
      `}</style>
    </Layout>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-primary mb-2">{label}</span>
      {children}
      {error && <span className="block mt-1.5 text-xs text-destructive">{error}</span>}
    </label>
  );
}

function DocUpload({
  label,
  labelKn,
  required,
  file,
  error,
  onPick,
  onRemove,
}: {
  label: string;
  labelKn: string;
  required: boolean;
  file?: File;
  error?: string;
  onPick: (f: File | undefined) => void;
  onRemove: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={`w-full text-left rounded-2xl border-2 border-dashed p-4 transition flex items-start gap-3 ${
          file
            ? "border-accent bg-accent/5"
            : error
              ? "border-destructive/60 bg-destructive/5"
              : "border-border bg-background hover:border-accent/60"
        }`}
      >
        <div className="size-10 rounded-xl grid place-items-center shrink-0 bg-secondary text-primary">
          {file ? <FileCheck2 className="size-5 text-accent" /> : <Upload className="size-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-primary flex items-center gap-1.5">
            {label}
            {required && <span className="text-destructive text-xs">*</span>}
          </div>
          <div className="text-[11px] text-muted-foreground">{labelKn}</div>
          {file ? (
            <div className="mt-1 text-xs text-accent truncate">{file.name}</div>
          ) : (
            <div className="mt-1 text-xs text-muted-foreground">
              Tap to choose file
            </div>
          )}
          {error && (
            <div className="mt-1 text-xs text-destructive">{error}</div>
          )}
        </div>
        {file && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="text-muted-foreground hover:text-destructive p-1"
            aria-label="Remove file"
          >
            <X className="size-4" />
          </span>
        )}
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0])}
      />
    </div>
  );
}
