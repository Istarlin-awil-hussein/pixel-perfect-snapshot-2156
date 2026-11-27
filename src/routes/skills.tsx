import { useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Award, Briefcase, GraduationCap, Info, Languages, Link2, Plus, Trash2, Wrench, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Field, NativeSelect, PageHeader, Panel, SectionHeading, SignInPrompt, TagInput } from "@/components/site/ui";
import { COUNTRIES, LANGUAGE_LEVELS } from "@/data/constants";
import { CREDENTIAL_CHECKLIST, CREDENTIAL_GUIDANCE } from "@/data/guidance";
import { useCurrentUser } from "@/services/auth";
import { setCredentialStatus } from "@/services/checklists";
import { updateProfile } from "@/services/profile";
import { uid, useDb, useHydrated } from "@/services/storage";
import type { ChecklistStatus, User } from "@/types";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills & Credentials – TalentBridge" },
      { name: "description", content: "Record qualifications, certifications, experience, skills and languages, and follow a credential readiness checklist." },
      { property: "og:title", content: "Skills & Credentials – TalentBridge" },
      { property: "og:description", content: "Showcase your qualifications and follow guidance on recognition, assessment and certification." },
    ],
  }),
  component: Skills,
});

interface FieldDef {
  key: string;
  label: string;
  type?: "select" | "checkbox";
  options?: readonly string[];
  optional?: boolean;
}

function RecordSection<T extends { id: string }>({ icon: Icon, title, fields, items, render, onAdd, onRemove }: {
  icon: LucideIcon;
  title: string;
  fields: FieldDef[];
  items: T[];
  render: (item: T) => ReactNode;
  onAdd: (values: Record<string, string>) => void;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const slug = title.toLowerCase().replace(/\W+/g, "-");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const missing = fields.find((f) => !f.optional && f.type !== "checkbox" && !(values[f.key] ?? "").trim());
    if (missing) return setError(`Please fill in “${missing.label}”.`);
    onAdd(values);
    setValues({});
    setError("");
    setOpen(false);
    toast.success(`${title} updated.`);
  };

  return (
    <Panel>
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-semibold"><Icon className="size-5 text-primary" aria-hidden />{title}</h3>
        <Button variant="soft" size="sm" onClick={() => setOpen((o) => !o)} aria-expanded={open}><Plus aria-hidden /> Add</Button>
      </div>
      {open ? (
        <form onSubmit={submit} className="mt-4 grid gap-3 rounded-xl bg-surface p-4 sm:grid-cols-2" noValidate>
          {fields.map((f) => {
            const id = `${slug}-${f.key}`;
            const value = values[f.key] ?? "";
            const change = (v: string) => setValues((p) => ({ ...p, [f.key]: v }));
            if (f.type === "checkbox")
              return (
                <label key={f.key} htmlFor={id} className="flex items-center gap-2 text-sm sm:col-span-2">
                  <input id={id} type="checkbox" checked={value === "yes"} onChange={(e) => change(e.target.checked ? "yes" : "")} className="size-4 accent-primary" />
                  {f.label}
                </label>
              );
            return (
              <div key={f.key} className="space-y-1">
                <Label htmlFor={id} className="text-xs">{f.label}{f.optional ? " (optional)" : ""}</Label>
                {f.type === "select" ? (
                  <NativeSelect id={id} value={value} onChange={(e) => change(e.target.value)}>
                    <option value="">Select</option>
                    {f.options?.map((o) => <option key={o}>{o}</option>)}
                  </NativeSelect>
                ) : (
                  <Input id={id} value={value} onChange={(e) => change(e.target.value)} />
                )}
              </div>
            );
          })}
          {error ? <p role="alert" className="text-sm font-medium text-destructive sm:col-span-2">{error}</p> : null}
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit" size="sm">Save</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </form>
      ) : null}
      {items.length ? (
        <ul className="mt-4 grid gap-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 rounded-xl border bg-background px-4 py-3">
              <div className="min-w-0 text-sm">{render(item)}</div>
              <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)} aria-label="Remove entry"><Trash2 aria-hidden /></Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Nothing added yet.</p>
      )}
    </Panel>
  );
}

const STATUS_LABEL: Record<ChecklistStatus, string> = { not_started: "Not started", in_progress: "In progress", completed: "Completed" };

function Editor({ user }: { user: User }) {
  const db = useDb();
  const statuses = db.credentialChecklist[user.id] ?? {};
  const done = CREDENTIAL_CHECKLIST.filter((i) => statuses[i.id] === "completed").length;
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const yearCountry = (v: Record<string, string>) => ({ year: v["year"] ?? "", country: v["country"] ?? "" });

  const addLink = (e: FormEvent) => {
    e.preventDefault();
    if (!/^https?:\/\/\S+\.\S+/.test(link.trim())) return setLinkError("Enter a full link starting with https://");
    updateProfile(user.id, { portfolio: [...user.portfolio, link.trim()] });
    setLink("");
    setLinkError("");
    toast.success("Portfolio link added.");
  };

  return (
    <div className="grid gap-6">
      <p className="flex items-start gap-3 rounded-xl bg-warning-soft px-4 py-3 text-sm text-warning-foreground">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        Everything on this page is entered by you and shown as self-reported. TalentBridge does not verify certificates; independent verification is done by recognised
        assessment bodies.
      </p>
      <div className="grid gap-6 lg:grid-cols-2">
        <RecordSection
          icon={GraduationCap}
          title="Education and degrees"
          items={user.education}
          fields={[
            { key: "qualification", label: "Qualification or degree" },
            { key: "institution", label: "Institution" },
            { key: "country", label: "Country", type: "select", options: COUNTRIES },
            { key: "year", label: "Year completed" },
            { key: "needs", label: "This qualification needs recognition where I live", type: "checkbox" },
          ]}
          render={(e) => (
            <>
              <p className="font-medium">{e.qualification}</p>
              <p className="text-muted-foreground">{e.institution} · {e.country} · {e.year}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <Badge variant="muted">Self-reported</Badge>
                {e.needsRecognition ? <Badge variant="demo">Needs recognition</Badge> : null}
              </div>
            </>
          )}
          onAdd={(v) => updateProfile(user.id, { education: [...user.education, { id: uid(), qualification: v["qualification"] ?? "", institution: v["institution"] ?? "", ...yearCountry(v), needsRecognition: v["needs"] === "yes" }] })}
          onRemove={(id) => updateProfile(user.id, { education: user.education.filter((x) => x.id !== id) })}
        />
        <RecordSection
          icon={Award}
          title="Professional certifications"
          items={user.certifications}
          fields={[{ key: "name", label: "Certification" }, { key: "issuer", label: "Issued by" }, { key: "year", label: "Year" }]}
          render={(c) => (
            <>
              <p className="font-medium">{c.name}</p>
              <p className="text-muted-foreground">{c.issuer} · {c.year}</p>
              <Badge variant="muted" className="mt-1.5">Self-reported</Badge>
            </>
          )}
          onAdd={(v) => updateProfile(user.id, { certifications: [...user.certifications, { id: uid(), name: v["name"] ?? "", issuer: v["issuer"] ?? "", year: v["year"] ?? "" }] })}
          onRemove={(id) => updateProfile(user.id, { certifications: user.certifications.filter((x) => x.id !== id) })}
        />
        <RecordSection
          icon={Briefcase}
          title="Previous employment"
          items={user.experience}
          fields={[
            { key: "title", label: "Job title" },
            { key: "organization", label: "Organisation" },
            { key: "country", label: "Country", type: "select", options: COUNTRIES },
            { key: "period", label: "Period, e.g. 2018 – 2023" },
            { key: "description", label: "What you did", optional: true },
          ]}
          render={(x) => (
            <>
              <p className="font-medium">{x.title}</p>
              <p className="text-muted-foreground">{x.organization} · {x.country} · {x.period}</p>
              {x.description ? <p className="mt-1">{x.description}</p> : null}
            </>
          )}
          onAdd={(v) => updateProfile(user.id, { experience: [...user.experience, { id: uid(), title: v["title"] ?? "", organization: v["organization"] ?? "", country: v["country"] ?? "", period: v["period"] ?? "", description: v["description"] ?? "" }] })}
          onRemove={(id) => updateProfile(user.id, { experience: user.experience.filter((x) => x.id !== id) })}
        />
        <RecordSection
          icon={Languages}
          title="Languages"
          items={user.languages}
          fields={[{ key: "name", label: "Language" }, { key: "level", label: "Level", type: "select", options: LANGUAGE_LEVELS }]}
          render={(l) => <p><span className="font-medium">{l.name}</span> <span className="text-muted-foreground">· {l.level}</span></p>}
          onAdd={(v) => updateProfile(user.id, { languages: [...user.languages, { id: uid(), name: v["name"] ?? "", level: v["level"] ?? "" }] })}
          onRemove={(id) => updateProfile(user.id, { languages: user.languages.filter((x) => x.id !== id) })}
        />
        <Panel>
          <h3 className="flex items-center gap-2 text-lg font-semibold"><Wrench className="size-5 text-primary" aria-hidden />Skills</h3>
          <div className="mt-4 grid gap-4">
            <Field label="Technical skills" htmlFor="tech" hint="Saved as you type. Used for your opportunity match.">
              <TagInput id="tech" value={user.skills} onChange={(skills) => updateProfile(user.id, { skills })} />
            </Field>
            <Field label="Professional skills" htmlFor="softskills" hint="For example communication, leadership or negotiation.">
              <TagInput id="softskills" value={user.softSkills} onChange={(softSkills) => updateProfile(user.id, { softSkills })} />
            </Field>
          </div>
        </Panel>
        <Panel>
          <h3 className="flex items-center gap-2 text-lg font-semibold"><Link2 className="size-5 text-primary" aria-hidden />Portfolio links</h3>
          <form onSubmit={addLink} className="mt-4 flex gap-2" noValidate>
            <Input aria-label="Portfolio link" placeholder="https://" value={link} onChange={(e) => setLink(e.target.value)} />
            <Button type="submit">Add</Button>
          </form>
          {linkError ? <p role="alert" className="mt-2 text-sm font-medium text-destructive">{linkError}</p> : null}
          <ul className="mt-4 grid gap-2">
            {user.portfolio.map((p) => (
              <li key={p} className="flex items-center justify-between gap-3 rounded-xl border bg-background px-4 py-2 text-sm">
                <a href={p} target="_blank" rel="noreferrer noopener" className="truncate text-primary hover:underline">{p}</a>
                <Button variant="ghost" size="icon" aria-label="Remove link" onClick={() => updateProfile(user.id, { portfolio: user.portfolio.filter((x) => x !== p) })}><Trash2 aria-hidden /></Button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Credential readiness checklist</h3>
            <p className="text-sm text-muted-foreground">{done} of {CREDENTIAL_CHECKLIST.length} steps completed</p>
          </div>
          <Progress value={(done / CREDENTIAL_CHECKLIST.length) * 100} className="w-full sm:w-64" aria-label="Checklist progress" />
        </div>
        <ul className="mt-5 grid gap-3">
          {CREDENTIAL_CHECKLIST.map((item) => (
            <li key={item.id} className="flex flex-col gap-3 rounded-xl border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
              <NativeSelect
                aria-label={`Status: ${item.title}`}
                className="sm:w-40"
                value={statuses[item.id] ?? "not_started"}
                onChange={(e) => setCredentialStatus(user.id, item.id, e.target.value as ChecklistStatus)}
              >
                {(Object.keys(STATUS_LABEL) as ChecklistStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </NativeSelect>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function Skills() {
  const user = useCurrentUser();
  const hydrated = useHydrated();
  return (
    <>
      <PageHeader eyebrow="Track 1 · Skills & Credentials" title="Show what you know and what you have done" text="Record your qualifications and experience, mark what needs recognition and work through the steps towards it." />
      <div className="container-page py-12">
        {user ? <Editor user={user} /> : hydrated ? <SignInPrompt text="Create a profile to record your qualifications, skills and languages and to track your credential checklist." /> : null}
      </div>
      <section className="bg-surface py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Guidance" title="Pathways to recognition" text="General information to help you ask the right questions. Requirements differ by country and profession." />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {CREDENTIAL_GUIDANCE.map((g) => (
              <Panel key={g.title}>
                <h3 className="font-semibold">{g.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{g.text}</p>
              </Panel>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
