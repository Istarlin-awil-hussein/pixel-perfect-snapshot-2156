import type { Resource } from "@/types";
import { logActivity, uid, updateDb } from "./storage";

export type ResourceInput = Omit<Resource, "id">;

export function addResource(input: ResourceInput) {
  updateDb((db) => logActivity({ ...db, resources: [{ ...input, id: uid() }, ...db.resources] }, `Resource added: ${input.title}`));
}

export function updateResource(id: string, input: ResourceInput) {
  updateDb((db) => ({ ...db, resources: db.resources.map((r) => (r.id === id ? { ...r, ...input } : r)) }));
}

export function removeResource(id: string) {
  updateDb((db) => ({ ...db, resources: db.resources.filter((r) => r.id !== id) }));
}
