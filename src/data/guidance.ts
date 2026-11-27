export const CREDENTIAL_CHECKLIST = [
  { id: "collect", title: "Gather the documents you have", text: "Degree certificates, transcripts, reference letters or anything that shows what you studied and did." },
  { id: "translate", title: "Arrange translations where needed", text: "Many recognition bodies ask for translations by an accredited translator." },
  { id: "authority", title: "Identify the recognition body", text: "Find which organisation assesses foreign qualifications for your profession in your country of residence." },
  { id: "assessment", title: "Request a skills or qualification assessment", text: "Ask about fees, timelines and whether fee waivers exist for displaced applicants." },
  { id: "bridge", title: "Explore bridging courses", text: "Short courses can close gaps between your qualification and local requirements." },
  { id: "evidence", title: "Build alternative evidence", text: "Portfolio work, employer references and practical tests can support missing paperwork." },
] as const;

export const CREDENTIAL_GUIDANCE = [
  {
    title: "Qualification recognition",
    text: "Recognition compares your qualification with the local equivalent. Regulated professions such as medicine, law or teaching usually require formal recognition; many others do not.",
  },
  {
    title: "Skills assessment",
    text: "Where documents are missing, practical assessments, structured interviews or work samples can demonstrate competence. Ask the assessing body which formats it accepts.",
  },
  {
    title: "Bridging courses",
    text: "Bridging programmes cover local standards, language for the profession and supervised practice. They are often shorter and cheaper than repeating a full qualification.",
  },
  {
    title: "Professional certification",
    text: "Industry certificates in areas such as cloud computing, accounting or project management are recognised across borders and can be earned online.",
  },
  {
    title: "Alternative evidence of experience",
    text: "Reference letters, payslips, published work, code repositories, photographs of completed projects and sworn statements can all help evidence your experience.",
  },
] as const;

export const READINESS_TOPICS = [
  { id: "authorization", title: "Work authorization", text: "The right to work depends on your status and the country you live in. Confirm what applies to you with the responsible authority or a legal aid organisation before accepting work." },
  { id: "documentation", title: "Employment documentation", text: "Employers commonly ask for proof of identity, proof of the right to work, a tax number and bank details. Ask in advance which alternatives they accept." },
  { id: "contracts", title: "Understanding employment contracts", text: "Read the role, pay, hours, notice period and termination terms carefully. You may ask for time and for a version in a language you read comfortably." },
  { id: "invoicing", title: "Invoicing", text: "Freelancers usually invoice with their name, the client's name, a description of the work, the amount, the date and payment details." },
  { id: "payment", title: "Payment readiness", text: "Agree on currency, payment method and payment dates before starting. Keep records of every payment you receive." },
  { id: "literacy", title: "Financial literacy", text: "A simple monthly budget, an emergency reserve and an understanding of deductions help you plan with a new income." },
  { id: "banking", title: "Banking access", text: "Requirements for opening an account differ by provider. Mobile money and regulated digital accounts can be alternatives where bank access is limited." },
  { id: "remote", title: "Remote employment", text: "Remote roles can widen your options. Check which country's rules apply to the contract, taxes and payments." },
  { id: "compliance", title: "Professional compliance", text: "Some professions require registration or a licence before you can practise. Check with the relevant professional body." },
] as const;

export const READINESS_CHECKLIST = [
  { id: "status", title: "I have checked what my current status allows regarding work" },
  { id: "id", title: "I know which identity and right-to-work documents employers may ask for" },
  { id: "tax", title: "I have found out whether I need a tax number and how to request one" },
  { id: "account", title: "I have a bank, mobile money or regulated digital account for payments" },
  { id: "contract", title: "I can explain the key terms of an employment contract" },
  { id: "invoice", title: "I have prepared a simple invoice template" },
  { id: "budget", title: "I have drafted a monthly budget" },
  { id: "advice", title: "I know where to get free or low-cost legal advice" },
] as const;

export const COUNTRY_RESOURCES: Record<string, { name: string; note: string }[]> = {
  Kenya: [
    { name: "Department of Refugee Services", note: "Government body responsible for refugee documentation." },
    { name: "Kenya National Qualifications Authority", note: "Handles recognition and equation of foreign qualifications." },
  ],
  Uganda: [
    { name: "Office of the Prime Minister, Department of Refugees", note: "Government body responsible for refugee affairs and documentation." },
    { name: "National Council for Higher Education", note: "Handles equating of foreign academic qualifications." },
  ],
  Jordan: [
    { name: "Ministry of Labour", note: "Issues work permits and publishes which sectors are open." },
  ],
  Germany: [
    { name: "Recognition in Germany (Anerkennung in Deutschland)", note: "Official information portal on recognising foreign professional qualifications." },
    { name: "Federal Employment Agency", note: "Advice on job search, work permission and training." },
  ],
  Canada: [
    { name: "Immigration, Refugees and Citizenship Canada", note: "Information on work permits and status." },
    { name: "Canadian Information Centre for International Credentials", note: "Directory of credential assessment services by profession and province." },
  ],
  "United Kingdom": [
    { name: "UK ENIC", note: "National agency for the recognition of international qualifications." },
  ],
};

export const GENERAL_RESOURCES = [
  { name: "UNHCR country office", note: "Can point you to local legal aid and livelihoods partners." },
  { name: "Local legal aid organisations", note: "Offer free or low-cost advice on status and employment rights." },
  { name: "National qualifications authority", note: "The usual starting point for recognition of foreign qualifications." },
];
