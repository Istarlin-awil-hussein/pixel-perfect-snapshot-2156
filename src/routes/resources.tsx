import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Clock, Search, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { EmptyState, PageHeader } from "@/components/site/ui";
import { RESOURCE_CATEGORIES } from "@/data/constants";
import { useDb } from "@/services/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Learning & Resource Centre – TalentBridge" },
      { name: "description", content: "Short guides on CV writing, interviews, digital skills, remote work, financial literacy, credential recognition and networking." },
      { property: "og:title", content: "Learning & Resource Centre – TalentBridge" },
      { property: "og:description", content: "Practical guides for the next step in your career." },
    ],
  }),
  component: Resources,
});

function Resources() {
  const db = useDb();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return db.resources.filter((r) => (!cat || r.category === cat) && (!s || [r.title, r.description, r.category].join(" ").toLowerCase().includes(s)));
  }, [db.resources, q, cat]);
  const openRes = db.resources.find((r) => r.id === openId);

  return (
    <>
      <PageHeader eyebrow="Resources" title="Learning and resource centre" text="Original, practical guides you can read in a few minutes." />
      <div className="container-page py-10">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input aria-label="Search resources" placeholder="Search guides" value={q} onChange={(e) => setQ(e.target.value)} className="h-11 pl-9" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {["", ...RESOURCE_CATEGORIES].map((c) => (
            <button
              key={c || "all"}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={cn("rounded-full border bg-card px-3.5 py-1.5 text-sm font-medium transition-colors hover:bg-accent", cat === c && "border-primary bg-primary text-primary-foreground hover:bg-primary")}
            >
              {c || "All"}
            </button>
          ))}
        </div>
        {list.length ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list.map((r) => (
              <article key={r.id} className="flex flex-col rounded-2xl border bg-card p-6 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-widest text-teal-strong">{r.category}</p>
                <h2 className="mt-2 text-lg font-semibold leading-snug">{r.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>
                <div className="mt-auto flex items-center justify-between pt-5">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><Clock className="size-4" aria-hidden />{r.minutes} min read</span>
                  <Button variant="soft" size="sm" onClick={() => setOpenId(r.id)} aria-label={`Read more: ${r.title}`}>Read more</Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState icon={SearchX} title="No guides match" text="Try another category or search word.">
              <Button onClick={() => { setQ(""); setCat(""); }}>Show all guides</Button>
            </EmptyState>
          </div>
        )}
      </div>
      <Dialog open={Boolean(openRes)} onOpenChange={(o) => !o && setOpenId(null)}>
        {openRes ? (
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-teal-strong"><BookOpen className="size-4" aria-hidden />{openRes.category} · {openRes.minutes} min read</p>
              <DialogTitle className="text-2xl">{openRes.title}</DialogTitle>
              <DialogDescription>{openRes.description}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 leading-relaxed">{openRes.content.map((p, i) => <p key={i}>{p}</p>)}</div>
          </DialogContent>
        ) : null}
      </Dialog>
    </>
  );
}
