import type { User } from "@/types";
import { updateDb } from "./storage";

export type ProfilePatch = Partial<Omit<User, "id" | "email" | "passwordHash" | "role" | "createdAt" | "demo">>;

export function updateProfile(userId: string, patch: ProfilePatch) {
  updateDb((db) => ({
    ...db,
    users: db.users.map((u) => (u.id === userId ? { ...u, ...patch } : u)),
  }));
}

export function completionItems(user: User): { label: string; done: boolean }[] {
  return [
    { label: "Full name", done: user.name.trim().length > 1 },
    { label: "Country of residence", done: Boolean(user.country) },
    { label: "Professional field", done: Boolean(user.field) },
    { label: "Short professional summary", done: user.bio.trim().length >= 20 },
    { label: "At least three skills", done: user.skills.length >= 3 },
    { label: "Education", done: user.education.length > 0 },
    { label: "Work experience", done: user.experience.length > 0 },
    { label: "Languages", done: user.languages.length > 0 },
  ];
}

/** Share of profile sections filled in, as a whole percentage. */
export function profileCompletion(user: User): number {
  const items = completionItems(user);
  return Math.round((items.filter((i) => i.done).length / items.length) * 100);
}
