import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { AGENT, whatsappLink } from "@/lib/agent";
import { ExternalLink, MessageCircle, Phone, Upload } from "lucide-react";

export const Route = createFileRoute("/quote")({
  head: () => ({
    meta: [
      { title: "Get a Free Quote — Pic Your Insurance" },
      {
        name: "description",
        content:
          "Compare insurance quotes on InsuranceDekho or PolicyBazaar, or message Nandan Pernaje directly on WhatsApp for a personalised recommendation.",
      },
      { property: "og:title", content: "Get a Free Quote — Pic Your Insurance" },
      {
        property: "og:description",
        content: "Compare policies and message Nandan Pernaje on WhatsApp.",
      },
    ],
  }),
  component: QuotePage,
});

function QuotePage() {
  return (
    <Layout>
      <section className="gradient-hero text-primary-foreground">
        <div className="max-w-4xl mx-auto px-5 py-14 md:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-glow font-semibold">
            Free consultation · ಉಚಿತ ಸಲಹೆ
          </p>
          <h1 className="mt-2 font-display text-4xl md:text-6xl">Get a free quote.</h1>
          <p className="mt-1 font-display text-2xl md:text-3xl text-accent-glow">
            ಉಚಿತ ಕೋಟ್ ಪಡೆಯಿರಿ.
          </p>
          <p className="mt-3 text-primary-foreground/75 max-w-xl">
            Compare policies on the partner portals {AGENT.name} uses, or
            message him directly on WhatsApp for a tailored recommendation.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 -mt-10 md:-mt-14 pb-16 grid gap-5">
        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-elegant">
          <h3 className="font-display text-xl md:text-2xl text-primary">
            Compare yourself
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {AGENT.name} sources policies via these official partner portals.
            Open one and explore quotes — then share the policy you like with
            him for the best deal.
          </p>
          <div className="grid md:grid-cols-2 gap-3 mt-5">
            <a
              href={AGENT.portals.insuranceDekho}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center justify-between gap-2 px-4 py-4 rounded-2xl border border-border bg-background hover:border-accent hover:bg-accent/5 transition text-sm font-medium text-primary"
            >
              <span>Open InsuranceDekho</span>
              <ExternalLink className="size-4 text-muted-foreground" />
            </a>
            <a
              href={AGENT.portals.policyBazaar}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center justify-between gap-2 px-4 py-4 rounded-2xl border border-border bg-background hover:border-accent hover:bg-accent/5 transition text-sm font-medium text-primary"
            >
              <span>Open PolicyBazaar</span>
              <ExternalLink className="size-4 text-muted-foreground" />
            </a>
          </div>
          <Link
            to="/policies"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:gap-2 transition-all"
          >
            See category-wise links →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-card border border-border rounded-3xl p-6 flex flex-col">
            <h3 className="font-display text-lg text-primary">
              Talk to {AGENT.shortName}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 flex-1">
              Get a personalised recommendation and the lowest available price.
            </p>
            <div className="mt-4 grid gap-2">
              <a
                href={whatsappLink(
                  `Hi ${AGENT.name}, I'd like a free quote. Please help me pick the right policy.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 py-3 rounded-full gradient-emerald text-accent-foreground font-semibold shadow-emerald hover:translate-y-[-1px] transition"
              >
                <MessageCircle className="size-4" /> WhatsApp Nandan
              </a>
              <a
                href={`tel:+${AGENT.phone}`}
                className="inline-flex items-center justify-center gap-2 py-3 rounded-full border border-border bg-background hover:border-accent text-sm font-medium text-primary transition"
              >
                <Phone className="size-4" /> Call {AGENT.phoneDisplay}
              </a>
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-6 flex flex-col">
            <h3 className="font-display text-lg text-primary">
              Ready with KYC documents?
            </h3>
            <p className="text-sm text-muted-foreground mt-1 flex-1">
              Send Aadhaar, PAN, RC and old policy in one go and Nandan will
              share the payment link.
            </p>
            <Link
              to="/apply"
              className="mt-4 inline-flex items-center justify-center gap-2 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary-glow transition"
            >
              <Upload className="size-4" /> Apply with documents
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
