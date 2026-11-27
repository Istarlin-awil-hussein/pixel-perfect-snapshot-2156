import { forwardRef, useState, type KeyboardEvent, type ReactNode, type SelectHTMLAttributes } from "react";
import { Link, Navigate, type LinkProps } from "@tanstack/react-router";
import { FlaskConical, Loader2, LockKeyhole, X, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/services/auth";
import { useHydrated } from "@/services/storage";
import type { Role, User } from "@/types";

export function DemoBadge({ children = "Demo listing" }: { children?: ReactNode }) {
  return (
    <Badge variant="demo" className="gap-1 font-medium">
      <FlaskConical className="size-3" aria-hidden />
      {children}
    </Badge>
  );
}

export function PageHeader({ eyebrow, title, text, children }: { eyebrow: string; title: string; text: string; children?: ReactNode }) {
  return (
    <section className="bg-hero text-navy-foreground">
      <div className="container-page py-14 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-navy-muted">{text}</p>
        {children ? <div className="mt-7 flex flex-wrap gap-3">{children}</div> : null}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, text, center }: { eyebrow?: string; title: string; text?: string; center?: boolean }) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-strong">{eyebrow}</p> : null}
      <h2 className="mt-2 text-3xl font-bold md:text-4xl">{title}</h2>
      {text ? <p className="mt-3 text-lg text-muted-foreground">{text}</p> : null}
    </div>
  );
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-2xl border bg-card p-6 shadow-card", className)}>{children}</div>;
}

export function EmptyState({ icon: Icon, title, text, children }: { icon: LucideIcon; title: string; text: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed bg-surface px-6 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-primary-soft text-primary">
        <Icon className="size-6" aria-hidden />
      </span>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
      {children ? <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div> : null}
    </div>
  );
}

export function SignInPrompt({ text }: { text: string }) {
  return (
    <EmptyState icon={LockKeyhole} title="Sign in to continue" text={text}>
      <Button asChild>
        <Link to="/register">Create your profile</Link>
      </Button>
      <Button asChild variant="outline">
        <Link to="/login">Log in</Link>
      </Button>
    </EmptyState>
  );
}

export function PageLoader() {
  return (
    <div className="grid min-h-[50vh] place-items-center" role="status" aria-live="polite">
      <Loader2 className="size-7 animate-spin text-primary" aria-hidden />
      <span className="sr-only">Loading</span>
    </div>
  );
}

/** Client-side gate for signed-in pages. Demo mode: this is navigation protection, not server security. */
export function RequireAuth({ role, children }: { role?: Role; children: (user: User) => ReactNode }) {
  const hydrated = useHydrated();
  const user = useCurrentUser();
  if (!hydrated) return <PageLoader />;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) {
    return (
      <div className="container-page py-16">
        <EmptyState icon={LockKeyhole} title="This area is for administrators" text="Your account does not have access to this page.">
          <Button asChild>
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }
  return <>{children(user)}</>;
}

export function Field({ label, htmlFor, error, hint, children, className }: { label: string; htmlFor: string; error?: string | undefined; hint?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? (
        <p className="text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const NativeSelect = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-9 w-full rounded-md border border-input bg-card px-3 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
NativeSelect.displayName = "NativeSelect";

export function TagInput({ id, value, onChange, placeholder }: { id: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const commit = () => {
    const parts = draft.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length === 0) return;
    const lower = new Set(value.map((v) => v.toLowerCase()));
    onChange([...value, ...parts.filter((p) => !lower.has(p.toLowerCase()))]);
    setDraft("");
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };
  return (
    <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-input bg-card px-2 py-1.5 shadow-xs focus-within:ring-1 focus-within:ring-ring">
      {value.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">
          {tag}
          <button type="button" onClick={() => onChange(value.filter((v) => v !== tag))} aria-label={`Remove ${tag}`} className="rounded hover:text-destructive">
            <X className="size-3" aria-hidden />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKey}
        onBlur={commit}
        placeholder={value.length ? "" : (placeholder ?? "Type and press Enter")}
        className="min-w-32 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}

export function MatchPill({ score }: { score: number }) {
  const tone = score >= 70 ? "bg-success-soft text-success" : score >= 40 ? "bg-teal-soft text-teal-strong" : "bg-muted text-muted-foreground";
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", tone)} title="Estimated from the skills on your profile">
      {score}% match
    </span>
  );
}

export type To = NonNullable<LinkProps["to"]>;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

const STATUS_VARIANT = {
  Submitted: "soft",
  "Under review": "teal",
  Shortlisted: "teal",
  Interview: "default",
  Rejected: "destructive",
  Accepted: "success",
  Pending: "soft",
  Declined: "muted",
} as const;

export function StatusBadge({ status }: { status: keyof typeof STATUS_VARIANT }) {
  return <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>;
}
