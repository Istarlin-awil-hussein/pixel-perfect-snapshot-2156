import type { RequestStatus } from "@/types";
import { getDb, logActivity, uid, updateDb } from "./storage";

export function requestMentorship(userId: string, mentorId: string, message: string): { ok: boolean; error?: string } {
  const db = getDb();
  if (db.mentorshipRequests.some((r) => r.userId === userId && r.mentorId === mentorId && r.status !== "Declined")) {
    return { ok: false, error: "You already have a request with this mentor." };
  }
  const user = db.users.find((u) => u.id === userId);
  const mentor = db.mentors.find((m) => m.id === mentorId);
  if (!user || !mentor) return { ok: false, error: "This mentor is no longer available." };
  updateDb((d) =>
    logActivity(
      {
        ...d,
        mentorshipRequests: [
          { id: uid(), userId, mentorId, message, status: "Pending", createdAt: new Date().toISOString() },
          ...d.mentorshipRequests,
        ],
      },
      `${user.name} requested mentorship from ${mentor.name}`,
    ),
  );
  return { ok: true };
}

export function setRequestStatus(id: string, status: RequestStatus) {
  updateDb((db) => ({
    ...db,
    mentorshipRequests: db.mentorshipRequests.map((r) => (r.id === id ? { ...r, status } : r)),
  }));
}
