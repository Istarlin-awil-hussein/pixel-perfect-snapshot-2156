import { Bookmark, BookmarkCheck, Briefcase, CalendarDays, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Job } from "@/types";
import { DemoBadge, MatchPill, formatDate } from "./ui";

interface Props {
  job: Job;
  match?: number | undefined;
  saved?: boolean;
  applied?: boolean;
  onSave?: () => void;
  onOpen: () => void;
}

export function JobCard({ job, match, saved, applied, onSave, onOpen }: Props) {
  return (
    <article className="flex h-full flex-col rounded-2xl border bg-card p-5 shadow-card transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <DemoBadge />
        {match !== undefined ? <MatchPill score={match} /> : null}
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug">{job.title}</h3>
      <p className="text-sm text-muted-foreground">{job.organization}</p>
      <ul className="mt-3 grid gap-1.5 text-sm text-muted-foreground">
        <li className="flex items-center gap-2"><MapPin className="size-4 text-teal-strong" aria-hidden />{job.location === job.country || job.location === "Remote" ? job.country : `${job.location}, ${job.country}`} · {job.workMode}</li>
        <li className="flex items-center gap-2"><Briefcase className="size-4 text-teal-strong" aria-hidden />{job.jobType} · {job.level} level</li>
        <li className="flex items-center gap-2"><CalendarDays className="size-4 text-teal-strong" aria-hidden />Apply by {formatDate(job.deadline)}</li>
      </ul>
      <p className="mt-3 line-clamp-2 text-sm">{job.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {job.skills.slice(0, 4).map((s) => (
          <Badge key={s} variant="muted">{s}</Badge>
        ))}
      </div>
      <div className="mt-auto flex items-center gap-2 pt-5">
        <Button className="flex-1" onClick={onOpen} variant={applied ? "soft" : "default"}>
          {applied ? "Applied · view" : "View & apply"}
        </Button>
        {onSave ? (
          <Button variant="outline" size="icon" onClick={onSave} aria-label={saved ? `Remove ${job.title} from saved` : `Save ${job.title}`} aria-pressed={saved}>
            {saved ? <BookmarkCheck className="text-primary" aria-hidden /> : <Bookmark aria-hidden />}
          </Button>
        ) : null}
      </div>
    </article>
  );
}
