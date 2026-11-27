import type { ApplicationStatus } from "@/types";
import { getDb, logActivity, uid, updateDb } from "./storage";

export function applyToJob(userId: string, jobId: string, note: string): { ok: boolean; error?: string } {
  const db = getDb();
  if (db.applications.some((a) => a.userId === userId && a.jobId === jobId)) {
    return { ok: false, error: "You have already applied for this opportunity." };
  }
  const user = db.users.find((u) => u.id === userId);
  const job = db.jobs.find((j) => j.id === jobId);
  if (!user || !job) return { ok: false, error: "This opportunity is no longer available." };
  updateDb((d) =>
    logActivity(
      {
        ...d,
        applications: [
          { id: uid(), userId, jobId, status: "Submitted", note, createdAt: new Date().toISOString() },
          ...d.applications,
        ],
      },
      `${user.name} applied for ${job.title}`,
    ),
  );
  return { ok: true };
}

export function setApplicationStatus(id: string, status: ApplicationStatus) {
  updateDb((db) => ({
    ...db,
    applications: db.applications.map((a) => (a.id === id ? { ...a, status } : a)),
  }));
}

export function withdrawApplication(id: string) {
  updateDb((db) => ({ ...db, applications: db.applications.filter((a) => a.id !== id) }));
}
