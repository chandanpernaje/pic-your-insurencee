import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useMemo, useState } from "react";
import { ArrowRight, Calculator as CalcIcon } from "lucide-react";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Premium Calculator — Pic Your Insurance" },
      {
        name: "description",
        content:
          "Estimate your insurance premium instantly with our interactive calculator.",
      },
      { property: "og:title", content: "Premium Calculator" },
      {
        property: "og:description",
        content: "Estimate your insurance premium in seconds.",
      },
    ],
  }),
  component: CalculatorPage,
});

const types = [
  { key: "Health", kn: "ಆರೋಗ್ಯ", base: 0.0085 },
  { key: "Vehicle", kn: "ವಾಹನ", base: 0.012 },
] as const;

function CalculatorPage() {
  const [age, setAge] = useState(32);
  const [coverage, setCoverage] = useState(10_00_000); // 10 lakh
  const [type, setType] = useState<(typeof types)[number]["key"]>("Health");

  const { low, high } = useMemo(() => {
    const conf = types.find((t) => t.key === type)!;
    const ageFactor = 1 + Math.max(0, age - 25) * 0.025;
    const base = coverage * conf.base * ageFactor;
    return { low: Math.round(base * 0.85), high: Math.round(base * 1.2) };
  }, [age, coverage, type]);

  return (
    <Layout>
      <section className="gradient-hero text-primary-foreground">
        <div className="max-w-4xl mx-auto px-5 py-14 md:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-glow font-semibold">
            Premium calculator · ಪ್ರೀಮಿಯಂ ಲೆಕ್ಕಾಚಾರ
          </p>
          <h1 className="mt-2 font-display text-4xl md:text-6xl">
            Estimate your premium in seconds.
          </h1>
          <p className="mt-1 font-display text-2xl md:text-3xl text-accent-glow">
            ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಪ್ರೀಮಿಯಂ ಅಂದಾಜು ಮಾಡಿ.
          </p>
          <p className="mt-3 text-primary-foreground/75 max-w-lg">
            A quick indicative range based on age and coverage. For exact
            pricing across insurers, request a personalised quote.
          </p>
          <p className="mt-2 text-primary-foreground/60 text-sm max-w-lg">
            ವಯಸ್ಸು ಮತ್ತು ಕವರೇಜ್ ಆಧಾರಿತ ಸೂಚಕ ಶ್ರೇಣಿ.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 -mt-10 md:-mt-14 pb-16">
        <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-elegant grid gap-8">
          {/* type */}
          <div>
            <label className="block text-sm font-medium text-primary mb-3">
              Insurance type · ವಿಮಾ ಪ್ರಕಾರ
            </label>
            <div className="grid grid-cols-2 gap-2">
              {types.map((t) => {
                const active = type === t.key;
                return (
                  <button
                    type="button"
                    key={t.key}
                    onClick={() => setType(t.key)}
                    className={`py-3 rounded-2xl text-sm font-medium border transition-all ${
                      active
                        ? "border-accent gradient-emerald text-accent-foreground shadow-emerald"
                        : "border-border bg-background hover:border-accent/50"
                    }`}
                  >
                    {t.key} · {t.kn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* age */}
          <Slider
            label="Your age · ವಯಸ್ಸು"
            value={age}
            min={18}
            max={70}
            step={1}
            display={`${age} yrs`}
            onChange={setAge}
          />


          {/* coverage */}
          <Slider
            label="Coverage amount · ಕವರೇಜ್ ಮೊತ್ತ"
            value={coverage}
            min={1_00_000}
            max={2_00_00_000}
            step={50_000}
            display={formatINR(coverage)}
            onChange={setCoverage}
          />

          {/* result */}
          <div className="rounded-3xl gradient-hero text-primary-foreground p-7 md:p-9 text-center">
            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-accent-glow font-semibold">
              <CalcIcon className="size-3.5" /> Estimated annual premium · ವಾರ್ಷಿಕ ಪ್ರೀಮಿಯಂ
            </div>
            <div className="mt-3 font-display text-4xl md:text-6xl">
              {formatINR(low)} <span className="opacity-60 text-2xl md:text-3xl">—</span>{" "}
              {formatINR(high)}
            </div>
            <p className="mt-3 text-primary-foreground/70 text-sm max-w-md mx-auto">
              Indicative range · ಸೂಚಕ ಶ್ರೇಣಿ. Final premium depends on insurer, riders and
              medical/vehicle profile.
            </p>
            <Link
              to="/quote"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-emerald text-accent-foreground font-semibold shadow-emerald hover:translate-y-[-1px] transition"
            >
              Get exact quote · ನಿಖರ ಕೋಟ್ <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex justify-between items-baseline mb-3">
        <label className="text-sm font-medium text-primary">{label}</label>
        <span className="font-display text-2xl text-accent">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="custom-range w-full"
        style={{
          background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${pct}%, var(--color-secondary) ${pct}%, var(--color-secondary) 100%)`,
        }}
      />
      <style>{`
        .custom-range {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 999px;
          outline: none;
        }
        .custom-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 999px;
          background: var(--color-primary);
          border: 3px solid var(--color-accent);
          cursor: pointer;
          box-shadow: 0 4px 14px -3px color-mix(in oklab, var(--color-accent) 60%, transparent);
        }
        .custom-range::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 999px;
          background: var(--color-primary);
          border: 3px solid var(--color-accent);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

function formatINR(n: number) {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}
