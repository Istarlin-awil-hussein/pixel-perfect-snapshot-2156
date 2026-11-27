import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DemoBadge, Field, NativeSelect, Panel, RequireAuth, TagInput } from "@/components/site/ui";
import { COUNTRIES, EDUCATION_LEVELS, FIELDS, ROLE_LABELS } from "@/data/constants";
import { updateProfile } from "@/services/profile";
import { resetDb } from "@/services/storage";
import type { User } from "@/types";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Edit profile – TalentBridge" },
      { name: "description", content: "Update your TalentBridge professional profile." },
      { property: "og:title", content: "Edit profile – TalentBridge" },
      { property: "og:description", content: "Update your TalentBridge professional profile." },
    ],
  }),
  component: () => <RequireAuth>{(user) => <ProfileForm key={user.id} user={user} />}</RequireAuth>,
});

function ProfileForm({ user }: { user: User }) {
  const [form, setForm] = useState({ name: user.name, country: user.country, field: user.field, educationLevel: user.educationLevel, years: String(user.years), bio: user.bio });
  const [skills, setSkills] = useState(user.skills);
  const [soft, setSoft] = useState(user.softSkills);
  const [error, setError] = useState("");
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const years = Number(form.years);
    if (form.name.trim().length < 2) return setError("Enter your full name.");
    if (!Number.isFinite(years) || years < 0 || years > 60) return setError("Years of experience must be between 0 and 60.");
    setError("");
    updateProfile(user.id, { ...form, name: form.name.trim(), years, skills, softSkills: soft });
    toast.success("Profile saved.");
  };

  return (
    <div className="container-page max-w-3xl py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Edit profile</h1>
          <p className="text-muted-foreground">{ROLE_LABELS[user.role]} · {user.email}</p>
        </div>
        <Button asChild variant="outline"><Link to="/dashboard">Back to dashboard</Link></Button>
      </div>
      <Panel className="mt-6">
        <form onSubmit={submit} className="grid gap-5" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" htmlFor="name"><Input id="name" value={form.name} onChange={set("name")} /></Field>
            <Field label="Country of residence" htmlFor="country">
              <NativeSelect id="country" value={form.country} onChange={set("country")}>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</NativeSelect>
            </Field>
            <Field label="Professional field" htmlFor="field">
              <NativeSelect id="field" value={form.field} onChange={set("field")}>{FIELDS.map((c) => <option key={c}>{c}</option>)}</NativeSelect>
            </Field>
            <Field label="Education level" htmlFor="educationLevel">
              <NativeSelect id="educationLevel" value={form.educationLevel} onChange={set("educationLevel")}>{EDUCATION_LEVELS.map((c) => <option key={c}>{c}</option>)}</NativeSelect>
            </Field>
            <Field label="Years of experience" htmlFor="years"><Input id="years" type="number" min={0} max={60} value={form.years} onChange={set("years")} /></Field>
          </div>
          <Field label="Professional summary" htmlFor="bio" hint="Two or three sentences about what you do best.">
            <Textarea id="bio" rows={4} value={form.bio} onChange={set("bio")} />
          </Field>
          <Field label="Technical skills" htmlFor="skills" hint="Used to estimate your match with opportunities.">
            <TagInput id="skills" value={skills} onChange={setSkills} />
          </Field>
          <Field label="Professional skills" htmlFor="soft" hint="For example communication, leadership or teamwork.">
            <TagInput id="soft" value={soft} onChange={setSoft} />
          </Field>
          {error ? <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">{error}</p> : null}
          <div className="flex flex-wrap gap-3">
            <Button type="submit">Save profile</Button>
            <Button asChild variant="outline"><Link to="/skills">Edit education, experience and languages</Link></Button>
          </div>
        </form>
      </Panel>
      <Panel className="mt-6 bg-surface">
        <DemoBadge>Demonstration data</DemoBadge>
        <p className="mt-3 text-sm text-muted-foreground">Everything is stored in this browser only. Resetting restores the original sample content and removes accounts created here.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            if (window.confirm("Reset all demonstration data in this browser?")) {
              resetDb();
              toast.success("Demonstration data has been reset.");
            }
          }}
        >
          <RotateCcw aria-hidden /> Reset demo data
        </Button>
      </Panel>
    </div>
  );
}
