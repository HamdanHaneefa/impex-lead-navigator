import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Cpu, Hand, MonitorPlay, ShieldCheck, Sparkles, Star } from "lucide-react";
import { LeadSurvey } from "@/components/LeadSurvey";
import { Toaster } from "@/components/ui/sonner";
import heroImage from "@/assets/ifpd-hero.jpg";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "IMPEX xSeries — AI Interactive Display | Free Demo & Quote" },
      {
        name: "description",
        content:
          "Get a free demo & instant quote for the IMPEX xSeries AI Interactive Flat Panel Display. 4K Ultra HD, 20/40-pt touch, EDLA-certified Android 14. Schools, offices & training rooms across India.",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0d0610" },
      { property: "og:title", content: "IMPEX xSeries — Free Demo & Quote" },
      {
        property: "og:description",
        content: "AI Interactive Displays built for classrooms and boardrooms. Request your free demo in 30 seconds.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
});

function LandingPage() {
  return (
    <main className="min-h-screen brand-glow-bg">
      <Toaster theme="dark" position="top-center" richColors />

      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight">
              <span className="text-primary">IMPEX</span>
              <span className="ml-1.5 text-sm font-medium text-white/60">xSeries</span>
            </span>
          </div>
          <a
            href="tel:+919000000000"
            className="hidden text-sm font-medium text-white/70 hover:text-white sm:inline"
          >
            Call sales ↗
          </a>
        </div>
      </header>

      {/* Hero + survey */}
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 sm:pt-10 lg:grid lg:grid-cols-2 lg:gap-12 lg:pb-20 lg:pt-16">
        {/* Left: pitch */}
        <div className="mb-8 lg:mb-0">
          <span className="chip">
            <Sparkles className="size-3 text-primary" /> New · xSeries 2026
          </span>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem]">
            AI Interactive Display{" "}
            <span className="block bg-gradient-to-r from-primary via-pink-400 to-primary bg-clip-text text-transparent">
              built for what&apos;s next.
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            4K Ultra HD clarity, AI whiteboarding and EDLA-certified Google Workspace —
            engineered for modern classrooms and boardrooms.
          </p>

          {/* Mobile-only image */}
          <div className="relative mt-7 overflow-hidden rounded-2xl border border-white/10 lg:hidden">
            <img
              src={heroImage}
              alt="IMPEX xSeries Interactive Display in a modern boardroom"
              width={1280}
              height={960}
              className="h-auto w-full object-cover"
              fetchPriority="high"
            />
          </div>

          {/* Trust chips */}
          <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <Feature icon={<MonitorPlay className="size-4" />} label="4K Ultra HD" />
            <Feature icon={<Hand className="size-4" />} label="40-pt Touch" />
            <Feature icon={<Cpu className="size-4" />} label="Android 14" />
            <Feature icon={<ShieldCheck className="size-4" />} label="EDLA Certified" />
          </ul>

          {/* Social proof */}
          <div className="mt-8 hidden items-center gap-4 lg:flex">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="size-8 rounded-full border-2 border-background bg-gradient-to-br from-primary/60 to-pink-600/60"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5 text-primary">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
                <span className="ml-2 text-xs font-semibold text-white">4.9 / 5</span>
              </div>
              <p className="text-xs text-white/60">Trusted by 1,200+ schools & enterprises in India</p>
            </div>
          </div>

          {/* Desktop hero image */}
          <div className="relative mt-10 hidden overflow-hidden rounded-2xl border border-white/10 lg:block">
            <img
              src={heroImage}
              alt="IMPEX xSeries Interactive Display"
              width={1280}
              height={960}
              className="h-auto w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Right: survey */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <LeadSurvey />
        </div>
      </section>

      {/* Benefits strip */}
      <section className="border-t border-white/5 bg-background/60">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 sm:py-14">
          <Benefit
            title="Free on-site demo"
            desc="Our engineers visit your campus or office to set up a live demo at your convenience."
          />
          <Benefit
            title="Pan-India installation"
            desc="Delivery, mounting and training included — across 400+ cities."
          />
          <Benefit
            title="3-year warranty"
            desc="Comprehensive on-site warranty with same-day response in major metros."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} IMPEX Appliances · xSeries AI Interactive Displays
      </footer>
    </main>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm">
      <span className="text-primary">{icon}</span>
      <span className="font-medium text-white/85">{label}</span>
    </li>
  );
}

function Benefit({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-primary">
        <CheckCircle2 className="size-5" />
        <span className="text-sm font-semibold uppercase tracking-wider text-white">{title}</span>
      </div>
      <p className="text-sm leading-relaxed text-white/65">{desc}</p>
    </div>
  );
}
