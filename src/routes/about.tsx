import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, Scale, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel, SectionHeading } from "@/components/site/ui";
import { SDGS, TRACKS } from "@/data/constants";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About TalentBridge – Three tracks for displaced talent" },
      { name: "description", content: "The problem TalentBridge addresses, its three solution tracks and how it contributes to SDGs 4, 8, 10, 16 and 17." },
      { property: "og:title", content: "About TalentBridge" },
      { property: "og:description", content: "Three solution tracks that connect displaced professionals with recognition, readiness and networks." },
    ],
  }),
  component: About,
});

const ICONS = [GraduationCap, Scale, Users];
const BARRIERS = [
  ["Unrecognised qualifications", "Degrees and licences earned elsewhere are often not understood or accepted."],
  ["Legal and financial hurdles", "Work authorisation, contracts, banking and payments can be hard to navigate."],
  ["Limited local experience", "Employers look for local references that newcomers have not had the chance to build."],
  ["Restricted networks", "Many roles are filled through contacts that displaced professionals do not yet have."],
] as const;

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Unlocking Displaced Talent: Pathways for Skilled Refugees"
        text="Millions of displaced professionals hold degrees, technical skills and years of experience. TalentBridge exists so that this talent is seen, understood and put to work."
      />
      <section className="container-page py-16">
        <SectionHeading eyebrow="The problem" title="Skilled, experienced and still locked out" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BARRIERS.map(([t, d]) => (
            <Panel key={t}>
              <h3 className="font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </Panel>
          ))}
        </div>
      </section>
      <section className="bg-surface py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Our solution" title="Three core solution tracks" text="Each track answers one group of barriers and has its own section of the platform." />
          <div className="mt-8 grid gap-5">
            {TRACKS.map((t, i) => {
              const Icon = ICONS[i] ?? Users;
              return (
                <Panel key={t.id} className="flex flex-col gap-5 md:flex-row md:items-center">
                  <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand text-primary-foreground"><Icon className="size-7" aria-hidden /></span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-teal-strong">Track {t.id}</p>
                    <h3 className="text-xl font-semibold">{t.title}</h3>
                    <p className="mt-1 text-muted-foreground">{t.text}</p>
                  </div>
                  <Button asChild variant="outline"><Link to={t.to}>Open this track</Link></Button>
                </Panel>
              );
            })}
          </div>
        </div>
      </section>
      <section className="container-page py-16">
        <SectionHeading eyebrow="SDG alignment" title="How TalentBridge contributes" />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {SDGS.map((g) => (
            <Panel key={g.n} className="flex gap-5">
              <span className="font-display text-5xl font-extrabold text-brand">{g.n}</span>
              <div>
                <h3 className="font-semibold">SDG {g.n} – {g.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{g.text}</p>
              </div>
            </Panel>
          ))}
        </div>
      </section>
      <section className="bg-surface py-16">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Who it is for" title="Built with dignity in mind" />
            <p className="mt-4 text-muted-foreground">
              TalentBridge serves displaced job seekers, employers who hire on skills, and mentors who want to share what they know. People are never asked for refugee
              identification numbers or identity documents, and nobody is ranked by nationality or displacement status.
            </p>
          </div>
          <Panel>
            <h3 className="font-semibold">What TalentBridge does not do</h3>
            <ul className="mt-3 grid list-disc gap-2 pl-5 text-sm text-muted-foreground">
              <li>It does not officially verify certificates. Qualifications are entered by each person.</li>
              <li>It does not authorise employment or give legal advice.</li>
              <li>In this demonstration, listings, mentors and figures are samples, and data stays in your browser.</li>
            </ul>
          </Panel>
        </div>
      </section>
    </>
  );
}
