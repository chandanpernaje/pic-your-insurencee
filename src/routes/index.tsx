import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { AGENT, whatsappLink } from "@/lib/agent";
import {
  ArrowRight,
  Activity,
  Car,
  Shield,
  CheckCircle2,
  Phone,
  Sparkles,
  Star,
} from "lucide-react";

export const Route = createFileRoute("/")(  {
  head: () => ({
    meta: [
      { title: "Pic Your Insurance — Nandan Pernaje · IRDAI-certified POSP advisor" },
      {
        name: "description",
        content:
          "IRDAI-certified Point of Sales Person Nandan Pernaje (POS 582239) helps you pick bike, car, bus, auto & health insurance online — from every major insurer, at the lowest price.",
      },
      { property: "og:title", content: "Pic Your Insurance — Nandan Pernaje" },
      {
        property: "og:description",
        content: "IRDAI-certified online insurance advisor in Dakshina Kannada. WhatsApp +91 82773 40643.",
      },
    ],
  }),
  component: Home,
});

const products = [
  {
    icon: Activity,
    title: "Health Insurance",
    titleKn: "ಆರೋಗ್ಯ ವಿಮೆ",
    desc: "Family floater & critical illness covers.",
    descKn: "ಕುಟುಂಬ ಫ್ಲೋಟರ್ ಮತ್ತು ಗಂಭೀರ ಕಾಯಿಲೆ ಯೋಜನೆಗಳು.",
  },
  {
    icon: Car,
    title: "Vehicle Insurance",
    titleKn: "ವಾಹನ ವಿಮೆ",
    desc: "Bike, Car, Bus & Auto — commercial and private vehicles.",
    descKn: "ಬೈಕ್, ಕಾರು, ಬಸ್ ಮತ್ತು ಆಟೋ — ವಾಣಿಜ್ಯ ಮತ್ತು ಖಾಸಗಿ ವಾಹನಗಳಿಗೆ.",
  },
];

const stats = [
  { value: "100+", label: "Insurances done successfully", labelKn: "ಯಶಸ್ವಿಯಾಗಿ ಮಾಡಿದ ವಿಮೆಗಳು" },
  { value: "98%", label: "Claim assistance", labelKn: "ಕ್ಲೈಮ್ ಸಹಾಯ" },
  { value: "24/7", label: "WhatsApp support", labelKn: "WhatsApp ಬೆಂಬಲ" },
];

function Home() {
  return (
    <Layout>
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden gradient-hero text-primary-foreground">
        {/* Decorative orbs */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 30%, rgba(200,160,60,0.25), transparent 40%), radial-gradient(circle at 85% 50%, rgba(120,80,200,0.3), transparent 45%), radial-gradient(circle at 50% 80%, rgba(200,160,60,0.15), transparent 35%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-5 pt-12 pb-8 md:py-28">
          <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium">
                <Shield className="size-3.5 text-accent-glow" />
                IRDAI-certified POSP · POS {AGENT.credentials.posCode} · Available on WhatsApp
              </div>

              <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[1.05] max-w-3xl">
                Online insurance, <em className="text-accent-glow not-italic">picked</em> just for you.
              </h1>
              <p className="mt-3 font-display text-2xl md:text-3xl text-accent-glow/90 max-w-3xl">
                ನಿಮಗಾಗಿ ಆಯ್ಕೆ ಮಾಡಿದ ಆನ್‌ಲೈನ್ ವಿಮೆ.
              </p>

              <p className="mt-5 max-w-xl text-base md:text-lg text-primary-foreground/75">
                {AGENT.name} is a part-time online insurance advisor. Send your
                details on WhatsApp and get bike, car, bus or auto cover from any
                company — at the lowest price, fully online.
              </p>
              <p className="mt-2 max-w-xl text-sm md:text-base text-primary-foreground/60">
                {AGENT.name} ಒಬ್ಬ ಪಾರ್ಟ್-ಟೈಮ್ ಆನ್‌ಲೈನ್ ವಿಮಾ ಸಲಹೆಗಾರ. WhatsApp ಮೂಲಕ ವಿವರ ಕಳುಹಿಸಿ — ಎಲ್ಲಾ ಕಂಪನಿಗಳ ವಿಮೆ ಕಡಿಮೆ ಬೆಲೆಯಲ್ಲಿ.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/quote"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full gradient-gold text-accent-foreground font-semibold shadow-gold hover:translate-y-[-1px] hover:shadow-lg transition-all"
                >
                  Get a free quote · ಉಚಿತ ಕೋಟ್ <ArrowRight className="size-4" />
                </Link>
                <a
                  href={whatsappLink(`Hi ${AGENT.name}, I'd like to know more about insurance options.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/25 hover:bg-white/10 font-medium transition-all"
                >
                  <Phone className="size-4" /> WhatsApp ನಲ್ಲಿ ಮಾತನಾಡಿ
                </a>
              </div>
            </div>

            {/* Hero image */}
            <div className="relative hidden md:block">
              <div className="absolute -inset-6 bg-gradient-to-br from-gold/20 via-transparent to-purple-500/20 blur-3xl rounded-full animate-[pulse-glow_4s_ease-in-out_infinite]" />
              <img
                src="/hero-insurance.png"
                alt="Insurance shield protecting vehicles — car, bike, bus and auto"
                className="relative w-full max-w-md mx-auto drop-shadow-2xl animate-[float_6s_ease-in-out_infinite]"
              />
            </div>
          </div>

          {/* Stats */}
          <dl className="mt-14 grid grid-cols-3 gap-4 max-w-xl">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-3xl md:text-4xl text-accent-glow">{s.value}</dt>
                <dd className="text-xs md:text-sm text-primary-foreground/70 mt-1">{s.label}</dd>
                <dd className="text-[11px] md:text-xs text-primary-foreground/50">{s.labelKn}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ═══ PRODUCTS ═══ */}
      <section className="max-w-6xl mx-auto px-5 py-20 md:py-28">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold flex items-center gap-1.5">
              <Sparkles className="size-3.5" />
              What we cover · ನಾವು ಒದಗಿಸುವುದು
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-primary mt-2">
              Two covers. Done right.
            </h2>
            <p className="font-display text-xl md:text-2xl text-muted-foreground mt-1">
              ಎರಡು ರಕ್ಷಣೆಗಳು. ಸರಿಯಾಗಿ ಮಾಡಲಾಗಿದೆ.
            </p>
          </div>
          <Link
            to="/calculator"
            className="text-sm font-medium text-primary hover:text-gold inline-flex items-center gap-1 transition-colors"
          >
            Try the premium calculator <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {products.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="group p-7 rounded-3xl bg-card border border-border hover:border-gold/40 hover:shadow-gold transition-all duration-300"
              >
                <div className="size-12 rounded-2xl gradient-gold grid place-items-center shadow-gold mb-5">
                  <Icon className="size-6 text-accent-foreground" />
                </div>
                <h3 className="font-display text-2xl text-primary">{p.title}</h3>
                <p className="font-display text-lg text-gold mt-0.5">{p.titleKn}</p>
                <p className="text-sm text-muted-foreground mt-3">{p.desc}</p>
                <p className="text-sm text-muted-foreground/80 mt-1">{p.descKn}</p>
                <Link
                  to="/quote"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-gold group-hover:gap-2 transition-all"
                >
                  Get a quote · ಕೋಟ್ ಪಡೆಯಿರಿ <ArrowRight className="size-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ SERVICES STRIP ═══ */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-5 py-16 md:py-24 grid md:grid-cols-[1fr_1fr] gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent-glow font-semibold flex items-center gap-1.5">
              <Star className="size-3.5" />
              Our services · ನಮ್ಮ ಸೇವೆಗಳು
            </p>
            <h2 className="font-display text-3xl md:text-5xl mt-2">
              At the lowest price.
            </h2>
            <p className="font-display text-xl md:text-2xl text-accent-glow mt-1">
              ಅತ್ಯಂತ ಕಡಿಮೆ ಬೆಲೆಯಲ್ಲಿ.
            </p>
            <p className="mt-4 text-primary-foreground/75 max-w-md">
              For all commercial and private vehicles — {AGENT.vehicleTypes.join(", ")}.
              Available across every major insurer.
            </p>

            {/* Vehicle fleet image */}
            <div className="mt-8 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-gold/15 to-transparent blur-2xl rounded-full" />
              <img
                src="/vehicle-fleet.png"
                alt="Fleet of vehicles — car, bike, bus and auto covered by insurance"
                className="relative w-full max-w-sm rounded-2xl"
              />
            </div>
          </div>

          <ul className="grid grid-cols-2 gap-3">
            {AGENT.services.map((s, i) => (
              <li
                key={s}
                className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-4 hover:bg-white/10 hover:border-gold/30 transition-all duration-300"
              >
                <div className="flex items-center gap-2 text-accent-glow">
                  <CheckCircle2 className="size-4" />
                  <span className="font-semibold text-sm">{s}</span>
                </div>
                <div className="text-xs text-primary-foreground/60 mt-1">
                  {AGENT.servicesKn[i]}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ CREDENTIALS ═══ */}
      <section className="max-w-6xl mx-auto px-5 py-20 md:py-28">
        <div className="rounded-3xl border border-border bg-card p-8 md:p-12 shadow-elegant hover:shadow-purple transition-shadow duration-500">
          <div className="flex items-start justify-between flex-wrap gap-8">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
                Credentials · ಪ್ರಮಾಣಪತ್ರಗಳು
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-primary mt-2">
                IRDAI-certified. Verifiable.
              </h2>
              <p className="font-display text-lg md:text-xl text-muted-foreground mt-1">
                IRDAI ಪ್ರಮಾಣೀಕೃತ. ಪರಿಶೀಲಿಸಬಹುದಾದ.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                {AGENT.shortName} is an authorised {AGENT.credentials.role} working
                through {AGENT.credentials.broker} — an IRDAI-licensed direct
                broker for both Life and General insurance.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm min-w-[260px]">
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">POS Code</dt>
                <dd className="font-display text-lg text-primary">{AGENT.credentials.posCode}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">IRDAI Licence</dt>
                <dd className="font-display text-lg text-primary">No. {AGENT.credentials.irdaiLicense}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Category</dt>
                <dd className="text-foreground">{AGENT.credentials.category}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Broker</dt>
                <dd className="text-foreground">InsuranceDekho</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Based in</dt>
                <dd className="text-foreground">{AGENT.location} · PIN {AGENT.pin}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ═══ TRUST ═══ */}
      <section className="bg-secondary/60">
        <div className="max-w-6xl mx-auto px-5 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
              Why clients stay · ಗ್ರಾಹಕರು ಏಕೆ ಉಳಿಯುತ್ತಾರೆ
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-primary mt-2">
              An advisor, not a salesperson.
            </h2>
            <p className="font-display text-xl md:text-2xl text-muted-foreground mt-1">
              ಸಲಹೆಗಾರ, ಮಾರಾಟಗಾರ ಅಲ್ಲ.
            </p>
            <p className="mt-4 text-muted-foreground">
              {AGENT.name} works for you — not for any single insurer. Every
              recommendation is unbiased, every policy is tracked, and renewals
              never sneak up on you.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                { en: "Unbiased comparison across 20+ insurers", kn: "20+ ವಿಮಾ ಕಂಪನಿಗಳ ನಡುವೆ ನಿಷ್ಪಕ್ಷ ಹೋಲಿಕೆ" },
                { en: "Renewal reminders 30 days in advance", kn: "30 ದಿನ ಮೊದಲೇ ನವೀಕರಣ ಜ್ಞಾಪನೆ" },
                { en: "End-to-end claim assistance", kn: "ಪೂರ್ಣ ಕ್ಲೈಮ್ ಸಹಾಯ" },
                { en: "Digital policy vault, accessible 24/7", kn: "24/7 ಲಭ್ಯವಿರುವ ಡಿಜಿಟಲ್ ಪಾಲಿಸಿ ವಾಲ್ಟ್" },
              ].map((t) => (
                <li key={t.en} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="size-5 text-gold shrink-0 mt-0.5" />
                  <span className="text-foreground">
                    {t.en}
                    <span className="block text-muted-foreground text-xs mt-0.5">{t.kn}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 gradient-gold opacity-15 blur-3xl rounded-full" />
            <div className="relative bg-card border border-border rounded-3xl p-8 shadow-elegant">
              <div className="flex items-center gap-3">
                <div className="size-14 rounded-2xl gradient-hero grid place-items-center text-primary-foreground font-display text-2xl">
                  {AGENT.initials}
                </div>
                <div>
                  <div className="font-display text-xl text-primary">{AGENT.shortName}</div>
                  <div className="text-xs text-muted-foreground">
                    POSP · {AGENT.company}
                  </div>
                </div>
              </div>
              <blockquote className="mt-6 font-display text-2xl text-primary leading-snug">
                "Insurance is a promise. My job is to make sure it gets kept —
                on the day you actually need it."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="max-w-6xl mx-auto px-5 py-20 md:py-28">
        <div className="rounded-3xl gradient-hero text-primary-foreground p-10 md:p-16 text-center shadow-elegant relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/15 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/15 blur-[80px] rounded-full" />

          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl max-w-2xl mx-auto">
              Ready to pick the right insurance?
            </h2>
            <p className="font-display text-xl md:text-2xl text-accent-glow mt-2">
              ಸರಿಯಾದ ವಿಮೆ ಆರಿಸಲು ಸಿದ್ಧವೇ?
            </p>
            <p className="mt-4 text-primary-foreground/75 max-w-lg mx-auto">
              Share a few details and {AGENT.name} will get back to you within
              the hour with tailored options.
            </p>
            <Link
              to="/quote"
              className="mt-8 inline-flex items-center gap-2 px-7 py-4 rounded-full gradient-gold text-accent-foreground font-semibold shadow-gold hover:translate-y-[-1px] hover:shadow-lg transition-all"
            >
              Start your free quote · ಪ್ರಾರಂಭಿಸಿ <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

    </Layout>
  );
}
