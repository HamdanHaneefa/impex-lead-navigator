import { createFileRoute } from "@tanstack/react-router";
import { Cpu, Hand, MonitorPlay, ShieldCheck, Zap, Truck, BadgeCheck } from "lucide-react";
import { LeadSurvey } from "@/components/LeadSurvey";
import { Toaster } from "@/components/ui/sonner";
import heroImage from "@/assets/ifpd-hero.jpg";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "Free Quote · IMPEX xSeries Smart Board for Schools & Offices" },
      {
        name: "description",
        content:
          "Bulk pricing + free on-site demo on IMPEX xSeries interactive flat panels. 65\"/75\"/86\" · Android 14 · EDLA · pan-India install. Get your quote in 30 seconds.",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#1a0808" },
    ],
  }),
});

function LandingPage() {
  return (
    <main className="min-h-[100svh] brand-glow-bg">
      <Toaster theme="dark" position="top-center" richColors />

      {/* Compact top bar */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6 sm:py-3">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            aria-label="Scroll to top"
          >
            <img src={logo} alt="IMPEX" className="h-8 w-auto sm:h-10" />
            <span className="ml-1 text-xs font-medium text-white/60 sm:text-sm">xSeries</span>
          </button>
          <div className="flex items-center gap-2 text-[11px] text-white/70 sm:gap-3 sm:text-sm">
            <a 
              href="https://ifpd.impexstore.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden items-center gap-1 rounded-full border border-white/10 px-3 py-1 font-medium transition-colors hover:border-primary/60 hover:text-white sm:inline-flex"
            >
              Learn more
            </a>
            <a href="tel:+918047181903" className="rounded-full border border-white/10 px-3 py-1 font-medium hover:border-primary/60 hover:text-white">
              Call sales
            </a>
          </div>
        </div>
      </header>

      {/* Above-the-fold: form-first on mobile, two-col on desktop */}
      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-10 pt-3 sm:px-6 sm:pt-6 lg:grid-cols-2 lg:gap-12 lg:pb-16 lg:pt-12">
        {/* Mobile-first compact intro (above form) */}
        <div className="order-1 lg:order-1 lg:mb-0">
          {/* MOBILE intro — ultra-compact so the form starts inside the first viewport */}
          <div className="lg:hidden">
            <span className="chip text-[10px]">
              <Zap className="size-3 text-primary" /> Limited offer · Free demo + bulk pricing
            </span>
            <h1 className="mt-2 text-balance text-[26px] font-bold leading-[1.1] tracking-tight">
              Professional{" "}
              <span className="bg-gradient-to-r from-primary to-rose-400 bg-clip-text text-transparent">
                interactive displays
              </span>{" "}
              for schools and offices.
            </h1>
            <p className="mt-1.5 text-[13px] leading-snug text-white/65">
              Get a custom quote with installation included — our team responds within 1 working day.
            </p>
          </div>

          {/* DESKTOP pitch */}
          <div className="hidden lg:block">
            <h1 className="text-balance text-5xl font-bold leading-[1.05] tracking-tight lg:text-[3.4rem]">
              Professional interactive displays{" "}
              <span className="bg-gradient-to-r from-primary to-rose-400 bg-clip-text text-transparent">
                built for Indian classrooms and boardrooms.
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70 lg:text-lg">
              IMPEX xSeries delivers 4K clarity, responsive touch technology, and reliable performance — with professional installation and support across India.
            </p>

            <ul className="mt-6 grid grid-cols-2 gap-2.5">
              <Feature icon={<MonitorPlay className="size-4" />} label="4K Ultra HD · 400 nits" />
              <Feature icon={<Hand className="size-4" />} label="40-pt zero-bonded touch" />
              <Feature icon={<Cpu className="size-4" />} label="Android 14 + Workspace" />
              <Feature icon={<ShieldCheck className="size-4" />} label="3-yr on-site warranty" />
            </ul>

            <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/10">
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
        </div>

        {/* Form — order-first inside viewport on mobile */}
        <div className="order-2 lg:order-2 lg:sticky lg:top-20 lg:self-start">
          <LeadSurvey />
        </div>
      </section>

      {/* Below-the-fold strip — kept tiny on mobile, only renders after scroll */}
      <section className="border-t border-white/5 bg-background/60">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:grid-cols-3 sm:px-6">
          <MiniBenefit icon={<Truck className="size-4" />} title="Free install" desc="Delivery + mounting + training, included." />
          <MiniBenefit icon={<ShieldCheck className="size-4" />} title="3-yr warranty" desc="On-site, same-day response in metros." />
          <MiniBenefit icon={<BadgeCheck className="size-4" />} title="GeM + PO friendly" desc="Tender docs, GST invoice, EMD support." />
        </div>
      </section>

      <footer className="border-t border-white/5 py-6 text-center text-[11px] text-white/40">
        <div className="mx-auto max-w-6xl px-4">
          <p>
            © {new Date().getFullYear()} IMPEX Appliances · xSeries Interactive Displays
          </p>
          <p className="mt-2">
            <a 
              href="https://ifpd.impexstore.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/50 transition-colors hover:text-primary hover:underline"
            >
              Learn more about our products
            </a>
          </p>
        </div>
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

function MiniBenefit({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">{icon}</span>
      <div>
        <div className="text-sm font-semibold text-white">{title}</div>
        <p className="text-xs leading-relaxed text-white/60">{desc}</p>
      </div>
    </div>
  );
}
