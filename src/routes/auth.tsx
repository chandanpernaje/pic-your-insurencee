import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AGENT } from "@/lib/agent";
import { Shield, LogIn, UserPlus, Loader2 } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — Pic Your Insurance" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Min 8 characters").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already signed in, bounce to dashboard
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
      }
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/50">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl gradient-gold grid place-items-center shadow-gold">
              <Shield className="size-5 text-accent-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg text-primary">{AGENT.company}</span>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to site
          </Link>
        </div>
      </header>

      <main className="flex-1 grid place-items-center px-5 py-12">
        <div className="w-full max-w-md">
          <h1 className="font-display text-3xl text-primary text-center">
            Advisor dashboard
          </h1>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Private area for {AGENT.shortName} only.
          </p>

          <div className="mt-8 bg-card border border-border rounded-3xl p-6 md:p-8 shadow-elegant">
            <div className="flex gap-1 p-1 bg-secondary rounded-full mb-6">
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                    mode === m
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {m === "login" ? "Sign in" : "Create admin"}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="grid gap-4">
              <label className="block">
                <span className="block text-sm font-medium text-primary mb-1.5">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-gold focus:ring-4 focus:ring-gold/15 outline-none transition"
                  required
                />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-primary mb-1.5">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-gold focus:ring-4 focus:ring-gold/15 outline-none transition"
                  required
                  minLength={8}
                />
              </label>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-xl px-3 py-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex items-center justify-center gap-2 py-3.5 rounded-full gradient-gold text-accent-foreground font-semibold shadow-gold disabled:opacity-50 transition-all hover:translate-y-[-1px]"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : mode === "login" ? (
                  <LogIn className="size-4" />
                ) : (
                  <UserPlus className="size-4" />
                )}
                {mode === "login" ? "Sign in" : "Create admin account"}
              </button>

              {mode === "signup" && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  The first account created becomes the admin automatically.
                </p>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
