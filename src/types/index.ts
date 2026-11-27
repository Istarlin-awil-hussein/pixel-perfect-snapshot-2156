export type Role = "seeker" | "employer" | "mentor" | "admin";
export type ChecklistStatus = "not_started" | "in_progress" | "completed";
export type ApplicationStatus =
  | "Submitted"
  | "Under review"
  | "Shortlisted"
  | "Interview"
  | "Rejected"
  | "Accepted";
export type RequestStatus = "Pending" | "Accepted" | "Declined";
export type WorkMode = "Remote" | "Onsite" | "Hybrid";
export type JobType = "Full-time" | "Part-time" | "Contract";
export type ExperienceLevel = "Entry" | "Mid" | "Senior";

export interface Education {
  id: string;
  qualification: string;
  institution: string;
  country: string;
  year: string;
  needsRecognition: boolean;
}
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}
export interface Experience {
  id: string;
  title: string;
  organization: string;
  country: string;
  period: string;
  description: string;
}
export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  /** Demo mode only: a browser-side digest, not secure authentication. */
  passwordHash: string;
  role: Role;
  country: string;
  field: string;
  educationLevel: string;
  skills: string[];
  softSkills: string[];
  years: number;
  bio: string;
  education: Education[];
  certifications: Certification[];
  experience: Experience[];
  languages: Language[];
  portfolio: string[];
  createdAt: string;
  demo: boolean;
}

export interface Job {
  id: string;
  title: string;
  organization: string;
  country: string;
  location: string;
  workMode: WorkMode;
  jobType: JobType;
  field: string;
  skills: string[];
  level: ExperienceLevel;
  description: string;
  deadline: string;
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: ApplicationStatus;
  note: string;
  createdAt: string;
}

export interface Mentor {
  id: string;
  name: string;
  area: string;
  years: number;
  bio: string;
  skills: string[];
  availability: string;
}

export interface MentorshipRequest {
  id: string;
  mentorId: string;
  userId: string;
  message: string;
  status: RequestStatus;
  createdAt: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  minutes: number;
  content: string[];
}

export interface Activity {
  id: string;
  text: string;
  at: string;
}

export interface Database {
  users: User[];
  sessionUserId: string | null;
  jobs: Job[];
  applications: Application[];
  savedJobs: { userId: string; jobId: string }[];
  mentors: Mentor[];
  mentorshipRequests: MentorshipRequest[];
  resources: Resource[];
  credentialChecklist: Record<string, Record<string, ChecklistStatus>>;
  readinessChecklist: Record<string, string[]>;
  activity: Activity[];
}
