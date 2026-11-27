import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Search, SearchX, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DemoBadge, EmptyState, NativeSelect, PageHeader, Panel, SectionHeading, StatusBadge, formatDate } from "@/components/site/ui";
import { FIELDS } from "@/data/constants";
import { useCurrentUser } from "@/services/auth";
import { requestMentorship } from "@/services/mentorship";
import { useDb } from "@/services/storage";
import type { Mentor } from "@/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mentorship")({
  head: () => ({
    meta: [
      { title: "Mentorship & Networking – TalentBridge" },
      { name: "description", content: "Browse sample mentor profiles by profession, request mentorship and follow the status of your requests." },
      { property: "og:title", content: "Mentorship & Networking – TalentBridge" },
      { property: "og:description", content: "Find a mentor in your profession and build a professional network." },
    ],
  }),
  component: Mentorship,
});

function Mentorship() {
  const db = useDb();
  const user = useCurrentUser();
  const [q, setQ] = useState("");
  const [area, setArea] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const mentors = useMemo(() => {
    const s = q.trim().toLowerCase();
    return db.mentors.filter((m) => (!area || m.area === area) && (!s || [m.name, m.area, m.bio, ...m.skills].join(" ").toLowerCase().includes(s)));
  }, [db.mentors, q, area]);
  const myRequests = db.mentorshipRequests.filter((r) => r.userId === user?.id);
  const openMentor = db.mentors.find((m) => m.id === openId);
  const existing = myRequests.find((r) => r.mentorId === openId && r.status !== "Declined");
  const communities = FIELDS.map((f) => ({ field: f, mentors: db.mentors.filter((m) => m.area === f).length, members: db.users.filter((u) => u.field === f).length })).filter((c) => c.mentors + c.members > 0);

  const send = (m: Mentor) => {
    if (!user) return;
    if (message.trim().length < 10) return void toast.error("Write a short message of at least 10 characters.");
    const res = requestMentorship(user.id, m.id, message.trim());
    if (res.ok) {
      toast.success(`Request sent to ${m.name}.`);
      setMessage("");
    } else toast.error(res.error ?? "Something went wrong.");
  };

  return (
    <>
      <PageHeader eyebrow="Track 3 · Mentorship & Networking" title="Guidance from people in your profession" text="Mentor profiles shown here are demonstration accounts that illustrate how mentorship requests work." />
      <div className="container-page py-10">
        {user && myRequests.length ? (
          <Panel className="mb-8">
            <h2 className="text-lg font-semibold">My mentorship requests</h2>
            <ul className="mt-3 grid gap-2">
              {myRequests.map((r) => {
                const m = db.mentors.find((x) => x.id === r.mentorId);
                return (
                  <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-background px-4 py-3 text-sm">
                    <span><span className="font-medium">{m?.name ?? "Mentor"}</span> <span className="text-muted-foreground">· {m?.area} · sent {formatDate(r.createdAt)}</span></span>
                    <StatusBadge status={r.status} />
                  </li>
                );
              })}
            </ul>
          </Panel>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-[1fr_16rem]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input aria-label="Search mentors" placeholder="Search by name, skill or profession" value={q} onChange={(e) => setQ(e.target.value)} className="h-11 pl-9" />
          </div>
          <NativeSelect aria-label="Filter by profession" className="h-11" value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">All professions</option>
            {FIELDS.map((f) => <option key={f}>{f}</option>)}
          </NativeSelect>
        </div>

        {mentors.length ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {mentors.map((m) => (
              <article key={m.id} className="flex flex-col rounded-2xl border bg-card p-5 shadow-card">
                <div className="flex items-start gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-brand font-display text-lg font-bold text-primary-foreground">{m.name.charAt(0)}</span>
                  <div className="min-w-0">
                    <h3 className="font-semibold">{m.name}</h3>
                    <p className="text-sm text-muted-foreground">{m.area} · {m.years} years</p>
                  </div>
                  <DemoBadge>Demo</DemoBadge>
                </div>
                <p className="mt-3 line-clamp-3 text-sm">{m.bio}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">{m.skills.map((s) => <Badge key={s} variant="muted">{s}</Badge>)}</div>
                <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><Clock className="size-4 text-teal-strong" aria-hidden />{m.availability}</p>
                <Button className="mt-4" variant="soft" onClick={() => { setOpenId(m.id); setMessage(""); }}>View profile</Button>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState icon={SearchX} title="No mentors match" text="Try another profession or search word.">
              <Button onClick={() => { setQ(""); setArea(""); }}>Show all mentors</Button>
            </EmptyState>
          </div>
        )}
      </div>

      <section className="bg-surface py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Professional networking" title="Communities by profession" text="Choose a community to see the mentors in that field. Member counts are demonstration data." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {communities.map((c) => (
              <button
                key={c.field}
                type="button"
                onClick={() => { setArea(c.field); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className={cn("rounded-2xl border bg-card p-5 text-left shadow-card transition-transform hover:-translate-y-0.5", area === c.field && "border-primary")}
              >
                <Users className="size-5 text-primary" aria-hidden />
                <p className="mt-3 font-semibold">{c.field}</p>
                <p className="text-sm text-muted-foreground">{c.members} members · {c.mentors} mentors</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={Boolean(openMentor)} onOpenChange={(o) => !o && setOpenId(null)}>
        {openMentor ? (
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
            <DialogHeader>
              <DemoBadge>Demonstration mentor</DemoBadge>
              <DialogTitle className="text-2xl">{openMentor.name}</DialogTitle>
              <DialogDescription>{openMentor.area} · {openMentor.years} years of experience · {openMentor.availability}</DialogDescription>
            </DialogHeader>
            <p>{openMentor.bio}</p>
            <div className="flex flex-wrap gap-1.5">{openMentor.skills.map((s) => <Badge key={s} variant="soft">{s}</Badge>)}</div>
            {!user ? (
              <p className="rounded-xl bg-primary-soft px-4 py-3 text-sm text-primary">
                <Link to="/login" className="font-semibold underline">Log in</Link> or <Link to="/register" className="font-semibold underline">create a profile</Link> to request mentorship.
              </p>
            ) : existing ? (
              <div className="flex items-center justify-between rounded-xl bg-surface p-4 text-sm">
                <span>Your request was sent on {formatDate(existing.createdAt)}.</span>
                <StatusBadge status={existing.status} />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="mentor-message">What would you like help with?</Label>
                <Textarea id="mentor-message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
                <Button onClick={() => send(openMentor)}>Request mentorship</Button>
              </div>
            )}
          </DialogContent>
        ) : null}
      </Dialog>
    </>
  );
}
