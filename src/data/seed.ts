import type { Application, Database, Job, Mentor, Resource, User } from "@/types";

const job = (
  id: string,
  title: string,
  organization: string,
  country: string,
  location: string,
  workMode: Job["workMode"],
  jobType: Job["jobType"],
  field: string,
  level: Job["level"],
  skills: string[],
  deadline: string,
  description: string,
): Job => ({
  id, title, organization, country, location, workMode, jobType, field, level, skills, deadline, description,
  createdAt: "2026-11-01T09:00:00.000Z",
});

/** Fictional organisations. Every listing is shown as a demonstration listing. */
const JOBS: Job[] = [
  job("j1", "Frontend Developer", "Meridian Labs", "Kenya", "Nairobi", "Hybrid", "Full-time", "Software Development", "Mid", ["React", "TypeScript", "CSS", "Git"], "2027-01-15", "Build accessible web interfaces for a learning product used by community organisations. You will work with designers and a small engineering team."),
  job("j2", "Backend Engineer", "Harbourline Systems", "Germany", "Berlin", "Remote", "Full-time", "Software Development", "Senior", ["Node.js", "PostgreSQL", "API Design", "Docker", "Git"], "2027-01-31", "Design and maintain services that power a logistics platform. Experience from any country is welcome and assessed through a practical task."),
  job("j3", "IT Support Specialist", "Brightpath Cooperative", "Uganda", "Kampala", "Onsite", "Full-time", "Information Technology", "Entry", ["Troubleshooting", "Networking", "Customer Support", "Windows"], "2026-12-20", "Support staff with hardware, accounts and connectivity across two offices. Training on internal tools is provided."),
  job("j4", "Cloud Systems Administrator", "Northfield Digital", "Canada", "Toronto", "Remote", "Contract", "Information Technology", "Mid", ["Linux", "AWS", "Networking", "Security"], "2027-02-10", "Keep cloud infrastructure reliable and secure for a group of non-profit clients. Six-month contract with possible extension."),
  job("j5", "Data Analyst", "Clearwater Insights", "Jordan", "Amman", "Hybrid", "Full-time", "Data Analysis", "Mid", ["SQL", "Excel", "Data Visualization", "Python"], "2027-01-08", "Turn programme data into clear dashboards and reports that help teams decide where to focus."),
  job("j6", "Junior Data Associate", "Openfield Research", "Kenya", "Remote", "Remote", "Part-time", "Data Analysis", "Entry", ["Excel", "Data Entry", "Attention to Detail", "SQL"], "2026-12-28", "Clean and check survey data for research projects. Flexible hours, around 20 per week."),
  job("j7", "Digital Marketing Coordinator", "Tidewater Studio", "Netherlands", "Rotterdam", "Hybrid", "Full-time", "Digital Marketing", "Mid", ["Social Media", "Content Writing", "SEO", "Analytics"], "2027-01-22", "Plan and run campaigns across social, search and email for small businesses."),
  job("j8", "Finance Officer", "Summit Bridge Foundation", "Uganda", "Kampala", "Onsite", "Full-time", "Finance", "Mid", ["Accounting", "Budgeting", "Excel", "Financial Reporting"], "2027-01-12", "Manage monthly accounts, budgets and donor financial reports for a community foundation."),
  job("j9", "Bookkeeper", "Lanternworks Trading", "Jordan", "Remote", "Remote", "Part-time", "Finance", "Entry", ["Bookkeeping", "Excel", "Invoicing", "Accounting"], "2027-02-01", "Keep records up to date and prepare invoices for a small trading company."),
  job("j10", "Project Manager", "Coastline Partners", "United Kingdom", "Manchester", "Hybrid", "Full-time", "Project Management", "Senior", ["Project Planning", "Stakeholder Management", "Budgeting", "Risk Management", "Agile"], "2027-01-30", "Lead delivery of multi-partner programmes from planning to evaluation."),
  job("j11", "Health Records Administrator", "Willowgate Clinic Network", "Germany", "Hamburg", "Onsite", "Full-time", "Healthcare Administration", "Mid", ["Records Management", "Data Entry", "Confidentiality", "Scheduling"], "2027-01-18", "Maintain accurate patient records and coordinate appointments. This is a non-clinical role."),
  job("j12", "Community Development Officer", "Roothold Initiative", "Kenya", "Kakuma", "Onsite", "Full-time", "Community Development", "Mid", ["Community Mobilisation", "Facilitation", "Reporting", "Project Planning"], "2026-12-30", "Work alongside community groups to design and run livelihood activities."),
  job("j13", "Programme Assistant", "Farhaven Relief", "Ethiopia", "Addis Ababa", "Onsite", "Contract", "Humanitarian Work", "Entry", ["Reporting", "Logistics", "Data Entry", "Communication"], "2027-01-05", "Support field teams with logistics, reporting and coordination meetings."),
  job("j14", "Online Mathematics Tutor", "Stepstone Learning", "Canada", "Remote", "Remote", "Part-time", "Education", "Mid", ["Teaching", "Mathematics", "Lesson Planning", "Communication"], "2027-02-15", "Teach secondary-level mathematics to small online groups in the evenings."),
  job("j15", "Operations Coordinator", "Ironbark Supply", "Rwanda", "Kigali", "Hybrid", "Full-time", "Business Administration", "Mid", ["Operations", "Scheduling", "Excel", "Communication", "Procurement"], "2027-01-25", "Keep daily operations running across procurement, scheduling and reporting."),
];

const MENTORS: Mentor[] = [
  { id: "m1", name: "Daniel O.", area: "Software Development", years: 12, bio: "Engineering lead who rebuilt his career after relocating. Helps developers prepare portfolios and technical interviews.", skills: ["React", "System Design", "Interview Preparation"], availability: "2 sessions per month" },
  { id: "m2", name: "Leila R.", area: "Data Analysis", years: 9, bio: "Analyst working with public-sector data. Enjoys helping people move into data roles from other fields.", skills: ["SQL", "Data Visualization", "Career Change"], availability: "Weekly, evenings" },
  { id: "m3", name: "Grace M.", area: "Finance", years: 15, bio: "Chartered accountant with experience across three countries. Guides mentees through certification pathways.", skills: ["Accounting", "Professional Certification", "Budgeting"], availability: "2 sessions per month" },
  { id: "m4", name: "Yusuf A.", area: "Project Management", years: 11, bio: "Programme manager in the non-profit sector. Focuses on planning skills and stakeholder communication.", skills: ["Project Planning", "Stakeholder Management", "Agile"], availability: "Fortnightly" },
  { id: "m5", name: "Sofia K.", area: "Healthcare Administration", years: 8, bio: "Clinic operations manager. Shares practical advice on entering health administration with foreign qualifications.", skills: ["Records Management", "Credential Recognition", "Scheduling"], availability: "Monthly" },
  { id: "m6", name: "Peter N.", area: "Education", years: 20, bio: "Former head teacher, now a teacher trainer. Supports educators with local registration and classroom practice.", skills: ["Teaching", "Lesson Planning", "Professional Registration"], availability: "Weekly, mornings" },
  { id: "m7", name: "Amira S.", area: "Digital Marketing", years: 7, bio: "Freelance marketer working with clients in several countries. Mentors on finding remote clients and invoicing.", skills: ["SEO", "Freelancing", "Content Writing"], availability: "2 sessions per month" },
  { id: "m8", name: "Jean-Paul B.", area: "Humanitarian Work", years: 14, bio: "Field coordinator with experience in community programmes. Helps mentees translate lived experience into professional strengths.", skills: ["Reporting", "Community Mobilisation", "Logistics"], availability: "Monthly" },
];

const RESOURCES: Resource[] = [
  { id: "r1", title: "A CV that travels across borders", description: "Structure your experience so recruiters in a new country understand it quickly.", category: "CV Writing", minutes: 6, content: ["Start with a three-line summary: your profession, your years of experience and the kind of role you want next. Recruiters often decide in seconds whether to keep reading.", "Describe each role with results rather than duties. Add one line of context for employers that may be unfamiliar, such as the size of the organisation or the people it served.", "List qualifications with their original title and, where you know it, the closest local equivalent. Keep the CV to two pages and leave out personal details that are not required, such as date of birth or marital status."] },
  { id: "r2", title: "Explaining gaps in your work history", description: "Honest, confident ways to present time spent relocating or waiting for documents.", category: "CV Writing", minutes: 4, content: ["A gap is not a weakness when it is explained simply. One line such as 'Relocation and language study, 2023 to 2024' is enough.", "Mention what you did in that time: volunteering, courses, caring for family or informal work all show responsibility and initiative.", "In interviews, answer briefly and move to what you can contribute now."] },
  { id: "r3", title: "Answering 'tell me about yourself'", description: "A simple three-part structure for the most common opening question.", category: "Interview Preparation", minutes: 5, content: ["Use present, past, future. Present: what you do and are good at. Past: one or two experiences that prove it. Future: why this role is the right next step.", "Keep it under two minutes and practise aloud until it sounds natural rather than memorised.", "Prepare two short stories that show how you solved a problem. They can be reused for many other questions."] },
  { id: "r4", title: "Preparing for a video interview", description: "Set up your space, your connection and your answers.", category: "Interview Preparation", minutes: 4, content: ["Test your camera, microphone and connection the day before. Have a phone number ready in case the call drops.", "Sit facing a window or lamp, with a plain background. Look at the camera when speaking.", "Keep notes beside the screen with your key points and two questions for the interviewer."] },
  { id: "r5", title: "Spreadsheets for everyday work", description: "The core spreadsheet skills that most office roles expect.", category: "Digital Skills", minutes: 7, content: ["Learn to sort and filter, use basic formulas such as SUM and AVERAGE, and format tables so they are easy to read.", "Lookups and pivot tables come next. They let you summarise long lists in seconds and are asked about in many interviews.", "Practise with your own data, for example a household budget or a job-application tracker."] },
  { id: "r6", title: "Writing clear professional emails", description: "Be understood the first time, in any language.", category: "Communication", minutes: 4, content: ["Put the purpose in the first sentence and the request in the last. Use short paragraphs.", "Choose a subject line that says what the email is about and what you need.", "If you are writing in a second language, simple words are a strength. Read the message aloud once before sending."] },
  { id: "r7", title: "Working well with a remote team", description: "Habits that build trust when you never meet in person.", category: "Remote Work", minutes: 5, content: ["Agree on working hours and response times early. Say when you are unavailable.", "Share progress without being asked: a short written update at the end of the day prevents most misunderstandings.", "Plan for unreliable power or internet with offline work you can do and a backup way to reach your team."] },
  { id: "r8", title: "Your first budget with a new income", description: "A straightforward method for planning monthly money.", category: "Financial Literacy", minutes: 6, content: ["Write down your income after deductions, then list fixed costs such as rent, transport and phone.", "Set aside a small amount for emergencies before planning other spending. Even a little, saved regularly, builds security.", "Review the budget at the end of each month and adjust. The aim is awareness, not perfection."] },
  { id: "r9", title: "From skill to small business", description: "Test a business idea with little money and low risk.", category: "Entrepreneurship", minutes: 7, content: ["Begin with one service and one type of customer. Offer it to a few people and ask for honest feedback.", "Track every cost and every payment from the first day. Check which registrations or permits apply where you live.", "Grow only when customers return or recommend you."] },
  { id: "r10", title: "Mapping your transferable skills", description: "Find the strengths that move with you from one career or country to another.", category: "Career Development", minutes: 5, content: ["List tasks you did often in previous roles, then name the skill behind each one: negotiating, planning, teaching, analysing.", "Compare the list with three job adverts you like. Mark the skills you already have and the two or three you need to build.", "Turn the missing skills into a short learning plan with dates."] },
  { id: "r11", title: "How qualification recognition works", description: "An overview of the usual steps and what to ask.", category: "Credential Recognition", minutes: 6, content: ["Find out whether your profession is regulated where you live. Regulated professions need formal recognition before you can practise.", "Contact the responsible body and ask which documents, translations and fees are required, and whether alternatives exist when documents are missing.", "While you wait, look for related roles that do not require recognition so your experience stays current."] },
  { id: "r12", title: "Building a network from zero", description: "Practical first steps when you know no one in your field locally.", category: "Professional Networking", minutes: 5, content: ["Join one professional association or online community in your field and introduce yourself with a short, specific message.", "Ask people for advice rather than for a job. A twenty-minute conversation often leads to an introduction.", "Follow up with thanks and keep a simple list of who you spoke to and what you learned."] },
];

const blankUser = (u: Partial<User> & Pick<User, "id" | "name" | "email" | "role" | "createdAt">): User => ({
  passwordHash: "",
  country: "Kenya",
  field: "Software Development",
  educationLevel: "Bachelor's degree",
  skills: [],
  softSkills: [],
  years: 0,
  bio: "",
  education: [],
  certifications: [],
  experience: [],
  languages: [],
  portfolio: [],
  demo: true,
  ...u,
});

export const DEMO_SEEKER_ID = "demo-seeker";
export const DEMO_ADMIN_ID = "demo-admin";

const USERS: User[] = [
  blankUser({
    id: DEMO_SEEKER_ID, name: "Samira Demo", email: "seeker@demo.talentbridge", role: "seeker", createdAt: "2026-09-12T10:00:00.000Z",
    country: "Kenya", field: "Software Development", years: 6,
    skills: ["React", "TypeScript", "SQL", "Git", "Python"], softSkills: ["Communication", "Teamwork", "Problem Solving"],
    bio: "Frontend developer with six years of experience building web applications for education and health projects.",
    education: [{ id: "e1", qualification: "BSc Computer Science", institution: "University of Aleppo", country: "Other", year: "2017", needsRecognition: true }],
    certifications: [{ id: "c1", name: "Responsive Web Design", issuer: "Online course provider", year: "2024" }],
    experience: [{ id: "x1", title: "Web Developer", organization: "Community technology centre", country: "Jordan", period: "2018 – 2023", description: "Built and maintained learning portals used by local schools." }],
    languages: [{ id: "l1", name: "Arabic", level: "Fluent or native" }, { id: "l2", name: "English", level: "Professional" }],
    portfolio: ["https://example.com/samira-portfolio"],
  }),
  blankUser({ id: DEMO_ADMIN_ID, name: "Demo Administrator", email: "admin@demo.talentbridge", role: "admin", createdAt: "2026-06-01T10:00:00.000Z" }),
  blankUser({ id: "u3", name: "Ahmed K. (demo)", email: "ahmed@demo.talentbridge", role: "seeker", createdAt: "2026-06-18T10:00:00.000Z", field: "Data Analysis", country: "Uganda", skills: ["SQL", "Excel", "Python", "Data Visualization"], years: 4 }),
  blankUser({ id: "u4", name: "Nyabol D. (demo)", email: "nyabol@demo.talentbridge", role: "seeker", createdAt: "2026-07-03T10:00:00.000Z", field: "Finance", country: "Kenya", skills: ["Accounting", "Excel", "Budgeting"], years: 8 }),
  blankUser({ id: "u5", name: "Farid H. (demo)", email: "farid@demo.talentbridge", role: "seeker", createdAt: "2026-07-22T10:00:00.000Z", field: "Education", country: "Germany", skills: ["Teaching", "Lesson Planning", "Communication"], years: 11 }),
  blankUser({ id: "u6", name: "Meridian Labs (demo)", email: "hiring@demo.talentbridge", role: "employer", createdAt: "2026-08-05T10:00:00.000Z", field: "Software Development" }),
  blankUser({ id: "u7", name: "Hodan A. (demo)", email: "hodan@demo.talentbridge", role: "seeker", createdAt: "2026-08-19T10:00:00.000Z", field: "Healthcare Administration", country: "Canada", skills: ["Records Management", "Scheduling", "Data Entry"], years: 5 }),
  blankUser({ id: "u8", name: "Grace M. (demo)", email: "grace@demo.talentbridge", role: "mentor", createdAt: "2026-09-02T10:00:00.000Z", field: "Finance", skills: ["Accounting", "Budgeting"], years: 15 }),
  blankUser({ id: "u9", name: "Tesfaye B. (demo)", email: "tesfaye@demo.talentbridge", role: "seeker", createdAt: "2026-10-09T10:00:00.000Z", field: "Project Management", country: "Ethiopia", skills: ["Project Planning", "Budgeting", "Reporting", "Excel"], years: 9 }),
  blankUser({ id: "u10", name: "Coastline Partners (demo)", email: "jobs@demo.talentbridge", role: "employer", createdAt: "2026-10-21T10:00:00.000Z", field: "Project Management" }),
  blankUser({ id: "u11", name: "Rana S. (demo)", email: "rana@demo.talentbridge", role: "seeker", createdAt: "2026-11-04T10:00:00.000Z", field: "Digital Marketing", country: "Jordan", skills: ["SEO", "Content Writing", "Social Media", "Excel"], years: 3 }),
  blankUser({ id: "u12", name: "Emmanuel L. (demo)", email: "emmanuel@demo.talentbridge", role: "seeker", createdAt: "2026-11-15T10:00:00.000Z", field: "Information Technology", country: "Rwanda", skills: ["Networking", "Linux", "Troubleshooting"], years: 7 }),
];

const app = (id: string, userId: string, jobId: string, status: Application["status"], createdAt: string): Application => ({
  id, userId, jobId, status, note: "", createdAt,
});

export function seedDatabase(): Database {
  return {
    users: USERS,
    sessionUserId: null,
    jobs: JOBS,
    applications: [
      app("a1", DEMO_SEEKER_ID, "j1", "Under review", "2026-11-10T09:00:00.000Z"),
      app("a2", DEMO_SEEKER_ID, "j2", "Submitted", "2026-11-20T09:00:00.000Z"),
      app("a3", "u3", "j5", "Shortlisted", "2026-11-08T09:00:00.000Z"),
      app("a4", "u4", "j8", "Interview", "2026-11-12T09:00:00.000Z"),
      app("a5", "u5", "j14", "Accepted", "2026-10-28T09:00:00.000Z"),
      app("a6", "u7", "j11", "Submitted", "2026-11-18T09:00:00.000Z"),
      app("a7", "u9", "j10", "Rejected", "2026-11-02T09:00:00.000Z"),
      app("a8", "u11", "j7", "Under review", "2026-11-21T09:00:00.000Z"),
    ],
    savedJobs: [{ userId: DEMO_SEEKER_ID, jobId: "j6" }],
    mentors: MENTORS,
    mentorshipRequests: [
      { id: "q1", mentorId: "m1", userId: DEMO_SEEKER_ID, message: "I would value advice on preparing for technical interviews.", status: "Pending", createdAt: "2026-11-19T09:00:00.000Z" },
      { id: "q2", mentorId: "m3", userId: "u4", message: "Looking for guidance on accounting certification.", status: "Accepted", createdAt: "2026-11-05T09:00:00.000Z" },
    ],
    resources: RESOURCES,
    credentialChecklist: { [DEMO_SEEKER_ID]: { collect: "completed", translate: "in_progress" } },
    readinessChecklist: { [DEMO_SEEKER_ID]: ["status", "account"] },
    activity: [
      { id: "s3", text: "Rana S. (demo) applied for Digital Marketing Coordinator", at: "2026-11-21T09:00:00.000Z" },
      { id: "s2", text: "Samira Demo applied for Backend Engineer", at: "2026-11-20T09:00:00.000Z" },
      { id: "s1", text: "Samira Demo requested mentorship from Daniel O.", at: "2026-11-19T09:00:00.000Z" },
    ],
  };
}
