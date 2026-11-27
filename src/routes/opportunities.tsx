import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, Briefcase, CalendarDays, FileText, MapPin, Search, SearchX } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { JobCard } from "@/components/site/JobCard";
import { DemoBadge, EmptyState, MatchPill, NativeSelect, PageHeader, Panel, SignInPrompt, StatusBadge, formatDate } from "@/components/site/ui";
import { FIELDS, JOB_TYPES, LEVELS, WORK_MODES } from "@/data/constants";
import { applyToJob, withdrawApplication } from "@/services/applications";
import { useCurrentUser } from "@/services/auth";
import { matchScore, missingSkills, toggleSavedJob } from "@/services/jobs";
import { useDb } from "@/services/storage";
import type { Job, User } from "@/types";

export const Route = createFileRoute("/opportunities")({
  validateSearch: (s: Record<string, unknown>): { job?: string } => (typeof s["job"] === "string" ? { job: s["job"] } : {}),
  head: () => ({
    meta: [
      { title: "Opportunities – TalentBridge" },
      { name: "description", content: "Search and filter sample opportunities across eleven professional fields and see your estimated skills match." },
      { property: "og:title", content: "Opportunities – TalentBridge" },
      { property: "og:description", content: "Search opportunities by country, field, work mode and experience level, with an estimated skills match." },
    ],
  }),
  component: Opportunities,
});

const EMPTY = { q: "", country: "", location: "", field: "", workMode: "", jobType: "", level: "" };

function Opportunities() {
  const db = useDb();
  const user = useCurrentUser();
  const { job: openId } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [f, setF] = useState(EMPTY);
  const set = (k: keyof typeof EMPTY) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));

  const countries = useMemo(() => [...new Set(db.jobs.map((j) => j.country))].sort(), [db.jobs]);
  const locations = useMemo(
    () => [...new Set(db.jobs.filter((j) => !f.country || j.country === f.country).map((j) => j.location))].sort(),
    [db.jobs, f.country],
  );
  const showMatch = Boolean(user && user.skills.length > 0);
  const scoreOf = (j: Job) => (user && showMatch ? matchScore(user.skills, j.skills) : undefined);

  const results = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const list = db.jobs.filter(
      (j) =>
        (!q || [j.title, j.organization, j.description, j.location, j.country, j.field, ...j.skills].join(" ").toLowerCase().includes(q)) &&
        (!f.country || j.country === f.country) &&
        (!f.location || j.location === f.location) &&
        (!f.field || j.field === f.field) &&
        (!f.workMode || j.workMode === f.workMode) &&
        (!f.jobType || j.jobType === f.jobType) &&
        (!f.level || j.level === f.level),
    );
    if (!user || user.skills.length === 0) return list;
    return [...list].sort((a, b) => matchScore(user.skills, b.skills) - matchScore(user.skills, a.skills));
  }, [db.jobs, f, user]);

  const savedIds = new Set(db.savedJobs.filter((s) => s.userId === user?.id).map((s) => s.jobId));
  const myApps = db.applications.filter((a) => a.userId === user?.id);
  const appliedIds = new Set(myApps.map((a) => a.jobId));
  const saved = db.jobs.filter((j) => savedIds.has(j.id));
  const openJob = db.jobs.find((j) => j.id === openId);

  const open = (id?: string) => void navigate({ search: id ? { job: id } : {}, replace: true, resetScroll: false });
  const save = (j: Job) => {
    if (!user) {
      toast.info("Log in to save opportunities.", { action: { label: "Log in", onClick: () => void navigate({ to: "/login" }) } });
      return;
    }
    toast.success(toggleSavedJob(user.id, j.id) ? "Saved to your list." : "Removed from saved.");
  };
  const card = (j: Job) => (
    <JobCard key={j.id} job={j} match={scoreOf(j)} saved={savedIds.has(j.id)} applied={appliedIds.has(j.id)} onSave={() => save(j)} onOpen={() => open(j.id)} />
  );

  return (
    <>
      <PageHeader eyebrow="Opportunities" title="Find work that fits your skills" text="Every listing here is a demonstration listing from a fictional organisation, shown to illustrate how matching works." />
      <div className="container-page py-10">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All opportunities</TabsTrigger>
            <TabsTrigger value="saved">Saved ({saved.length})</TabsTrigger>
            <TabsTrigger value="applications">My applications ({myApps.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <Panel>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input aria-label="Search opportunities" placeholder="Search by title, skill, organisation or place" value={f.q} onChange={set("q")} className="h-11 pl-9" />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                {(
                  [
                    ["country", "Country", countries],
                    ["location", "Location", locations],
                    ["field", "Professional field", FIELDS],
                    ["workMode", "Remote or onsite", WORK_MODES],
                    ["jobType", "Job type", JOB_TYPES],
                    ["level", "Experience level", LEVELS],
                  ] as const
                ).map(([key, label, options]) => (
                  <div key={key} className="space-y-1">
                    <Label htmlFor={`f-${key}`} className="text-xs text-muted-foreground">{label}</Label>
                    <NativeSelect id={`f-${key}`} value={f[key]} onChange={set(key)}>
                      <option value="">All</option>
                      {options.map((o) => <option key={o}>{o}</option>)}
                    </NativeSelect>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                <p aria-live="polite">
                  {results.length} {results.length === 1 ? "opportunity" : "opportunities"}
                  {showMatch ? " · sorted by your estimated match" : ""}
                </p>
                <Button variant="ghost" size="sm" onClick={() => setF(EMPTY)}>Clear filters</Button>
              </div>
            </Panel>
            {!showMatch ? (
              <p className="mt-4 rounded-xl bg-primary-soft px-4 py-3 text-sm text-primary">
                {user ? "Add skills to your profile to see an estimated match for each opportunity." : "Log in and add your skills to see an estimated match for each opportunity."}{" "}
                <Link to={user ? "/profile" : "/login"} className="font-semibold underline">{user ? "Edit profile" : "Log in"}</Link>
              </p>
            ) : null}
            {results.length ? (
              <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{results.map(card)}</div>
            ) : (
              <div className="mt-6">
                <EmptyState icon={SearchX} title="No opportunities match" text="Try a different search word or remove a filter.">
                  <Button onClick={() => setF(EMPTY)}>Clear filters</Button>
                </EmptyState>
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            {!user ? (
              <SignInPrompt text="Log in to keep a list of opportunities you want to come back to." />
            ) : saved.length ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{saved.map(card)}</div>
            ) : (
              <EmptyState icon={Bookmark} title="Nothing saved yet" text="Use the bookmark on any opportunity to keep it here." />
            )}
          </TabsContent>

          <TabsContent value="applications" className="mt-6">
            {!user ? (
              <SignInPrompt text="Log in to apply and follow the status of your applications." />
            ) : myApps.length ? (
              <div className="grid gap-3">
                {myApps.map((a) => {
                  const j = db.jobs.find((x) => x.id === a.jobId);
                  if (!j) return null;
                  return (
                    <Panel key={a.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                      <div>
                        <h3 className="font-semibold">{j.title}</h3>
                        <p className="text-sm text-muted-foreground">{j.organization} · applied {formatDate(a.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={a.status} />
                        <Button variant="outline" size="sm" onClick={() => open(j.id)}>View</Button>
                        <Button variant="ghost" size="sm" onClick={() => { withdrawApplication(a.id); toast.success("Application withdrawn."); }}>Withdraw</Button>
                      </div>
                    </Panel>
                  );
                })}
              </div>
            ) : (
              <EmptyState icon={FileText} title="No applications yet" text="When you apply for an opportunity it appears here with its status." />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={Boolean(openJob)} onOpenChange={(o) => !o && open()}>
        {openJob ? <JobDialog job={openJob} user={user} saved={savedIds.has(openJob.id)} onSave={() => save(openJob)} /> : null}
      </Dialog>
    </>
  );
}

function JobDialog({ job, user, saved, onSave }: { job: Job; user: User | null; saved: boolean; onSave: () => void }) {
  const db = useDb();
  const [note, setNote] = useState("");
  const application = db.applications.find((a) => a.userId === user?.id && a.jobId === job.id);
  const missing = user ? missingSkills(user.skills, job.skills) : [];

  const apply = () => {
    if (!user) return;
    const res = applyToJob(user.id, job.id, note.trim());
    if (res.ok) toast.success("Application submitted. Track it under My applications.");
    else toast.error(res.error ?? "Something went wrong.");
  };

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader>
        <div className="flex flex-wrap items-center gap-2">
          <DemoBadge />
          {user && user.skills.length ? <MatchPill score={matchScore(user.skills, job.skills)} /> : null}
        </div>
        <DialogTitle className="text-2xl">{job.title}</DialogTitle>
        <DialogDescription>{job.organization} · {job.field}</DialogDescription>
      </DialogHeader>
      <ul className="grid gap-2 text-sm sm:grid-cols-2">
        <li className="flex items-center gap-2"><MapPin className="size-4 text-teal-strong" aria-hidden />{job.location}, {job.country} · {job.workMode}</li>
        <li className="flex items-center gap-2"><Briefcase className="size-4 text-teal-strong" aria-hidden />{job.jobType} · {job.level} level</li>
        <li className="flex items-center gap-2"><CalendarDays className="size-4 text-teal-strong" aria-hidden />Apply by {formatDate(job.deadline)}</li>
      </ul>
      <p>{job.description}</p>
      <div>
        <h3 className="text-sm font-semibold">Required skills</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {job.skills.map((s) => (
            <Badge key={s} variant={user && !missing.includes(s) ? "success" : "muted"}>{s}</Badge>
          ))}
        </div>
        {user && missing.length > 0 && missing.length < job.skills.length ? (
          <p className="mt-2 text-sm text-muted-foreground">Skills to build or add to your profile: {missing.join(", ")}.</p>
        ) : null}
      </div>
      {application ? (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-surface p-4">
          <p className="text-sm">You applied on {formatDate(application.createdAt)}.</p>
          <StatusBadge status={application.status} />
        </div>
      ) : user ? (
        <div className="space-y-2">
          <Label htmlFor="note">Message to the organisation (optional)</Label>
          <Textarea id="note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="A few lines on why you are a good fit." />
        </div>
      ) : (
        <p className="rounded-xl bg-primary-soft px-4 py-3 text-sm text-primary">
          <Link to="/login" className="font-semibold underline">Log in</Link> or <Link to="/register" className="font-semibold underline">create a profile</Link> to apply.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {user && !application ? <Button onClick={apply}>Apply now</Button> : null}
        <Button variant="outline" onClick={onSave}>
          {saved ? <BookmarkCheck aria-hidden /> : <Bookmark aria-hidden />} {saved ? "Saved" : "Save"}
        </Button>
      </div>
    </DialogContent>
  );
}
