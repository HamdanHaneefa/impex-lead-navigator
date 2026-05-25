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
  Zap,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { submitToGoogleSheets } from "@/lib/google-sheets";
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
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const stepIndex = STEP_ORDER.indexOf(step);
  const progress = step === "success" ? 100 : ((stepIndex + 1) / (STEP_ORDER.length + 1)) * 100;

  const next = (s: StepKey) => setStep(s);
  const back = () => {
    const i = STEP_ORDER.indexOf(step);
    if (i > 0) setStep(STEP_ORDER[i - 1]);
  };

  const resetForm = () => {
    setStep("environment");
    setEnvironment("");
    setSize("");
    setQuantity("");
    setTimeline("");
    setDetails({
      full_name: "",
      email: "",
      phone: "",
      organization: "",
      city: "",
      role: "",
      notes: "",
    });
    setErrors({});
    setFocusedField(null);
  };

  function selectAndAdvance(setter: (v: string) => void, value: string, nextStep: StepKey) {
    setter(value);
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
      const formData = {
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
        timestamp: new Date().toISOString(),
      };
      
      await submitToGoogleSheets(formData);
      setStep("success");
      // Scroll to top on success
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success("Form submitted successfully!");
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
        return { eyebrow: "Final Step", title: "Get your personalized quote", sub: "Our team will reach out within 1 working day with pricing and a free demo." };
      default:
        return { eyebrow: "", title: "", sub: "" };
    }
  }, [step]);

  return (
    <div className="rounded-2xl border border-white/10 bg-card/70 p-3 shadow-2xl shadow-black/40 backdrop-blur sm:p-5">
      {/* Progress */}
      {step !== "success" && (
        <div className="mb-2 sm:mb-4">
          <div className="mb-1 flex items-center justify-between text-[10px] text-white/60 sm:mb-1.5 sm:text-xs">
            <span className="font-medium uppercase tracking-wider text-primary">
              {stepTitle.eyebrow}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1 bg-white/10" />
        </div>
      )}

      {step !== "success" && (
        <header className="mb-2 sm:mb-4">
          <h2 className="text-balance text-base font-semibold leading-tight tracking-tight sm:text-2xl">
            {stepTitle.title}
          </h2>
          <p className="mt-0.5 text-[11px] text-white/60 sm:mt-1 sm:text-sm">{stepTitle.sub}</p>
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
        <div className="space-y-2.5 sm:space-y-3">
          {/* Premium Card Layout */}
          <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
            {/* Name */}
            <FloatingLabelInput
              icon={<User className="size-4" />}
              label="Full name"
              value={details.full_name}
              onChange={(v) => setDetails({ ...details, full_name: v })}
              error={errors.full_name}
              placeholder="Anita Sharma"
              focused={focusedField === "name"}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
            />

            {/* Email */}
            <FloatingLabelInput
              icon={<Mail className="size-4" />}
              label="Work email"
              type="email"
              value={details.email}
              onChange={(v) => setDetails({ ...details, email: v })}
              error={errors.email}
              placeholder="you@organization.com"
              focused={focusedField === "email"}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
            {/* Phone */}
            <FloatingLabelInput
              icon={<Phone className="size-4" />}
              label="Phone / WhatsApp"
              type="tel"
              value={details.phone}
              onChange={(v) => setDetails({ ...details, phone: v })}
              error={errors.phone}
              placeholder="+91 98xxx xxxxx"
              focused={focusedField === "phone"}
              onFocus={() => setFocusedField("phone")}
              onBlur={() => setFocusedField(null)}
            />

            {/* Organization */}
            <FloatingLabelInput
              icon={<Building2 className="size-4" />}
              label="Organization / Institute"
              value={details.organization}
              onChange={(v) => setDetails({ ...details, organization: v })}
              error={errors.organization}
              placeholder="Greenfield International School"
              focused={focusedField === "org"}
              onFocus={() => setFocusedField("org")}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
            {/* City */}
            <FloatingLabelInput
              icon={<MapPin className="size-4" />}
              label="City (optional)"
              value={details.city}
              onChange={(v) => setDetails({ ...details, city: v })}
              placeholder="Mumbai"
              focused={focusedField === "city"}
              onFocus={() => setFocusedField("city")}
              onBlur={() => setFocusedField(null)}
            />

            {/* Role */}
            <FloatingLabelInput
              icon={<Briefcase className="size-4" />}
              label="Your role (optional)"
              value={details.role}
              onChange={(v) => setDetails({ ...details, role: v })}
              placeholder="Principal, IT Head..."
              focused={focusedField === "role"}
              onFocus={() => setFocusedField("role")}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          {/* Notes */}
          <div className="relative">
            <label className="mb-1 block text-[11px] font-medium text-white/70 sm:text-xs">
              Special requirements? (optional)
            </label>
            <Textarea
              rows={2}
              maxLength={1000}
              placeholder="Room size, existing setup, budget..."
              value={details.notes}
              onChange={(e) => setDetails({ ...details, notes: e.target.value })}
              className="resize-none border-white/20 bg-white/5 text-xs backdrop-blur-sm transition-all focus:border-primary/60 focus:bg-white/10 sm:text-sm"
            />
          </div>

          {/* Submit Button */}
          <Button
            size="lg"
            disabled={submitting}
            onClick={handleSubmit}
            className="group relative mt-2 h-11 w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary via-primary to-rose-500 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 sm:mt-3 sm:h-12"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Zap className="size-4" /> Get my free quote
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </span>
            <div className="absolute inset-0 -z-0 bg-gradient-to-r from-rose-500 to-primary opacity-0 transition-opacity group-hover:opacity-100" />
          </Button>

          <p className="text-center text-[9px] leading-relaxed text-white/50 sm:text-[10px]">
            🔒 Your information is secure. We'll only use it to send your quote.
          </p>
        </div>
      )}

      {step === "success" && (
        <div className="py-4 text-center sm:py-5">
          <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/30 sm:size-18">
            <div className="grid size-11 place-items-center rounded-full bg-primary/20 sm:size-12">
              <Check className="size-6 text-primary sm:size-7" strokeWidth={3} />
            </div>
          </div>
          
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Request Submitted Successfully</h2>
          <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-white/70 sm:mt-3 sm:text-sm">
            Thank you for your interest in IMPEX xSeries Interactive Displays. Our sales specialist will contact you within one business day with a personalized quote and complimentary on-site demonstration.
          </p>

          <div className="mx-auto mt-5 max-w-2xl sm:mt-6">
            <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-white/50 sm:mb-3 sm:text-xs">Your Selection Summary</h3>
            <div className="grid gap-2.5 sm:grid-cols-3 sm:gap-3">
              <SummaryStat icon={<Monitor className="size-4" />} label="Environment" value={labelFor(ENV_OPTIONS, environment)} />
              <SummaryStat icon={<Package className="size-4" />} label="Size & Quantity" value={`${labelFor(SIZE_OPTIONS, size)} • ${labelFor(QTY_OPTIONS, quantity)}`} />
              <SummaryStat icon={<CalendarClock className="size-4" />} label="Timeline" value={labelFor(TIMELINE_OPTIONS, timeline)} />
            </div>
          </div>

          <div className="mt-5 flex flex-col items-center gap-2.5 border-t border-white/10 pt-4 sm:mt-6 sm:flex-row sm:justify-center sm:gap-3 sm:pt-5">
            <button
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-primary/90 sm:text-sm"
            >
              <ArrowRight className="size-3.5 sm:size-4" />
              Submit Another Request
            </button>
            <a 
              href="https://ifpd.impexstore.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3.5 py-2 text-xs font-medium text-white/80 transition-all hover:border-primary/60 hover:bg-white/10 hover:text-white sm:text-sm"
            >
              <Monitor className="size-3.5 sm:size-4" />
              Explore Product Catalog
            </a>
            <a 
              href="tel:+918047181903"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3.5 py-2 text-xs font-medium text-white/80 transition-all hover:border-primary/60 hover:bg-white/10 hover:text-white sm:text-sm"
            >
              <Phone className="size-3.5 sm:size-4" />
              Call Sales Team
            </a>
          </div>

          <p className="mt-4 text-[10px] text-white/40 sm:mt-5 sm:text-xs">
            Reference ID: {new Date().getTime().toString(36).toUpperCase()}
          </p>
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

function FloatingLabelInput({
  icon,
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  focused,
  onFocus,
  onBlur,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder: string;
  type?: string;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}) {
  const hasValue = value.length > 0;
  
  return (
    <div className="relative">
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border bg-white/5 backdrop-blur-sm transition-all",
          focused ? "border-primary/60 bg-white/10 shadow-lg shadow-primary/10" : "border-white/20",
          error && "border-destructive/60"
        )}
      >
        <div className="flex items-center gap-2 p-2.5 sm:gap-2.5 sm:p-3">
          <span className={cn("shrink-0 transition-colors", focused ? "text-primary" : "text-white/50")}>
            {icon}
          </span>
          <div className="relative min-w-0 flex-1">
            <label
              className={cn(
                "pointer-events-none absolute left-0 origin-left transition-all duration-200",
                hasValue || focused
                  ? "-translate-y-2.5 scale-75 text-[9px] font-medium text-white/70 sm:-translate-y-3 sm:text-[10px]"
                  : "translate-y-0 scale-100 text-xs text-white/50 sm:text-sm"
              )}
            >
              {label}
            </label>
            <input
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder={focused ? placeholder : ""}
              autoComplete={type === "email" ? "email" : type === "tel" ? "tel" : "name"}
              name={type === "email" ? "email" : type === "tel" ? "tel" : "name"}
              className={cn(
                "autofill-dark w-full border-none bg-transparent text-sm text-white outline-none placeholder:text-white/30 sm:text-base",
                hasValue || focused ? "mt-2.5 sm:mt-3" : "mt-0"
              )}
            />
          </div>
        </div>
        {focused && (
          <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-primary to-rose-500" />
        )}
      </div>
      {error && <p className="mt-1 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
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

function SummaryStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-left backdrop-blur-sm sm:p-3">
      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-white/50 sm:mb-1.5 sm:text-[11px]">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <div className="text-sm font-semibold text-white sm:text-base">{value}</div>
    </div>
  );
}
