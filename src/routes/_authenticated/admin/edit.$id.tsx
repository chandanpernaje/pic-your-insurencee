import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2, Save } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/edit/$id")({
  component: EditCustomer,
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

function EditCustomer() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: c, isLoading } = useQuery({
    queryKey: ["customer", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!c) return;
    setForm({
      full_name: c.full_name ?? "",
      phone: c.phone ?? "",
      email: c.email ?? "",
      category: (categories.includes(c.category as never) ? c.category : "Car") as (typeof categories)[number],
      insurer: c.insurer ?? "",
      policy_number: c.policy_number ?? "",
      vehicle_number: c.vehicle_number ?? "",
      premium_amount: c.premium_amount != null ? String(c.premium_amount) : "",
      start_date: c.start_date ?? "",
      expiry_date: c.expiry_date ?? "",
      notes: c.notes ?? "",
    });
  }, [c]);

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
    setSaving(true);
    try {
      const { error } = await supabase
        .from("customers")
        .update({
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
        })
        .eq("id", id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["customers"] });
      qc.invalidateQueries({ queryKey: ["customer", id] });
      navigate({ to: "/admin/$id", params: { id } });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="grid place-items-center py-20">
        <Loader2 className="size-6 animate-spin text-accent" />
      </div>
    );
  }
  if (!c) {
    return (
      <p className="text-sm">
        Not found. <Link to="/admin">Back</Link>
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        to="/admin/$id"
        params={{ id }}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Back to customer
      </Link>
      <h1 className="font-display text-3xl text-primary mt-3">Edit customer</h1>

      <form
        onSubmit={submit}
        className="mt-6 grid gap-5 bg-card border border-border rounded-3xl p-6 md:p-8 shadow-elegant"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <F label="Full name *" err={errors.full_name}>
            <input className="ip" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </F>
          <F label="Mobile *" err={errors.phone}>
            <input className="ip" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </F>
          <F label="Email" err={errors.email}>
            <input className="ip" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </F>
          <F label="Category *">
            <select
              className="ip"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as (typeof categories)[number] })}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </F>
          <F label="Insurer">
            <input className="ip" value={form.insurer} onChange={(e) => setForm({ ...form, insurer: e.target.value })} />
          </F>
          <F label="Policy number">
            <input className="ip" value={form.policy_number} onChange={(e) => setForm({ ...form, policy_number: e.target.value })} />
          </F>
          <F label="Vehicle number">
            <input
              className="ip"
              value={form.vehicle_number}
              onChange={(e) => setForm({ ...form, vehicle_number: e.target.value.toUpperCase() })}
            />
          </F>
          <F label="Premium (₹)">
            <input
              className="ip"
              type="number"
              min="0"
              step="1"
              value={form.premium_amount}
              onChange={(e) => setForm({ ...form, premium_amount: e.target.value })}
            />
          </F>
          <F label="Start date">
            <input className="ip" type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
          </F>
          <F label="Expiry date *" err={errors.expiry_date}>
            <input className="ip" type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} />
          </F>
        </div>
        <F label="Notes">
          <textarea className="ip resize-none" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </F>

        {serverError && (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-xl px-3 py-2">
            {serverError}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/$id", params: { id } })}
            className="px-5 py-2.5 rounded-full border border-border text-sm text-primary hover:border-primary transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full gradient-emerald text-accent-foreground text-sm font-semibold shadow-emerald disabled:opacity-50 transition"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save changes
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

function F({ label, err, children }: { label: string; err?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">{label}</span>
      {children}
      {err && <span className="block mt-1 text-xs text-destructive">{err}</span>}
    </label>
  );
}
