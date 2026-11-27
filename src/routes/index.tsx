import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, BookOpen, Building2, GraduationCap, Handshake, HeartHandshake, Scale, Search, Sparkles, UserRoundPlus, Users } from "lucide-react";
import heroImg from "@/assets/hero-bridge.jpg";
import mentorImg from "@/assets/mentorship.jpg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/site/JobCard";
import { DemoBadge, SectionHeading } from "@/components/site/ui";
import { SDGS, TRACKS } from "@/data/constants";
import { useDb } from "@/services/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TalentBridge – Unlock Your Talent. Discover Your Opportunities." },
      { name: "description", content: "TalentBridge helps displaced professionals showcase their skills, connect with employers and mentors, and build meaningful careers." },
      { property: "og:title", content: "TalentBridge – Unlock Your Talent. Discover Your Opportunities." },
      { property: "og:description", content: "Your Skills Deserve Recognition. Your Future Deserves Opportunity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STEPS = [
  { icon: UserRoundPlus, title: "Create your profile", text: "Record your education, skills and experience in your own words." },
  { icon: BadgeCheck, title: "Prepare your credentials", text: "Follow a checklist towards recognition, assessment or certification." },
  { icon: Search, title: "Find matching work", text: "See opportunities ranked by how well they fit your skills." },
  { icon: Handshake, title: "Grow your network", text: "Request a mentor and learn how work is done locally." },
];

const TRACK_ICONS = [GraduationCap, Scale, Users];

const PARTNERS = [
  { icon: Building2, title: "Employers", text: "Hire on skills and proven experience." },
  { icon: GraduationCap, title: "Educators", text: "Offer bridging courses and assessments." },
  { icon: HeartHandshake, title: "Community organisations", text: "Reach and support professionals locally." },
  { icon: Users, title: "Mentors", text: "Share experience and open doors." },
];

function Index() {
  const db = useDb();
  const featured = db.jobs.slice(0, 3);
  const stats = [
    { value: db.jobs.length, label: "Sample opportunities" },
    { value: new Set(db.jobs.map((j) => j.field)).size, label: "Professional fields" },
    { value: db.mentors.length, label: "Sample mentors" },
    { value: db.resources.length, label: "Learning resources" },
  ];

  return (
    <>
      <section className="bg-hero text-navy-foreground">
        <div className="container-page grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_1fr]">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/20 bg-navy-foreground/5 px-3 py-1 text-sm text-navy-muted">
              <Sparkles className="size-4 text-teal" aria-hidden /> Unlocking Displaced Talent
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              Unlock Your Talent. <span className="text-teal">Discover Your Opportunities.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-navy-muted">
              Your education, skills and professional experience matter. TalentBridge helps displaced professionals showcase their abilities, connect with employers and
              build meaningful careers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/register">Create Your Profile <ArrowRight aria-hidden /></Link>
              </Button>
              <Button asChild variant="heroOutline" size="xl">
                <Link to="/opportunities">Explore Opportunities</Link>
              </Button>
            </div>
          </div>
          <div className="relative animate-fade-up [animation-delay:150ms]">
            <img
              src={heroImg}
              alt="Professionals from different fields walking across a bridge towards a city"
              width={1536}
              height={1024}
              className="w-full rounded-3xl border border-navy-foreground/15 shadow-elegant"
            />
            <div className="absolute -bottom-5 left-5 hidden animate-float rounded-2xl bg-card px-4 py-3 text-card-foreground shadow-elegant sm:block">
              <p className="text-xs text-muted-foreground">Estimated skills match</p>
              <p className="font-display text-2xl font-bold text-primary">75%</p>
            </div>
          </div>
        </div>
        <div className="border-t border-navy-foreground/10">
          <div className="container-page flex flex-wrap items-center gap-x-10 gap-y-4 py-6">
            <DemoBadge>Demonstration data</DemoBadge>
            {stats.map((s) => (
              <p key={s.label} className="text-sm text-navy-muted">
                <span className="mr-2 font-display text-2xl font-bold text-navy-foreground">{s.value}</span>
                {s.label}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <SectionHeading center eyebrow="How TalentBridge Works" title="Four steps from skills to work" />
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="rounded-2xl border bg-card p-6 shadow-card">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary"><s.icon className="size-5" aria-hidden /></span>
                <span className="font-display text-3xl font-bold text-border">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Our Three Solution Tracks" title="Removing the barriers between talent and work" />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {TRACKS.map((t, i) => {
              const Icon = TRACK_ICONS[i] ?? Users;
              return (
                <Link key={t.id} to={t.to} className="group rounded-2xl border bg-card p-7 shadow-card transition-transform hover:-translate-y-1">
                  <span className="grid size-12 place-items-center rounded-xl bg-brand text-primary-foreground"><Icon className="size-6" aria-hidden /></span>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-teal-strong">Track {t.id}</p>
                  <h3 className="mt-1 text-xl font-semibold">{t.title}</h3>
                  <p className="mt-2 text-muted-foreground">{t.text}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Explore <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Featured Jobs" title="Opportunities matched to skills" text="Sample listings that show how matching works." />
          <Button asChild variant="outline"><Link to="/opportunities">See all opportunities <ArrowRight aria-hidden /></Link></Button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((job) => (
            <FeaturedJob key={job.id} jobId={job.id} />
          ))}
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Skills and Credential Recognition" title="Your qualifications, clearly presented" text="Record degrees, certificates, experience and languages, flag what needs recognition and follow a readiness checklist step by step." />
            <ul className="mt-6 grid gap-3">
              {["Qualification recognition", "Skills assessment", "Bridging courses", "Alternative evidence of experience"].map((t) => (
                <li key={t} className="flex items-center gap-3"><BadgeCheck className="size-5 text-teal-strong" aria-hidden />{t}</li>
              ))}
            </ul>
            <Button asChild className="mt-7"><Link to="/skills">Open Skills & Credentials</Link></Button>
          </div>
          <div className="rounded-3xl border bg-card p-6 shadow-card">
            <p className="text-sm font-semibold text-muted-foreground">Credential readiness</p>
            {[["Gather the documents you have", "Completed", "success"], ["Arrange translations", "In progress", "teal"], ["Identify the recognition body", "Not started", "muted"]].map(([t, s, v]) => (
              <div key={t} className="mt-3 flex items-center justify-between gap-3 rounded-xl border bg-background px-4 py-3">
                <span className="text-sm font-medium">{t}</span>
                <Badge variant={v as "success" | "teal" | "muted"}>{s}</Badge>
              </div>
            ))}
            <p className="mt-4 text-xs text-muted-foreground">Qualifications are entered by you. TalentBridge does not verify certificates.</p>
          </div>
        </div>
      </section>

      <section className="container-page grid items-center gap-12 py-20 lg:grid-cols-2">
        <img src={mentorImg} alt="A mentor and mentee talking at a table with a colleague on a video call" width={1536} height={1024} loading="lazy" className="w-full rounded-3xl border shadow-card" />
        <div>
          <SectionHeading eyebrow="Career Mentorship" title="Learn from people who know the path" text="Browse mentors by profession, read their background and send a request in a few lines." />
          <Button asChild className="mt-7"><Link to="/mentorship">Meet the mentors</Link></Button>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Professional Development" title="Short guides for the next step" />
            <Button asChild variant="outline"><Link to="/resources">Open the resource centre</Link></Button>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {db.resources.slice(0, 3).map((r) => (
              <Link key={r.id} to="/resources" className="rounded-2xl border bg-card p-6 shadow-card transition-transform hover:-translate-y-1">
                <BookOpen className="size-6 text-primary" aria-hidden />
                <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-teal-strong">{r.category} · {r.minutes} min</p>
                <h3 className="mt-1 text-lg font-semibold">{r.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{r.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <SectionHeading center eyebrow="SDG Impact" title="Contributing to five Sustainable Development Goals" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {SDGS.map((g) => (
            <div key={g.n} className="rounded-2xl border bg-card p-5 shadow-card">
              <span className="font-display text-4xl font-extrabold text-brand">{g.n}</span>
              <h3 className="mt-2 font-semibold leading-snug">{g.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{g.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page">
          <SectionHeading center eyebrow="Partners and Community" title="Built to be shared" text="TalentBridge is designed for the people and organisations who open doors." />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PARTNERS.map((p) => (
              <div key={p.title} className="rounded-2xl border bg-card p-6 text-center shadow-card">
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-teal-soft text-teal-strong"><p.icon className="size-6" aria-hidden /></span>
                <h3 className="mt-4 font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="rounded-3xl bg-hero px-6 py-14 text-center text-navy-foreground md:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold md:text-4xl">Your Skills Deserve Recognition. Your Future Deserves Opportunity.</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="hero" size="xl"><Link to="/register">Create Your Profile</Link></Button>
            <Button asChild variant="heroOutline" size="xl"><Link to="/about">About TalentBridge</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}

function FeaturedJob({ jobId }: { jobId: string }) {
  const navigate = Route.useNavigate();
  const job = useDb().jobs.find((j) => j.id === jobId);
  if (!job) return null;
  return <JobCard job={job} onOpen={() => void navigate({ to: "/opportunities", search: { job: job.id } })} />;
}
