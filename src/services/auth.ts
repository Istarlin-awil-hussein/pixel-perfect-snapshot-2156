import type { Role, User } from "@/types";
import { DEMO_ADMIN_ID, DEMO_SEEKER_ID } from "@/data/seed";
import { getDb, logActivity, uid, updateDb, useDb } from "./storage";

/** Demo mode only. A browser-side digest keeps plain passwords out of storage; it is not secure authentication. */
async function digest(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(`talentbridge-demo:${password}`);
  const buf = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

export type AuthResult = { ok: true; user: User } | { ok: false; error: string };

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: Exclude<Role, "admin">;
  country: string;
  field: string;
  educationLevel: string;
  skills: string[];
  years: number;
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const email = input.email.trim().toLowerCase();
  if (getDb().users.some((u) => u.email.toLowerCase() === email)) {
    return { ok: false, error: "An account with this email already exists. Try logging in instead." };
  }
  const user: User = {
    id: uid(),
    name: input.name.trim(),
    email,
    passwordHash: await digest(input.password),
    role: input.role,
    country: input.country,
    field: input.field,
    educationLevel: input.educationLevel,
    skills: input.skills,
    softSkills: [],
    years: input.years,
    bio: "",
    education: [],
    certifications: [],
    experience: [],
    languages: [],
    portfolio: [],
    createdAt: new Date().toISOString(),
    demo: false,
  };
  updateDb((db) => logActivity({ ...db, users: [...db.users, user], sessionUserId: user.id }, `${user.name} created an account`));
  return { ok: true, user };
}

export async function login(emailRaw: string, password: string): Promise<AuthResult> {
  const email = emailRaw.trim().toLowerCase();
  const user = getDb().users.find((u) => u.email.toLowerCase() === email);
  if (!user || !user.passwordHash || user.passwordHash !== (await digest(password))) {
    return { ok: false, error: "The email or password is not correct." };
  }
  updateDb((db) => ({ ...db, sessionUserId: user.id }));
  return { ok: true, user };
}

/** Opens a clearly labelled demonstration account. No password is involved. */
export function loginDemo(kind: "seeker" | "admin") {
  const id = kind === "admin" ? DEMO_ADMIN_ID : DEMO_SEEKER_ID;
  updateDb((db) => ({ ...db, sessionUserId: id }));
}

export function logout() {
  updateDb((db) => ({ ...db, sessionUserId: null }));
}

export function useCurrentUser(): User | null {
  const db = useDb();
  return db.users.find((u) => u.id === db.sessionUserId) ?? null;
}
