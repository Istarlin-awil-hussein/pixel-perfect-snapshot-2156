import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Landmark, Scale } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Field, NativeSelect, PageHeader, Panel, SectionHeading, SignInPrompt } from "@/components/site/ui";
import { COUNTRIES } from "@/data/constants";
import { COUNTRY_RESOURCES, GENERAL_RESOURCES, READINESS_CHECKLIST, READINESS_TOPICS } from "@/data/guidance";
import { useCurrentUser } from "@/services/auth";
import { toggleReadinessItem } from "@/services/checklists";
import { useDb, useHydrated } from "@/services/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/readiness")({
  head: () => ({
    meta: [
      { title: "Work & Financial Readiness – TalentBridge" },
      { name: "description", content: "Educational guidance on work authorization, contracts, invoicing, banking and financial literacy, with an interactive checklist." },
      { property: "og:title", content: "Work & Financial Readiness – TalentBridge" },
      { property: "og:description", content: "Understand documentation, contracts, payments and banking before you start work." },
    ],
  }),
  component: Readiness,
});

function Readiness() {
  const user = useCurrentUser();
  const hydrated = useHydrated();
  const db = useDb();
  const [picked, setPicked] = useState("");
  const country = picked || user?.country || "Kenya";
  const done = user ? (db.readinessChecklist[user.id] ?? []) : [];
  const specific = COUNTRY_RESOURCES[country] ?? [];

  return (
    <>
      <PageHeader eyebrow="Track 2 · Work Readiness" title="Be ready for the practical side of work" text="Plain-language information on documentation, contracts, payments and money. This is education, not legal advice." />
      <div className="container-page py-12">
        <p className="flex items-start gap-3 rounded-xl bg-warning-soft px-4 py-3 text-sm text-warning-foreground">
          <Scale className="mt-0.5 size-4 shrink-0" aria-hidden />
          TalentBridge does not authorise employment or give legal advice. Rules depend on your status and country; confirm them with the responsible authority or a
          qualified adviser.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {READINESS_TOPICS.map((t) => (
            <Panel key={t.id}>
              <h2 className="text-lg font-semibold">{t.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t.text}</p>
            </Panel>
          ))}
        </div>
      </div>

      <section className="bg-surface py-16">
        <div className="container-page grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHeading eyebrow="Interactive checklist" title="Your readiness steps" />
            <div className="mt-6">
              {user ? (
                <Panel>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium">{done.length} of {READINESS_CHECKLIST.length} completed</p>
                    <Progress value={(done.length / READINESS_CHECKLIST.length) * 100} className="w-40" aria-label="Readiness progress" />
                  </div>
                  <ul className="mt-4 grid gap-2">
                    {READINESS_CHECKLIST.map((item) => {
                      const checked = done.includes(item.id);
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={checked}
                            onClick={() => toggleReadinessItem(user.id, item.id)}
                            className={cn("flex w-full items-center gap-3 rounded-xl border bg-background px-4 py-3 text-left text-sm transition-colors hover:bg-accent", checked && "border-success/40 bg-success-soft")}
                          >
                            <span className={cn("grid size-5 shrink-0 place-items-center rounded-md border", checked && "border-success bg-success text-primary-foreground")}>
                              {checked ? <Check className="size-3.5" aria-hidden /> : null}
                            </span>
                            {item.title}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </Panel>
              ) : hydrated ? (
                <SignInPrompt text="Log in to tick off steps and keep your progress." />
              ) : null}
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="By country" title="Where to start" />
            <Panel className="mt-6">
              <Field label="Country of residence" htmlFor="country">
                <NativeSelect id="country" value={country} onChange={(e) => setPicked(e.target.value)}>
                  {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </NativeSelect>
              </Field>
              <ul className="mt-5 grid gap-3">
                {[...specific, ...GENERAL_RESOURCES].map((r) => (
                  <li key={r.name} className="flex gap-3">
                    <Landmark className="mt-0.5 size-4 shrink-0 text-teal-strong" aria-hidden />
                    <div>
                      <p className="text-sm font-medium">{r.name}</p>
                      <p className="text-sm text-muted-foreground">{r.note}</p>
                    </div>
                  </li>
                ))}
              </ul>
              {specific.length === 0 ? <p className="mt-4 text-xs text-muted-foreground">No country-specific starting points are listed for {country} yet, so general ones are shown.</p> : null}
              <p className="mt-4 text-xs text-muted-foreground">Starting points for your own enquiries. Check each organisation directly for current requirements.</p>
            </Panel>
          </div>
        </div>
      </section>
    </>
  );
}
