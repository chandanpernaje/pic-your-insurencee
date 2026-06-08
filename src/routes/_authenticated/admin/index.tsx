import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AGENT } from "@/lib/agent";
import {
  AlertTriangle,
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileSpreadsheet,
  Loader2,
  MessageCircle,
  Search,
  Users,
  UserPlus,
  X,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: CustomerList,
});

type Customer = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  category: string;
  insurer: string | null;
  policy_number: string | null;
  vehicle_number: string | null;
  expiry_date: string;
  premium_amount: number | null;
};

type ExpiryFilter = "all" | "7" | "15" | "30" | "expired";

function daysUntil(d: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((new Date(d).getTime() - today.getTime()) / 86400000);
}

function CustomerList() {
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [filter, setFilter] = useState<ExpiryFilter>("all");
  const [importOpen, setImportOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select(
          "id, full_name, phone, email, category, insurer, policy_number, vehicle_number, expiry_date, premium_amount",
        )
        .order("expiry_date", { ascending: true });
      if (error) throw error;
      return data as Customer[];
    },
  });

  const stats = useMemo(() => {
    const list = data ?? [];
    let active = 0,
      expiring = 0,
      expired = 0;
    list.forEach((c) => {
      const d = daysUntil(c.expiry_date);
      if (d < 0) expired++;
      else {
        active++;
        if (d <= 30) expiring++;
      }
    });
    return { total: list.length, active, expiring, expired };
  }, [data]);

  const customers = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    let list = data;
    if (q) {
      list = list.filter(
        (c) =>
          c.full_name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          (c.policy_number ?? "").toLowerCase().includes(q) ||
          (c.vehicle_number ?? "").toLowerCase().includes(q) ||
          (c.insurer ?? "").toLowerCase().includes(q),
      );
    }
    if (filter !== "all") {
      list = list.filter((c) => {
        const d = daysUntil(c.expiry_date);
        if (filter === "expired") return d < 0;
        const limit = Number(filter);
        return d >= 0 && d <= limit;
      });
    }
    return [...list].sort((a, b) => {
      const cmp = new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
      return sortAsc ? cmp : -cmp;
    });
  }, [data, search, sortAsc, filter]);

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-primary">Customers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.total} total · sorted by nearest expiry
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setImportOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-sm font-medium text-primary hover:border-accent hover:text-accent transition"
          >
            <FileSpreadsheet className="size-4" /> Import Excel
          </button>
          <Link
            to="/admin/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-emerald text-accent-foreground text-sm font-semibold shadow-emerald hover:translate-y-[-1px] transition"
          >
            <UserPlus className="size-4" /> Add customer
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total customers" value={stats.total} icon={Users} tone="primary" />
        <StatCard label="Active policies" value={stats.active} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Expiring ≤30 days" value={stats.expiring} icon={AlertTriangle} tone="amber" />
        <StatCard label="Expired" value={stats.expired} icon={Calendar} tone="destructive" />
      </div>

      {/* Search + filters + sort */}
      <div className="grid gap-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, mobile, policy, vehicle"
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-card border border-border focus:border-accent focus:ring-4 focus:ring-accent/15 outline-none text-sm transition"
            />
          </div>
          <button
            onClick={() => setSortAsc((s) => !s)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-sm text-primary hover:border-accent transition"
            title="Toggle sort"
          >
            <ArrowUpDown className="size-4" />
            Expiry {sortAsc ? "↑" : "↓"}
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { k: "all", l: "All" },
              { k: "7", l: "Next 7 days" },
              { k: "15", l: "Next 15 days" },
              { k: "30", l: "Next 30 days" },
              { k: "expired", l: "Expired" },
            ] as { k: ExpiryFilter; l: string }[]
          ).map((f) => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${
                filter === f.k
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:text-primary hover:border-primary/50"
              }`}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="grid place-items-center py-20">
          <Loader2 className="size-6 animate-spin text-accent" />
        </div>
      ) : error ? (
        <div className="text-destructive text-sm">Could not load customers: {(error as Error).message}</div>
      ) : customers.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-16 text-center">
          <p className="font-display text-xl text-primary">No customers match</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try a different search or filter, or add a new customer.
          </p>
        </div>
      ) : (
        <div className="grid gap-2">
          {customers.map((c) => {
            const days = daysUntil(c.expiry_date);
            const urgent = days >= 0 && days <= 30;
            const expired = days < 0;
            const waMsg = `Hi ${c.full_name}, this is ${AGENT.shortName}. Your ${c.category} policy${c.insurer ? ` with ${c.insurer}` : ""} is up for renewal on ${new Date(c.expiry_date).toLocaleDateString("en-IN")}. Shall I share renewal options?`;
            return (
              <Link
                key={c.id}
                to="/admin/$id"
                params={{ id: c.id }}
                className="group bg-card border border-border rounded-2xl p-4 md:p-5 flex items-center gap-4 hover:border-accent hover:shadow-elegant transition"
              >
                <div
                  className={`size-12 rounded-xl grid place-items-center text-sm font-semibold shrink-0 ${
                    expired
                      ? "bg-destructive/10 text-destructive"
                      : urgent
                        ? "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400"
                        : "bg-secondary text-primary"
                  }`}
                >
                  {c.full_name
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-primary truncate">{c.full_name}</div>
                  <div className="text-xs text-muted-foreground truncate mt-0.5">
                    {c.category}
                    {c.insurer ? ` · ${c.insurer}` : ""}
                    {c.policy_number ? ` · #${c.policy_number}` : ""}
                    {c.vehicle_number ? ` · ${c.vehicle_number}` : ""}
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1.5">
                  <div
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                      expired
                        ? "bg-destructive/10 text-destructive"
                        : urgent
                          ? "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400"
                          : "bg-secondary text-primary"
                    }`}
                  >
                    <Calendar className="size-3" />
                    {expired
                      ? `Expired ${-days}d ago`
                      : urgent
                        ? `${days}d left`
                        : new Date(c.expiry_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
                <a
                  href={`https://wa.me/${c.phone.replace(/\D/g, "")}?text=${encodeURIComponent(waMsg)}`}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  rel="noreferrer"
                  title={`WhatsApp ${c.phone}`}
                  className="size-9 grid place-items-center rounded-full bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition shrink-0"
                >
                  <MessageCircle className="size-4" />
                </a>
                <ChevronRight className="size-5 text-muted-foreground group-hover:text-accent transition" />
              </Link>
            );
          })}
        </div>
      )}

      {importOpen && <ImportDialog onClose={() => setImportOpen(false)} />}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: "primary" | "emerald" | "amber" | "destructive";
}) {
  const toneStyle = {
    primary: "bg-secondary text-primary",
    emerald: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400",
    amber: "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400",
    destructive: "bg-destructive/10 text-destructive",
  }[tone];
  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
      <div className={`size-11 rounded-xl grid place-items-center shrink-0 ${toneStyle}`}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-display text-primary leading-none">{value}</div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1 truncate">{label}</div>
      </div>
    </div>
  );
}

const CATEGORIES = ["Health", "Car", "Bike", "Commercial"] as const;

function ImportDialog({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ imported: number; skipped: number; failed: number; errors: string[] } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  function pickCategory(v: unknown): string {
    const s = String(v ?? "").trim();
    const m = CATEGORIES.find((c) => c.toLowerCase() === s.toLowerCase());
    return m ?? "Car";
  }

  function parseDate(v: unknown): string | null {
    if (v == null || v === "") return null;
    if (v instanceof Date) return v.toISOString().slice(0, 10);
    if (typeof v === "number") {
      // Excel serial date
      const ms = Math.round((v - 25569) * 86400 * 1000);
      const d = new Date(ms);
      if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    }
    const s = String(v).trim();
    // dd/mm/yyyy or dd-mm-yyyy
    const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (m) {
      const [, dd, mm, yy] = m;
      const yyyy = yy.length === 2 ? `20${yy}` : yy;
      return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    }
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    return null;
  }

  function getField(row: Record<string, unknown>, keys: string[]): unknown {
    const normalized: Record<string, unknown> = {};
    Object.keys(row).forEach((k) => {
      normalized[k.toLowerCase().replace(/[^a-z0-9]/g, "")] = row[k];
    });
    for (const k of keys) {
      const nk = k.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (normalized[nk] != null && normalized[nk] !== "") return normalized[nk];
    }
    return null;
  }

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const XLSX = await import("xlsx");
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array", cellDates: true });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

      // Existing policy numbers for dedupe
      const { data: existing } = await supabase.from("customers").select("policy_number");
      const existingSet = new Set(
        (existing ?? [])
          .map((r) => (r.policy_number ?? "").toString().trim().toLowerCase())
          .filter(Boolean),
      );

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id ?? null;

      let imported = 0,
        skipped = 0,
        failed = 0;
      const errors: string[] = [];
      const seenInBatch = new Set<string>();

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        try {
          const full_name = String(getField(row, ["full_name", "name", "customer"]) ?? "").trim();
          const phone = String(getField(row, ["phone", "mobile", "contact"]) ?? "").trim();
          const expiry_raw = getField(row, ["expiry_date", "expiry", "renewal_date", "valid_till"]);
          const expiry_date = parseDate(expiry_raw);
          if (!full_name || !phone || !expiry_date) {
            failed++;
            errors.push(`Row ${i + 2}: missing name, phone or expiry date`);
            continue;
          }
          const policy_number = String(getField(row, ["policy_number", "policy", "policy_no"]) ?? "").trim() || null;
          const dedupeKey = (policy_number ?? "").toLowerCase();
          if (dedupeKey && (existingSet.has(dedupeKey) || seenInBatch.has(dedupeKey))) {
            skipped++;
            continue;
          }
          const premium_raw = getField(row, ["premium_amount", "premium", "amount"]);
          const premium_amount =
            premium_raw === null || premium_raw === "" ? null : Number(String(premium_raw).replace(/[^\d.]/g, ""));
          const start_date = parseDate(getField(row, ["start_date", "issue_date"]));

          const payload = {
            full_name,
            phone,
            email: (String(getField(row, ["email"]) ?? "").trim() || null) as string | null,
            category: pickCategory(getField(row, ["category", "type"])),
            insurer: (String(getField(row, ["insurer", "company"]) ?? "").trim() || null) as string | null,
            policy_number,
            vehicle_number:
              (String(getField(row, ["vehicle_number", "vehicle", "reg_no"]) ?? "").trim().toUpperCase() || null) as
                | string
                | null,
            premium_amount: isNaN(premium_amount as number) ? null : premium_amount,
            start_date,
            expiry_date,
            notes: (String(getField(row, ["notes", "remarks"]) ?? "").trim() || null) as string | null,
            created_by: userId,
          };

          const { error: insErr } = await supabase.from("customers").insert(payload);
          if (insErr) {
            failed++;
            errors.push(`Row ${i + 2}: ${insErr.message}`);
          } else {
            imported++;
            if (dedupeKey) seenInBatch.add(dedupeKey);
          }
        } catch (err) {
          failed++;
          errors.push(`Row ${i + 2}: ${err instanceof Error ? err.message : "parse error"}`);
        }
      }

      setResult({ imported, skipped, failed, errors: errors.slice(0, 8) });
      qc.invalidateQueries({ queryKey: ["customers"] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read file");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4" onClick={onClose}>
      <div
        className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-elegant w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-primary">Import customers</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Upload an Excel (.xlsx, .xls) or CSV file. Duplicate policy numbers are skipped.
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-primary">
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-5 rounded-2xl border-2 border-dashed border-border p-6 text-center">
          <FileSpreadsheet className="size-8 mx-auto text-accent" />
          <p className="text-sm text-muted-foreground mt-2">
            Expected columns: full_name, phone, category, insurer, policy_number, vehicle_number, premium_amount,
            start_date, expiry_date, email, notes
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-emerald text-accent-foreground text-sm font-semibold shadow-emerald disabled:opacity-50"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <FileSpreadsheet className="size-4" />}
            {busy ? "Importing…" : "Choose file"}
          </button>
        </div>

        {error && (
          <div className="mt-4 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-xl px-3 py-2">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-4 grid gap-3">
            <div className="grid grid-cols-3 gap-2">
              <Stat tone="emerald" label="Imported" value={result.imported} />
              <Stat tone="amber" label="Skipped" value={result.skipped} />
              <Stat tone="destructive" label="Failed" value={result.failed} />
            </div>
            {result.errors.length > 0 && (
              <div className="text-xs bg-destructive/5 border border-destructive/20 rounded-xl p-3 text-destructive max-h-40 overflow-y-auto">
                {result.errors.map((e, i) => (
                  <div key={i}>· {e}</div>
                ))}
              </div>
            )}
            <button
              onClick={onClose}
              className="mt-1 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ tone, label, value }: { tone: "emerald" | "amber" | "destructive"; label: string; value: number }) {
  const t = {
    emerald: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400",
    amber: "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400",
    destructive: "bg-destructive/10 text-destructive",
  }[tone];
  return (
    <div className={`rounded-xl px-3 py-2 text-center ${t}`}>
      <div className="text-xl font-display">{value}</div>
      <div className="text-[10px] uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  );
}
