import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AGENT } from "@/lib/agent";
import { Shield, LayoutDashboard, UserPlus, LogOut, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { user } = Route.useRouteContext() as { user: { id: string; email?: string } };
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { location } = useRouterState();

  const ALLOWED_EMAIL = "nandanpernaje@gmail.com";
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["is-admin", user.id],
    queryFn: async () => {
      if ((user.email ?? "").toLowerCase() !== ALLOWED_EMAIL) return false;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="size-6 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-5 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-3xl text-primary">Not authorised</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This area is for {AGENT.shortName} only. Your account does not have admin access.
          </p>
          <button
            onClick={signOut}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { to: "/admin", label: "Customers", icon: LayoutDashboard, exact: true },
    { to: "/admin/new", label: "Add customer", icon: UserPlus, exact: false },
  ] as const;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl gradient-emerald grid place-items-center shadow-emerald">
              <Shield className="size-5 text-accent-foreground" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-display text-base text-primary">Advisor Dashboard</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {user.email}
              </div>
            </div>
          </Link>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary transition"
          >
            <LogOut className="size-3.5" /> Sign out
          </button>
        </div>
        <nav className="max-w-6xl mx-auto px-5 flex gap-1">
          {tabs.map((t) => {
            const active = t.exact
              ? location.pathname === t.to
              : location.pathname.startsWith(t.to);
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition ${
                  active
                    ? "border-accent text-primary"
                    : "border-transparent text-muted-foreground hover:text-primary"
                }`}
              >
                <Icon className="size-4" /> {t.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-5 py-8">
        <Outlet />
      </main>
    </div>
  );
}
