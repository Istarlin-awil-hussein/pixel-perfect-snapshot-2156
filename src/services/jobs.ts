import type { Job } from "@/types";
import { logActivity, uid, updateDb } from "./storage";

const norm = (s: string) => s.trim().toLowerCase();

/**
 * Estimated match: the share of a job's required skills that appear in the person's
 * skills, as a whole percentage. Comparison ignores case and surrounding spaces.
 */
export function matchScore(userSkills: string[], jobSkills: string[]): number {
  const required = jobSkills.map(norm).filter(Boolean);
  if (required.length === 0) return 0;
  const have = new Set(userSkills.map(norm).filter(Boolean));
  const hits = required.filter((s) => have.has(s)).length;
  return Math.round((hits / required.length) * 100);
}

export function missingSkills(userSkills: string[], jobSkills: string[]): string[] {
  const have = new Set(userSkills.map(norm));
  return jobSkills.filter((s) => !have.has(norm(s)));
}

export function toggleSavedJob(userId: string, jobId: string): boolean {
  let saved = false;
  updateDb((db) => {
    const exists = db.savedJobs.some((s) => s.userId === userId && s.jobId === jobId);
    saved = !exists;
    return {
      ...db,
      savedJobs: exists
        ? db.savedJobs.filter((s) => !(s.userId === userId && s.jobId === jobId))
        : [...db.savedJobs, { userId, jobId }],
    };
  });
  return saved;
}

export type JobInput = Omit<Job, "id" | "createdAt">;

export function addJob(input: JobInput) {
  updateDb((db) =>
    logActivity(
      { ...db, jobs: [{ ...input, id: uid(), createdAt: new Date().toISOString() }, ...db.jobs] },
      `Listing added: ${input.title}`,
    ),
  );
}

export function updateJob(id: string, input: JobInput) {
  updateDb((db) => ({ ...db, jobs: db.jobs.map((j) => (j.id === id ? { ...j, ...input } : j)) }));
}

export function removeJob(id: string) {
  updateDb((db) =>
    logActivity(
      {
        ...db,
        jobs: db.jobs.filter((j) => j.id !== id),
        applications: db.applications.filter((a) => a.jobId !== id),
        savedJobs: db.savedJobs.filter((s) => s.jobId !== id),
      },
      "A listing was removed",
    ),
  );
}
