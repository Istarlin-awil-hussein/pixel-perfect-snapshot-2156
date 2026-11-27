import type { ChecklistStatus } from "@/types";
import { updateDb } from "./storage";

export function setCredentialStatus(userId: string, itemId: string, status: ChecklistStatus) {
  updateDb((db) => ({
    ...db,
    credentialChecklist: {
      ...db.credentialChecklist,
      [userId]: { ...(db.credentialChecklist[userId] ?? {}), [itemId]: status },
    },
  }));
}

export function toggleReadinessItem(userId: string, itemId: string) {
  updateDb((db) => {
    const current = db.readinessChecklist[userId] ?? [];
    const next = current.includes(itemId) ? current.filter((i) => i !== itemId) : [...current, itemId];
    return { ...db, readinessChecklist: { ...db.readinessChecklist, [userId]: next } };
  });
}
