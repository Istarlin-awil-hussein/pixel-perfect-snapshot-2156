import { describe, expect, it } from "vitest";
import { matchScore } from "@/services/jobs";
import { profileCompletion } from "@/services/profile";
import { seedDatabase } from "@/data/seed";

describe("skills match", () => {
  it("is the share of a job's required skills the person has", () => {
    expect(matchScore(["React", "SQL"], ["React", "TypeScript", "SQL", "Git"])).toBe(50);
  });

  it("ignores case and spacing", () => {
    expect(matchScore([" react ", "GIT"], ["React", "Git"])).toBe(100);
  });

  it("is zero when the person has no skills or the job lists none", () => {
    expect(matchScore([], ["React"])).toBe(0);
    expect(matchScore(["React"], [])).toBe(0);
  });
});

describe("profile completion", () => {
  it("is 100% for a fully filled profile and lower for a bare one", () => {
    const users = seedDatabase().users;
    const full = users.find((u) => u.id === "demo-seeker");
    const bare = users.find((u) => u.id === "demo-admin");
    expect(full && profileCompletion(full)).toBe(100);
    expect(bare && profileCompletion(bare)).toBe(38);
  });
});

describe("demo listings", () => {
  it("cover all eleven professional categories", () => {
    expect(new Set(seedDatabase().jobs.map((j) => j.field)).size).toBe(11);
  });
});
