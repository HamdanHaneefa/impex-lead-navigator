import { useMemo, useState } from "react";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarClock,
  Check,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Monitor,
  Package,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ChoiceOption = {
  value: string;
  label: string;
  hint?: string;
  icon?: React.ReactNode;
};

const ENV_OPTIONS: ChoiceOption[] = [
  { value: "school", label: "School (K–12)", hint: "Nursery to Class 12", icon: <GraduationCap className="size-5" /> },
  { value: "college", label: "College / University", hint: "Higher education", icon: <GraduationCap className="size-5" /> },
  { value: "corporate", label: "Corporate / Boardroom", hint: "Meetings & hybrid work", icon: <Building2 className="size-5" /> },
  { value: "training", label: "Training Institute", hint: "Coaching, edtech, skill labs", icon: <Sparkles className="size-5" /> },
  { value: "government", label: "Government / PSU", hint: "Public sector deployment", icon: <ShieldCheck className="size-5" /> },
  { value: "other", label: "Something else", icon: <Package className="size-5" /> },
];

const SIZE_OPTIONS: ChoiceOption[] = [
  { value: "65", label: '65"', hint: "Small rooms" },
  { value: "75", label: '75"', hint: "Most popular" },
  { value: "86", label: '86"', hint: "Large halls" },
  { value: "unsure", label: "Help me decide", hint: "We'll recommend" },
];

const QTY_OPTIONS: ChoiceOption[] = [
  { value: "1", label: "Just 1" },
  { value: "2-5", label: "2 – 5" },
  { value: "6-10", label: "6 – 10" },
  { value: "10+", label: "10 or more" },
];

const TIMELINE_OPTIONS: ChoiceOption[] = [
  { value: "immediate", label: "Immediately", hint: "Within 2 weeks" },
  { value: "1-month", label: "Within 1 month" },
  { value: "3-months", label: "Within 3 months" },
  { value: "exploring", label: "Just exploring" },
];

const detailsSchema = z.object({
  full_name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid work email").max(255),
  phone: z
    .string()
    .trim()
    .min(6, "Enter a valid phone number")
    .max(20)
    .regex(/^[+\d][\d\s\-()]{5,19}$/, "Enter a valid phone number"),
  organization: z.string().trim().min(1, "Organization name is required").max(150),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  role: z.string().trim().max(80).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

type StepKey = "environment" | "size" | "quantity" | "timeline" | "details" | "success";

const STEP_ORDER: StepKey[] = ["environment", "size", "quantity", "timeline", "details"];

export function LeadSurvey() {
  const [step, setStep] = useState<StepKey>("environment");
  const [environment, setEnvironment] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [timeline, setTimeline] = useState<string>("");
  const [details, setDetails] = useState({
    full_name: "",
    email: "",
    phone: "",
    organization: "",
    city: "",
    role: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const stepIndex = STEP_ORDER.indexOf(step);
  const progress = step === "success" ? 100 : ((stepIndex + 1) / (STEP_ORDER.length + 1)) * 100;

  const next = (s: StepKey) => setStep(s);
  const back = () => {
    const i = STEP_ORDER.indexOf(step);
    if (i > 0) setStep(STEP_ORDER[i - 1]);
  };

  function selectAndAdvance(setter: (v: string) => void, value: string, nextStep: StepKey) {
    setter(value);
    // Tiny delay so the user sees their selection animate before advancing
    setTimeout(() => next(nextStep), 180);
  }

  async function handleSubmit() {
    const parsed = detailsSchema.safeParse(details);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        const key = i.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const { error } = await supabase.from("leads").insert({
        environment,
        display_size: size,
        quantity,
        timeline,
        full_name: parsed.data.full_name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        organization: parsed.data.organization,
        city: parsed.data.city || null,
        role: parsed.data.role || null,
        notes: parsed.data.notes || null,
        source: typeof window !== "undefined" ? (window.location.search || "google-ads") : "google-ads",
      });
      if (error) throw error;
      setStep("success");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const stepTitle = useMemo(() => {
    switch (step) {
      case "environment":
        return { eyebrow: "Step 1 of 5", title: "Where will the display be used?", sub: "Helps us recommend the right model — xLearnAI or xMeetAI." };
      case "size":
        return { eyebrow: "Step 2 of 5", title: "Which screen size do you need?", sub: "65\", 75\" and 86\" available. Most rooms use 75\"." };
      case "quantity":
        return { eyebrow: "Step 3 of 5", title: "How many units are you planning for?", sub: "Bulk pricing unlocks from 2 units onward." };
      case "timeline":
        return { eyebrow: "Step 4 of 5", title: "When do you need it installed?", sub: "We deliver and install across India." };
      case "details":
        return { eyebrow: "Step 5 of 5", title: "Last step — where should we send the quote?", sub: "Our team will reach out within 1 working day." };
      default:
        return { eyebrow: "", title: "", sub: "" };
    }
  }, [step]);

  return (
    <div className="rounded-2xl border border-white/10 bg-card/70 p-3.5 shadow-2xl shadow-black/40 backdrop-blur sm:p-7">
      {/* Progress */}
      {step !== "success" && (
        <div className="mb-3 sm:mb-6">
          <div className="mb-1.5 flex items-center justify-between text-[10px] text-white/60 sm:text-xs">
            <span className="font-medium uppercase tracking-wider text-primary">
              {stepTitle.eyebrow}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1 bg-white/10 sm:h-1.5" />
        </div>
      )}

      {step !== "success" && (
        <header className="mb-3 sm:mb-6">
          <h2 className="text-balance text-lg font-semibold leading-tight tracking-tight sm:text-3xl">
            {stepTitle.title}
          </h2>
          <p className="mt-1 text-xs text-white/60 sm:mt-2 sm:text-base">{stepTitle.sub}</p>
        </header>
      )}


      {/* Steps */}
      {step === "environment" && (
        <ChoiceGrid options={ENV_OPTIONS} value={environment} onSelect={(v) => selectAndAdvance(setEnvironment, v, "size")} />
      )}
      {step === "size" && (
        <ChoiceGrid options={SIZE_OPTIONS} value={size} onSelect={(v) => selectAndAdvance(setSize, v, "quantity")} columns={2} large />
      )}
      {step === "quantity" && (
        <ChoiceGrid options={QTY_OPTIONS} value={quantity} onSelect={(v) => selectAndAdvance(setQuantity, v, "timeline")} columns={2} large />
      )}
      {step === "timeline" && (
        <ChoiceGrid options={TIMELINE_OPTIONS} value={timeline} onSelect={(v) => selectAndAdvance(setTimeline, v, "details")} />
      )}

      {step === "details" && (
        <div className="space-y-4">
          <Field label="Full name" icon={<User className="size-4" />} error={errors.full_name}>
            <Input
              autoComplete="name"
              inputMode="text"
              placeholder="e.g. Anita Sharma"
              value={details.full_name}
              onChange={(e) => setDetails({ ...details, full_name: e.target.value })}
              className="h-12 text-base"
            />
          </Field>
          <Field label="Work email" icon={<Mail className="size-4" />} error={errors.email}>
            <Input
              autoComplete="email"
              inputMode="email"
              type="email"
              placeholder="you@organization.com"
              value={details.email}
              onChange={(e) => setDetails({ ...details, email: e.target.value })}
              className="h-12 text-base"
            />
          </Field>
          <Field label="Phone / WhatsApp" icon={<Phone className="size-4" />} error={errors.phone}>
            <Input
              autoComplete="tel"
              inputMode="tel"
              type="tel"
              placeholder="+91 98xxx xxxxx"
              value={details.phone}
              onChange={(e) => setDetails({ ...details, phone: e.target.value })}
              className="h-12 text-base"
            />
          </Field>
          <Field label="Organization / Institute" icon={<Building2 className="size-4" />} error={errors.organization}>
            <Input
              placeholder="e.g. Greenfield International School"
              value={details.organization}
              onChange={(e) => setDetails({ ...details, organization: e.target.value })}
              className="h-12 text-base"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City" icon={<MapPin className="size-4" />}>
              <Input
                placeholder="City"
                value={details.city}
                onChange={(e) => setDetails({ ...details, city: e.target.value })}
                className="h-12 text-base"
              />
            </Field>
            <Field label="Your role" icon={<User className="size-4" />}>
              <Input
                placeholder="Principal, IT Head…"
                value={details.role}
                onChange={(e) => setDetails({ ...details, role: e.target.value })}
                className="h-12 text-base"
              />
            </Field>
          </div>
          <Field label="Anything specific we should know? (optional)">
            <Textarea
              rows={3}
              maxLength={1000}
              placeholder="Room size, existing setup, special requirements…"
              value={details.notes}
              onChange={(e) => setDetails({ ...details, notes: e.target.value })}
              className="text-base"
            />
          </Field>

          <Button
            size="lg"
            disabled={submitting}
            onClick={handleSubmit}
            className="mt-2 h-14 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90"
          >
            {submitting ? (
              <>
                <Loader2 className="size-5 animate-spin" /> Submitting…
              </>
            ) : (
              <>
                Get my free quote <ArrowRight className="size-5" />
              </>
            )}
          </Button>
          <p className="text-center text-[11px] leading-relaxed text-white/50">
            By submitting, you agree to be contacted by IMPEX about the xSeries. We respect your privacy.
          </p>
        </div>
      )}

      {step === "success" && (
        <div className="py-4 text-center">
          <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
            <Check className="size-8" />
          </div>
          <h2 className="text-2xl font-semibold sm:text-3xl">You're on the list 🎉</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/70 sm:text-base">
            Thanks for your interest in the IMPEX xSeries. A specialist will call you within 1 working
            day with a tailored quote and a free on-site demo invitation.
          </p>
          <div className="mt-6 grid gap-3 text-left sm:grid-cols-3">
            <SummaryStat icon={<Monitor className="size-4" />} label="Environment" value={labelFor(ENV_OPTIONS, environment)} />
            <SummaryStat icon={<Package className="size-4" />} label="Size & Qty" value={`${labelFor(SIZE_OPTIONS, size)} • ${labelFor(QTY_OPTIONS, quantity)}`} />
            <SummaryStat icon={<CalendarClock className="size-4" />} label="Timeline" value={labelFor(TIMELINE_OPTIONS, timeline)} />
          </div>
        </div>
      )}

      {/* Footer nav */}
      {step !== "success" && step !== "environment" && (
        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
          <Button variant="ghost" size="sm" onClick={back} className="text-white/70 hover:text-white">
            <ArrowLeft className="size-4" /> Back
          </Button>
          <span className="text-xs text-white/40">Takes ~30 seconds</span>
        </div>
      )}
    </div>
  );
}

function labelFor(opts: ChoiceOption[], v: string) {
  return opts.find((o) => o.value === v)?.label ?? "—";
}

function ChoiceGrid({
  options,
  value,
  onSelect,
  columns = 1,
  large = false,
}: {
  options: ChoiceOption[];
  value: string;
  onSelect: (v: string) => void;
  columns?: 1 | 2;
  large?: boolean;
}) {
  return (
    <div className={cn("grid gap-2 sm:gap-3", columns === 2 ? "grid-cols-2" : "grid-cols-1")}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl border bg-white/[0.03] p-2.5 text-left transition-all sm:p-4",
              "hover:border-primary/60 hover:bg-white/[0.06] active:scale-[0.98]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
              selected
                ? "border-primary bg-primary/10 ring-2 ring-primary/40"
                : "border-white/10",
              large ? "min-h-[64px] flex-col items-start justify-center sm:min-h-[88px]" : "min-h-[48px] sm:min-h-[64px]",
            )}
          >
            {opt.icon && (
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-lg bg-white/5 text-white/70 transition-colors",
                  selected && "bg-primary/20 text-primary",
                )}
              >
                {opt.icon}
              </span>
            )}
            <span className="flex-1">
              <span className={cn("block text-[15px] font-semibold leading-tight", large && "text-xl")}>
                {opt.label}
              </span>
              {opt.hint && <span className="mt-0.5 block text-xs text-white/55">{opt.hint}</span>}
            </span>
            <span
              className={cn(
                "ml-auto grid size-5 shrink-0 place-items-center rounded-full border transition-all",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-white/20 bg-transparent",
                large && "absolute right-3 top-3",
              )}
            >
              {selected && <Check className="size-3" strokeWidth={3} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Field({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/70">
        {icon} {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

function SummaryStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white/50">
        {icon} {label}
      </div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}
