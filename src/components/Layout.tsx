import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Home, FileText, Calculator, MessageCircle, Shield, Upload } from "lucide-react";
import { AGENT } from "@/lib/agent";
import type { ReactNode } from "react";

const navItems = [
  { to: "/", label: "Home", labelKn: "ಮುಖ್ಯ", icon: Home },
  { to: "/quote", label: "Quote", labelKn: "ಕೋಟ್", icon: Calculator },
  { to: "/apply", label: "Apply", labelKn: "ಅರ್ಜಿ", icon: Upload },
  { to: "/contact", label: "Contact", labelKn: "ಸಂಪರ್ಕ", icon: MessageCircle },
] as const;

export function Layout({ children }: { children?: ReactNode }) {
  const { location } = useRouterState();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="size-9 rounded-xl gradient-gold grid place-items-center shadow-gold">
              <Shield className="size-5 text-accent-foreground" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg text-primary">{AGENT.company}</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                with {AGENT.name}
              </div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((it) => {
              const active = location.pathname === it.to;
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-primary hover:bg-secondary"
                  }`}
                >
                  {it.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 pb-24 md:pb-12">{children ?? <Outlet />}</main>

      {/* Footer (desktop) */}
      <footer className="hidden md:block bg-primary text-primary-foreground/80">
        <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col md:flex-row justify-between gap-6 text-sm">
          <div>
            <div className="font-display text-2xl text-primary-foreground">{AGENT.company}</div>
            <p className="mt-2 opacity-70">{AGENT.tagline}</p>
          </div>
          <div className="opacity-70">
            <div>Agent: {AGENT.name}</div>
            <div className="mt-1">Designed & built by {AGENT.designer}</div>
            <Link to="/auth" className="mt-2 inline-block text-[11px] uppercase tracking-wider opacity-60 hover:opacity-100">
              Advisor login
            </Link>
          </div>
        </div>
      </footer>

      {/* Bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border/50">
        <div className="grid grid-cols-4">
          {navItems.map((it) => {
            const active = location.pathname === it.to;
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex flex-col items-center justify-center py-2.5 gap-1 text-[11px] font-medium transition-colors ${
                  active ? "text-gold" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`size-9 grid place-items-center rounded-xl transition-all ${
                    active ? "gradient-gold shadow-gold text-accent-foreground" : ""
                  }`}
                >
                  <Icon className="size-[18px]" strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className="leading-tight text-center">
                  {it.label}
                  <span className="block text-[9px] opacity-70">{it.labelKn}</span>
                </span>
              </Link>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  );
}
