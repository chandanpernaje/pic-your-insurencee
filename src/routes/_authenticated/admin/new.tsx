import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, Upload, X, FileCheck2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/new")({
  component: NewCustomer,
});

const categories = ["Health", "Car", "Bike", "Commercial"] as const;

const schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid phone"),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  category: z.enum(categories),
  insurer: z.string().trim().max(120).optional().or(z.literal("")),
  policy_number: z.string().trim().max(80).optional().or(z.literal("")),
  vehicle_number: z.string().trim().max(40).optional().or(z.literal("")),
  premium_amount: z.string().trim().optional().or(z.literal("")),
  start_date: z.string().optional().or(z.literal("")),
  expiry_date: z.string().min(1, "Expiry date is required"),
  notes: z.string().max(800).optional().or(z.literal("")),
});

type DocKey = "aadhaar_front" | "aadhaar_back" | "pan_front" | "pan_back" | "rc" | "old_policy";

const docs: { key: DocKey; label: string }[] = [
  { key: "aadhaar_front", label: "Aadhaar — Front" },
  { key: "aadhaar_back", label: "Aadhaar — Back" },
  { key: "pan_front", label: "PAN — Front" },
  { key: "pan_back", label: "PAN — Back" },
  { key: "rc", label: "Vehicle RC" },
  { key: "old_policy", label: "Old Policy Copy" },
];

function NewCustomer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    category: "Car" as (typeof categories)[number],
    insurer: "",
    policy_number: "",
    vehicle_number: "",
    premium_amount: "",
    start_date: "",
    expiry_date: "",
    notes: "",
  });
  const [files, setFiles] = useState<Partial<Record<DocKey, File>>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function pickFile(key: DocKey, f: File | undefined) {
    if (!f) return;
    if (f.size > 8 * 1024 * 1024) {
      setErrors((e) => ({ ...e, [key]: "Max 8 MB" }));
      return;
    }
    setErrors((e) => {
      const n = { ...e };
      delete n[key];
      return n;
    });
    setFiles((p) => ({ ...p, [key]: f }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      const customerId = crypto.randomUUID();
      const uploads: Record<string, string | null> = {};
      for (const d of docs) {
        const file = files[d.key];
        if (!file) continue;
        const ext = file.name.split(".").pop() ?? "bin";
        const path = `${customerId}/${d.key}.${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("kyc-docs")
          .upload(path, file, { upsert: false });
        if (upErr) throw new Error(`${d.label}: ${upErr.message}`);
        uploads[`${d.key}_path`] = path;
      }

      const { error: insErr } = await supabase.from("customers").insert({
        id: customerId,
        full_name: parsed.data.full_name,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        category: parsed.data.category,
        insurer: parsed.data.insurer || null,
        policy_number: parsed.data.policy_number || null,
        vehicle_number: parsed.data.vehicle_number || null,
        premium_amount: parsed.data.premium_amount ? Number(parsed.data.premium_amount) : null,
        start_date: parsed.data.start_date || null,
        expiry_date: parsed.data.expiry_date,
        notes: parsed.data.notes || null,
        created_by: userId,
        ...uploads,
      });
      if (insErr) throw new Error(insErr.message);

      navigate({ to: "/admin" });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-3xl text-primary">Add customer</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Save customer details, policy info and KYC documents to your private database.
      </p>

      <form onSubmit={submit} className="mt-8 grid gap-5 bg-card border border-border rounded-3xl p-6 md:p-8 shadow-elegant">
        <Section title="Personal">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Full name *" error={errors.full_name}>
              <input className="ip" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </Field>
            <Field label="Mobile *" error={errors.phone}>
              <input className="ip" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98xxxxxxxx" />
            </Field>
            <Field label="Email" error={errors.email}>
              <input className="ip" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Category *">
              <select className="ip" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as (typeof categories)[number] })}>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>
        </Section>

        <Section title="Policy">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Insurer">
              <input className="ip" value={form.insurer} onChange={(e) => setForm({ ...form, insurer: e.target.value })} placeholder="e.g. HDFC Ergo, ICICI Lombard" />
            </Field>
            <Field label="Policy number">
              <input className="ip" value={form.policy_number} onChange={(e) => setForm({ ...form, policy_number: e.target.value })} />
            </Field>
            <Field label="Vehicle number">
              <input className="ip" value={form.vehicle_number} onChange={(e) => setForm({ ...form, vehicle_number: e.target.value.toUpperCase() })} placeholder="KA 21 AB 1234" />
            </Field>
            <Field label="Premium (₹)">
              <input className="ip" type="number" min="0" step="1" value={form.premium_amount} onChange={(e) => setForm({ ...form, premium_amount: e.target.value })} />
            </Field>
            <Field label="Start date">
              <input className="ip" type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            </Field>
            <Field label="Expiry date *" error={errors.expiry_date}>
              <input className="ip" type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} />
            </Field>
          </div>
          <Field label="Notes">
            <textarea className="ip resize-none" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>
        </Section>

        <Section title="KYC documents">
          <p className="text-xs text-muted-foreground -mt-2">JPG / PNG / PDF · max 8 MB each. Stored privately, visible only to you.</p>
          <div className="grid md:grid-cols-2 gap-3">
            {docs.map((d) => (
              <DocPicker key={d.key} label={d.label} file={files[d.key]} error={errors[d.key]} onPick={(f) => pickFile(d.key, f)} onRemove={() => setFiles((p) => { const n = { ...p }; delete n[d.key]; return n; })} />
            ))}
          </div>
        </Section>

        {serverError && (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-xl px-3 py-2">
            {serverError}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={() => navigate({ to: "/admin" })} className="px-5 py-2.5 rounded-full border border-border text-sm text-primary hover:border-primary transition">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full gradient-emerald text-accent-foreground text-sm font-semibold shadow-emerald disabled:opacity-50 transition">
            {submitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save customer
          </button>
        </div>
      </form>

      <style>{`
        .ip { width:100%; padding:.7rem .9rem; border-radius:.85rem; background:var(--color-background); border:1px solid var(--color-border); color:var(--color-foreground); font-size:.9rem; outline:none; transition:border-color .15s, box-shadow .15s; }
        .ip:focus { border-color:var(--color-accent); box-shadow:0 0 0 4px color-mix(in oklab, var(--color-accent) 18%, transparent); }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-4">
      <h2 className="font-display text-lg text-primary border-b border-border pb-2">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">{label}</span>
      {children}
      {error && <span className="block mt-1 text-xs text-destructive">{error}</span>}
    </label>
  );
}

function DocPicker({ label, file, error, onPick, onRemove }: { label: string; file?: File; error?: string; onPick: (f: File | undefined) => void; onRemove: () => void }) {
  return (
    <label className={`block rounded-2xl border-2 border-dashed p-3 cursor-pointer transition ${file ? "border-accent bg-accent/5" : error ? "border-destructive/60 bg-destructive/5" : "border-border hover:border-accent/60"}`}>
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-xl bg-secondary grid place-items-center text-primary shrink-0">
          {file ? <FileCheck2 className="size-4 text-accent" /> : <Upload className="size-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-primary">{label}</div>
          <div className="text-[11px] text-muted-foreground truncate">{file ? file.name : "Tap to choose file"}</div>
          {error && <div className="text-[11px] text-destructive">{error}</div>}
        </div>
        {file && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.preventDefault(); onRemove(); }}
            className="p-1 text-muted-foreground hover:text-destructive"
          >
            <X className="size-4" />
          </span>
        )}
      </div>
      <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => onPick(e.target.files?.[0])} />
    </label>
  );
}
