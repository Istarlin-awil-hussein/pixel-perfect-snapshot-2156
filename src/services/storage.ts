import { useSyncExternalStore } from "react";
import type { Database } from "@/types";
import { seedDatabase } from "@/data/seed";

/**
 * Demo-mode persistence: everything lives in this browser's localStorage.
 * Services are the only callers; pages never touch localStorage directly, so a hosted
 * backend can replace this module without changing the pages.
 */
const KEY = "talentbridge.demo.v1";
const serverState: Database = seedDatabase();
let state: Database = serverState;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...seedDatabase(), ...(JSON.parse(raw) as Partial<Database>) };
  } catch {
    state = seedDatabase();
  }
}

export function getDb(): Database {
  load();
  return state;
}

export function updateDb(fn: (db: Database) => Database) {
  load();
  state = fn(state);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: the session still works in memory.
  }
  listeners.forEach((l) => l());
}

export function resetDb() {
  updateDb(() => seedDatabase());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function useDb(): Database {
  return useSyncExternalStore(subscribe, getDb, () => serverState);
}

const noop = () => () => {};
/** False during server rendering and hydration, true afterwards. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

export function uid(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function logActivity(db: Database, text: string): Database {
  return {
    ...db,
    activity: [{ id: uid(), text, at: new Date().toISOString() }, ...db.activity].slice(0, 60),
  };
}
