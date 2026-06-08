import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { AGENT, whatsappLink } from "@/lib/agent";
import {
  Activity,
  Car,
  Bike,
  Truck,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/policies")({
  head: () => ({
    meta: [
      { title: "Compare Policies — Pic Your Insurance" },
      {
        name: "description",
        content:
          "Compare health, car, bike and commercial vehicle policies on InsuranceDekho and PolicyBazaar — then message Nandan on WhatsApp to buy at the best price.",
      },
      { property: "og:title", content: "Compare Policies — Pic Your Insurance" },
      {
        property: "og:description",
        content:
          "Compare policies on InsuranceDekho & PolicyBazaar. Buy via your IRDAI-certified advisor.",
      },
    ],
  }),
  component: PoliciesPage,
});

type CatKey = keyof typeof AGENT.compareLinks;

const categories: {
  key: CatKey;
  title: string;
  titleKn: string;
  desc: string;
  descKn: string;
  Icon: typeof Activity;
}[] = [
  {
    key: "health",
    title: "Health Insurance",
    titleKn: "ಆರೋಗ್ಯ ವಿಮೆ",
    desc: "Family floater, individual & critical illness covers.",
    descKn: "ಕುಟುಂಬ ಫ್ಲೋಟರ್, ವೈಯಕ್ತಿಕ ಮತ್ತು ಗಂಭೀರ ಕಾಯಿಲೆ ಯೋಜನೆಗಳು.",
    Icon: Activity,
  },
  {
    key: "car",
    title: "Car Insurance",
    titleKn: "ಕಾರು ವಿಮೆ",
    desc: "Comprehensive, third-party & zero-dep add-ons.",
    descKn: "ಸಮಗ್ರ, ಥರ್ಡ್ ಪಾರ್ಟಿ ಮತ್ತು ಶೂನ್ಯ ಸವಕಳಿ ಆಡ್-ಆನ್‌ಗಳು.",
    Icon: Car,
  },
  {
    key: "bike",
    title: "Bike Insurance",
    titleKn: "ಬೈಕ್ ವಿಮೆ",
    desc: "Two-wheeler new policy & quick renewal.",
    descKn: "ದ್ವಿಚಕ್ರ ಹೊಸ ಪಾಲಿಸಿ ಮತ್ತು ತ್ವರಿತ ನವೀಕರಣ.",
    Icon: Bike,
  },
  {
    key: "commercial",
    title: "Bus / Auto / Commercial",
    titleKn: "ಬಸ್ / ಆಟೋ / ವಾಣಿಜ್ಯ",
    desc: "Commercial vehicle, passenger & goods carrier cover.",
    descKn: "ವಾಣಿಜ್ಯ ವಾಹನ, ಪ್ರಯಾಣಿಕ ಮತ್ತು ಸರಕು ಸಾಗಣೆ ರಕ್ಷಣೆ.",
    Icon: Truck,
  },
];

function PoliciesPage() {
  return (
    <Layout>
      <section className="gradient-hero text-primary-foreground">
        <div className="max-w-5xl mx-auto px-5 py-12 md:py-16">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-glow font-semibold">
            Compare & choose · ಹೋಲಿಸಿ ಆಯ್ಕೆ ಮಾಡಿ
          </p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">
            Compare policies, then buy through your advisor.
          </h1>
          <p className="mt-2 font-display text-xl md:text-2xl text-accent-glow">
            ಪಾಲಿಸಿ ಹೋಲಿಸಿ, ನಂತರ ಸಲಹೆಗಾರರ ಮೂಲಕ ಖರೀದಿಸಿ.
          </p>
          <p className="mt-4 text-primary-foreground/75 max-w-2xl text-sm md:text-base">
            {AGENT.name} works through{" "}
            <strong className="text-primary-foreground">InsuranceDekho</strong>{" "}
            and <strong className="text-primary-foreground">PolicyBazaar</strong>.
            Use the links below to compare plans yourself — then message Nandan
            on WhatsApp. As your IRDAI-certified broker he will send you the
            secure payment link directly.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 py-10 grid gap-4">
        {categories.map(({ key, title, titleKn, desc, descKn, Icon }) => {
          const links = AGENT.compareLinks[key];
          return (
            <div
              key={key}
              className="bg-card border border-border rounded-3xl p-5 md:p-7 hover:shadow-elegant transition-all"
            >
              <div className="grid sm:grid-cols-2 gap-3">
                <PortalLink
                  href={links.insuranceDekho}
                  label="Compare on InsuranceDekho"
                  title={title}
                  titleKn={titleKn}
                  desc={desc}
                  descKn={descKn}
                  Icon={Icon}
                />
                <PortalLink
                  href={links.policyBazaar}
                  label="Compare on PolicyBazaar"
                  title={title}
                  titleKn={titleKn}
                  desc={desc}
                  descKn={descKn}
                  Icon={Icon}
                />
              </div>

              <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-accent" />
                  Found a plan you like? Nandan will send the secure payment link.
                </p>
                <a
                  href={whatsappLink(
                    `Hi ${AGENT.name}, I'd like to buy a ${title} policy. Please share details and the payment link.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-emerald text-accent-foreground text-sm font-semibold shadow-emerald hover:translate-y-[-1px] transition"
                >
                  <MessageCircle className="size-4" /> Message Nandan
                </a>
              </div>
            </div>
          );
        })}

        <p className="text-center text-xs text-muted-foreground mt-2">
          InsuranceDekho and PolicyBazaar are independent comparison portals.
          Nandan operates as a Point of Sales Person via Girnar Insurance
          Brokers (InsuranceDekho) · IRDAI Lic. {AGENT.credentials.irdaiLicense}.
        </p>
      </section>
    </Layout>
  );
}

function PortalLink({
  href,
  label,
  title,
  titleKn,
  desc,
  descKn,
  Icon,
}: {
  href: string;
  label: string;
  title: string;
  titleKn: string;
  desc: string;
  descKn: string;
  Icon: typeof Activity;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="group flex flex-col gap-4 p-5 rounded-2xl border border-border bg-background hover:border-accent hover:bg-accent/5 transition"
    >
      <div className="flex items-start gap-3">
        <div className="size-11 rounded-2xl gradient-emerald grid place-items-center shadow-emerald shrink-0">
          <Icon className="size-5 text-accent-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-lg text-primary leading-tight">{title}</div>
          <div className="text-xs text-accent">{titleKn}</div>
          <p className="text-xs text-muted-foreground mt-1.5 leading-snug">{desc}</p>
          <p className="text-[11px] text-muted-foreground/80 mt-0.5 leading-snug">{descKn}</p>
        </div>
      </div>
      <span className="inline-flex items-center justify-between gap-2 text-sm font-medium text-primary pt-3 border-t border-border/60 group-hover:text-accent">
        {label}
        <ExternalLink className="size-4 text-muted-foreground group-hover:text-accent" />
      </span>
    </a>
  );
}
