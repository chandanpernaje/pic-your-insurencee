import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AGENT, whatsappLink } from "@/lib/agent";
import { ArrowLeft, Calendar, FileText, Loader2, MessageCircle, Pencil, Phone, Trash2, Download } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/$id")({
  component: CustomerDetail,
});

const docFields = [
  { key: "aadhaar_front_path", label: "Aadhaar — Front" },
  { key: "aadhaar_back_path", label: "Aadhaar — Back" },
  { key: "pan_front_path", label: "PAN — Front" },
  { key: "pan_back_path", label: "PAN — Back" },
  { key: "rc_path", label: "Vehicle RC" },
  { key: "old_policy_path", label: "Old Policy Copy" },
] as const;

function CustomerDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const { data: c, isLoading, error, refetch } = useQuery({
    queryKey: ["customer", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  async function openDoc(path: string) {
    const { data, error } = await supabase.storage.from("kyc-docs").createSignedUrl(path, 300);
    if (error) {
      alert(error.message);
      return;
    }
    window.open(data.signedUrl, "_blank");
  }

  async function remove() {
    if (!c) return;
    if (!confirm(`Delete ${c.full_name}? This cannot be undone.`)) return;
    setDeleting(true);
    // Delete docs
    const paths = docFields.map((d) => c[d.key]).filter(Boolean) as string[];
    if (paths.length) await supabase.storage.from("kyc-docs").remove(paths);
    const { error } = await supabase.from("customers").delete().eq("id", id);
    setDeleting(false);
    if (error) {
      alert(error.message);
      return;
    }
    navigate({ to: "/admin" });
  }

  if (isLoading) {
    return <div className="grid place-items-center py-20"><Loader2 className="size-6 animate-spin text-accent" /></div>;
  }
  if (error) return <p className="text-destructive">{(error as Error).message}</p>;
  if (!c) return <p>Not found. <Link to="/admin">Back</Link></p>;

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const days = Math.ceil((new Date(c.expiry_date).getTime() - today.getTime()) / 86400000);
  const expired = days < 0;
  const urgent = days >= 0 && days <= 30;

  const renewMsg = `Hi ${c.full_name}, this is ${AGENT.shortName}. Your ${c.category} policy${c.insurer ? ` with ${c.insurer}` : ""} is up for renewal on ${new Date(c.expiry_date).toLocaleDateString("en-IN")}. Shall I share renewal options?`;

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-4" /> Back to customers
      </Link>

      <div className="mt-4 bg-card border border-border rounded-3xl p-6 md:p-8 shadow-elegant">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-primary">{c.full_name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{c.category}{c.insurer ? ` · ${c.insurer}` : ""}{c.policy_number ? ` · #${c.policy_number}` : ""}</p>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium self-start ${
            expired ? "bg-destructive/10 text-destructive" : urgent ? "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400" : "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
          }`}>
            <Calendar className="size-4" />
            {expired ? `Expired ${-days}d ago` : urgent ? `Expires in ${days}d` : `Valid · expires ${new Date(c.expiry_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
          <Info label="Phone" value={<a href={`tel:${c.phone}`} className="text-primary hover:text-accent">{c.phone}</a>} />
          <Info label="Email" value={c.email || "—"} />
          <Info label="Vehicle number" value={c.vehicle_number || "—"} />
          <Info label="Premium" value={c.premium_amount ? `₹ ${Number(c.premium_amount).toLocaleString("en-IN")}` : "—"} />
          <Info label="Start date" value={c.start_date ? new Date(c.start_date).toLocaleDateString("en-IN") : "—"} />
          <Info label="Expiry date" value={new Date(c.expiry_date).toLocaleDateString("en-IN")} />
        </div>

        {c.notes && (
          <div className="mt-5 p-4 rounded-2xl bg-secondary text-sm text-primary whitespace-pre-wrap">
            {c.notes}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <a href={`tel:${c.phone}`} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
            <Phone className="size-4" /> Call
          </a>
          <a href={`https://wa.me/${c.phone.replace(/\D/g, "")}?text=${encodeURIComponent(renewMsg)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full gradient-emerald text-accent-foreground text-sm font-semibold shadow-emerald">
            <MessageCircle className="size-4" /> WhatsApp renewal
          </a>
          <Link
            to="/admin/edit/$id"
            params={{ id }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-sm text-primary hover:border-accent hover:text-accent transition"
          >
            <Pencil className="size-4" /> Edit
          </Link>
          <button onClick={remove} disabled={deleting} className="ml-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-destructive/40 text-destructive text-sm hover:bg-destructive/10 disabled:opacity-50 transition">
            {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />} Delete
          </button>
        </div>
      </div>

      {/* Documents */}
      <div className="mt-6 bg-card border border-border rounded-3xl p-6 md:p-8 shadow-elegant">
        <h2 className="font-display text-xl text-primary">KYC Documents</h2>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {docFields.map((d) => {
            const path = c[d.key] as string | null;
            return (
              <div key={d.key} className={`rounded-2xl border p-4 flex items-center gap-3 ${path ? "border-border bg-background" : "border-dashed border-border/60 bg-muted/30"}`}>
                <div className={`size-10 rounded-xl grid place-items-center shrink-0 ${path ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground"}`}>
                  <FileText className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-primary">{d.label}</div>
                  <div className="text-xs text-muted-foreground">{path ? "Uploaded" : "Not uploaded"}</div>
                </div>
                {path && (
                  <button onClick={() => openDoc(path)} className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-glow">
                    <Download className="size-3.5" /> View
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
      <div className="text-primary mt-0.5">{value}</div>
    </div>
  );
}
