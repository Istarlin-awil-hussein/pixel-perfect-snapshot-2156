import type { ApplicationStatus, ExperienceLevel, JobType, WorkMode } from "@/types";

export const FIELDS = [
  "Software Development",
  "Information Technology",
  "Data Analysis",
  "Digital Marketing",
  "Finance",
  "Project Management",
  "Healthcare Administration",
  "Community Development",
  "Humanitarian Work",
  "Education",
  "Business Administration",
] as const;

export const COUNTRIES = [
  "Kenya",
  "Uganda",
  "Ethiopia",
  "Rwanda",
  "Tanzania",
  "Somalia",
  "South Sudan",
  "Sudan",
  "Egypt",
  "Jordan",
  "Lebanon",
  "Türkiye",
  "Germany",
  "Netherlands",
  "Sweden",
  "United Kingdom",
  "Canada",
  "United States",
  "Australia",
  "Other",
] as const;

export const EDUCATION_LEVELS = [
  "Secondary school",
  "Vocational or technical diploma",
  "Bachelor's degree",
  "Master's degree",
  "Doctorate",
  "Professional certification",
] as const;

export const LANGUAGE_LEVELS = ["Basic", "Conversational", "Professional", "Fluent or native"] as const;

export const WORK_MODES: WorkMode[] = ["Remote", "Onsite", "Hybrid"];
export const JOB_TYPES: JobType[] = ["Full-time", "Part-time", "Contract"];
export const LEVELS: ExperienceLevel[] = ["Entry", "Mid", "Senior"];

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "Submitted",
  "Under review",
  "Shortlisted",
  "Interview",
  "Rejected",
  "Accepted",
];

export const RESOURCE_CATEGORIES = [
  "CV Writing",
  "Interview Preparation",
  "Digital Skills",
  "Communication",
  "Remote Work",
  "Financial Literacy",
  "Entrepreneurship",
  "Career Development",
  "Credential Recognition",
  "Professional Networking",
] as const;

export const ROLE_LABELS = {
  seeker: "Job seeker",
  employer: "Employer",
  mentor: "Mentor",
  admin: "Administrator",
} as const;

export const SDGS = [
  { n: 4, title: "Quality Education", text: "Learning resources, bridging-course guidance and mentoring keep skills current and visible." },
  { n: 8, title: "Decent Work and Economic Growth", text: "Skills-based matching connects qualified people with fair, productive work." },
  { n: 10, title: "Reduced Inequalities", text: "Talent is assessed on skills and experience, never on nationality or displacement status." },
  { n: 16, title: "Peace, Justice and Strong Institutions", text: "Clear, honest guidance on documentation and contracts supports lawful, dignified employment." },
  { n: 17, title: "Partnerships for the Goals", text: "Employers, mentors, educators and community organisations work through one shared platform." },
] as const;

export const TRACKS = [
  {
    id: 1,
    title: "Credential Recognition & Skills Validation",
    text: "Showcase qualifications, skills and work experience, with guidance on recognition and certification pathways.",
    to: "/skills",
  },
  {
    id: 2,
    title: "Legal, Regulatory & Financial Access",
    text: "Work-readiness resources, contract education, financial literacy and onboarding guidance.",
    to: "/readiness",
  },
  {
    id: 3,
    title: "Local Experience & Professional Networks",
    text: "Connect with mentors, employers, opportunities and professional communities.",
    to: "/mentorship",
  },
] as const;
