import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Briefcase, Eye, EyeOff, Handshake, Loader2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, NativeSelect, Panel, TagInput } from "@/components/site/ui";
import { COUNTRIES, EDUCATION_LEVELS, FIELDS } from "@/data/constants";
import { register } from "@/services/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your profile – TalentBridge" },
      { name: "description", content: "Register as a job seeker, employer or mentor on TalentBridge." },
      { property: "og:title", content: "Create your profile – TalentBridge" },
      { property: "og:description", content: "Register as a job seeker, employer or mentor on TalentBridge." },
    ],
  }),
  component: Register,
});

const ROLES = [
  { id: "seeker", label: "Job seeker", icon: UserRound },
  { id: "employer", label: "Employer", icon: Briefcase },
  { id: "mentor", label: "Mentor", icon: Handshake },
] as const;
type RoleId = (typeof ROLES)[number]["id"];
type Errors = Partial<Record<"name" | "email" | "password" | "country" | "field" | "educationLevel" | "skills" | "years", string>>;

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState<RoleId>("seeker");
  const [form, setForm] = useState({ name: "", email: "", password: "", country: "", field: "", educationLevel: "", years: "" });
  const [skills, setSkills] = useState<string[]>([]);
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Errors = {};
    if (form.name.trim().length < 2) errs.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = "Enter a valid email address.";
    if (form.password.length < 8) errs.password = "Use at least 8 characters.";
    if (!form.country) errs.country = "Choose your country of residence.";
    if (!form.field) errs.field = "Choose your professional field.";
    if (!form.educationLevel) errs.educationLevel = "Choose your education level.";
    if (skills.length === 0) errs.skills = "Add at least one skill.";
    const years = Number(form.years);
    if (form.years === "" || !Number.isFinite(years) || years < 0 || years > 60) errs.years = "Enter a number between 0 and 60.";
    setErrors(errs);
    setFormError("");
    if (Object.keys(errs).length) return;
    setBusy(true);
    const res = await register({ ...form, role, skills, years });
    setBusy(false);
    if (!res.ok) {
      setFormError(res.error);
      return;
    }
    toast.success("Your profile has been created.");
    void navigate({ to: "/dashboard" });
  };

  return (
    <div className="container-page max-w-3xl py-14">
      <Panel className="p-8">
        <h1 className="text-3xl font-bold">Create your profile</h1>
        <p className="mt-1 text-muted-foreground">It takes about two minutes. You will never be asked for identity documents or refugee identification numbers.</p>
        <form onSubmit={submit} className="mt-7 grid gap-5" noValidate>
          <fieldset>
            <legend className="text-sm font-medium">I am joining as a</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {ROLES.map((r) => (
                <label key={r.id} className={cn("flex cursor-pointer items-center gap-3 rounded-xl border bg-card p-3 text-sm font-medium transition-colors", role === r.id && "border-primary bg-primary-soft text-primary")}>
                  <input type="radio" name="role" value={r.id} checked={role === r.id} onChange={() => setRole(r.id)} className="sr-only" />
                  <r.icon className="size-5" aria-hidden /> {r.label}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" htmlFor="name" error={errors.name}>
              <Input id="name" autoComplete="name" value={form.name} onChange={set("name")} />
            </Field>
            <Field label="Email" htmlFor="email" error={errors.email}>
              <Input id="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} />
            </Field>
            <Field label="Password" htmlFor="password" error={errors.password} hint="At least 8 characters.">
              <div className="relative">
                <Input id="password" type={show ? "text" : "password"} autoComplete="new-password" value={form.password} onChange={set("password")} className="pr-10" />
                <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                </button>
              </div>
            </Field>
            <Field label="Country of residence" htmlFor="country" error={errors.country}>
              <NativeSelect id="country" value={form.country} onChange={set("country")}>
                <option value="">Select a country</option>
                {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
              </NativeSelect>
            </Field>
            <Field label="Professional field" htmlFor="field" error={errors.field}>
              <NativeSelect id="field" value={form.field} onChange={set("field")}>
                <option value="">Select a field</option>
                {FIELDS.map((c) => <option key={c}>{c}</option>)}
              </NativeSelect>
            </Field>
            <Field label="Education level" htmlFor="educationLevel" error={errors.educationLevel}>
              <NativeSelect id="educationLevel" value={form.educationLevel} onChange={set("educationLevel")}>
                <option value="">Select a level</option>
                {EDUCATION_LEVELS.map((c) => <option key={c}>{c}</option>)}
              </NativeSelect>
            </Field>
            <Field label="Years of experience" htmlFor="years" error={errors.years}>
              <Input id="years" type="number" min={0} max={60} inputMode="numeric" value={form.years} onChange={set("years")} />
            </Field>
            <Field label="Professional skills" htmlFor="skills" error={errors.skills} hint="Press Enter or comma after each skill.">
              <TagInput id="skills" value={skills} onChange={setSkills} placeholder="e.g. Accounting, Excel" />
            </Field>
          </div>
          {formError ? <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">{formError}</p> : null}
          <p className="rounded-md bg-warning-soft px-3 py-2 text-xs text-warning-foreground">
            Demonstration mode: your account is stored in this browser only. It is not secure sign-in and is not shared across devices.
          </p>
          <Button type="submit" size="lg" disabled={busy}>
            {busy ? <Loader2 className="animate-spin" aria-hidden /> : null} Create profile
          </Button>
        </form>
        <p className="mt-5 text-sm text-muted-foreground">
          Already registered? <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link>
        </p>
      </Panel>
    </div>
  );
}
