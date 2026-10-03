/**
 * Single source of truth for every piece of text on the site.
 * Everything here is transcribed from the résumé (public/Arun-Bondalapati-CV.pdf).
 * Components only read from this file; nothing is invented.
 */

export type NavItem = { id: string; label: string };

export type Skill = {
  /** Two-letter "element" symbol used on the periodic-table tile. */
  symbol: string;
  name: string;
  /** Key in TechLogo's BRAND or CONCEPT map. */
  logo: string;
  /** Project ids that use this skill (see PROJECTS). */
  projects: string[];
};

export type SkillGroup = { family: string; skills: Skill[] };

export type ExperienceItem = {
  id: string;
  kind: "experience" | "education";
  year: string;
  title: string;
  place: string;
  location: string;
  detail: string;
  bullets?: string[];
  /** Sortable start date, YYYY-MM. */
  start: string;
};

export type Project = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  description: string;
  features: string[];
  tech: string[];
  /** Which illustrative mini-UI to draw (pure CSS, grayscale). */
  illustration: "agents" | "pipeline" | "dupes" | "migration" | "sso" | "report" | "triage";
  github?: string;
};

export type Certification = { title: string; issuer: string; year?: string };

export type Achievement = {
  id: string;
  label: string;
  caption: string;
  detail: string;
  /** Numeric value that counts up. */
  value: number;
  prefix?: string;
  suffix?: string;
  /** TechLogo key for the 72px tile. */
  logo: string;
};

export const PROFILE = {
  name: "Arun Bondalapati",
  firstName: "Arun",
  initials: "AB",
  role: "CRM Technical Lead",
  headline:
    "CRM Technical Lead | AI Automation, Integration & CRM/GTM Systems | Salesforce + HubSpot",
  tagline: "AI automation, integration and CRM/GTM systems. Salesforce + HubSpot.",
  email: "arun.bondalapati@gmail.com",
  phone: "+44 7448 141510",
  phoneHref: "tel:+447448141510",
  location: "Bristol, United Kingdom",
  resumeSummary:
    "I run LLM agents in production and build what they run on. Nine years on the Salesforce platform, the last five leading CRM engineering at GDS Group: keeping Salesforce and HubSpot agreeing, around seven scheduled agents working the live systems, and the AI automation and internal software on top, built with Claude Code and MCP. As a single engineer I have shipped 60+ internal tools into production, each owned end to end from build and deployment to access control and support. 4x Salesforce Certified with an MSc in Advanced Computer Science. Seeking AI automation, integration, RevOps or solutions engineering roles.",
  /** One extra short line, from the résumé's "Leadership & ways of working". */
  extraLine:
    "Work in the open: dry-run defaults, read-back verification and visible agent actions, so every automated change can be checked by a person.",
  /** Paraphrase of the résumé's own wording (used as the About quote). */
  quote:
    "Every automated change should be visible, dry-run first, and checkable by a person.",
  /** Not present in the résumé, so these stay undefined and their buttons are not rendered. */
  github: undefined as string | undefined,
  linkedin: undefined as string | undefined,
  resume: "Arun-Bondalapati-CV.pdf",
  resumeFileName: "Arun-Bondalapati-CV.pdf",
  /** Graduation year of the MSc. */
  gradYear: "2022",
  department: "CRM Engineering",
  currentRole: "CRM Technical Lead, GDS Group",
  since: "2017",
  seeking: "AI automation, integration, RevOps or solutions engineering roles",
} as const;

export const NAV: NavItem[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    family: "Salesforce",
    skills: [
      { symbol: "Ap", name: "Apex", logo: "salesforce", projects: ["deal-to-order", "sso", "triage"] },
      { symbol: "Lw", name: "Lightning Web Components", logo: "salesforce", projects: ["sso"] },
      { symbol: "Fl", name: "Flow", logo: "salesforce", projects: ["deal-to-order"] },
      { symbol: "Sq", name: "SOQL", logo: "salesforce", projects: ["migration", "dupes"] },
      { symbol: "Sc", name: "Sales Cloud", logo: "salesforce", projects: ["deal-to-order", "triage"] },
      { symbol: "Sv", name: "Service Cloud", logo: "salesforce", projects: [] },
      { symbol: "Ra", name: "REST / Bulk 2.0 / SOAP APIs", logo: "api", projects: ["migration", "deal-to-order"] },
      { symbol: "To", name: "Tooling API", logo: "salesforce", projects: ["sso"] },
      { symbol: "Af", name: "Agentforce", logo: "salesforce", projects: ["triage"] },
      { symbol: "Oa", name: "Org administration", logo: "admin", projects: [] },
      { symbol: "Rm", name: "Release management", logo: "release", projects: [] },
    ],
  },
  {
    family: "HubSpot",
    skills: [
      { symbol: "Pa", name: "Private apps", logo: "hubspot", projects: ["deal-to-order", "dupes"] },
      { symbol: "Ux", name: "UI extensions (React / TypeScript cards)", logo: "hubspot", projects: ["dupes"] },
      { symbol: "Wh", name: "Webhooks", logo: "webhook", projects: ["deal-to-order"] },
      { symbol: "Wf", name: "Workflows", logo: "hubspot", projects: ["deal-to-order"] },
      { symbol: "Im", name: "Imports and deduplication", logo: "hubspot", projects: ["migration", "dupes"] },
      { symbol: "Dq", name: "Data quality", logo: "quality", projects: ["dupes"] },
    ],
  },
  {
    family: "AI & automation",
    skills: [
      { symbol: "Cc", name: "Claude Code", logo: "claude", projects: ["agents", "sso", "report"] },
      { symbol: "Mc", name: "MCP (Model Context Protocol)", logo: "mcp", projects: ["agents"] },
      { symbol: "La", name: "Scheduled LLM agents with tool connectors", logo: "agent", projects: ["agents"] },
      { symbol: "Ba", name: "Browser automation for API-less admin screens", logo: "browser", projects: ["agents"] },
      { symbol: "Za", name: "Zapier", logo: "zapier", projects: [] },
      { symbol: "Ad", name: "Agentforce design", logo: "salesforce", projects: ["triage"] },
    ],
  },
  {
    family: "Engineering",
    skills: [
      { symbol: "No", name: "Node.js", logo: "nodejs", projects: ["agents", "deal-to-order", "sso"] },
      { symbol: "Ts", name: "TypeScript", logo: "typescript", projects: ["agents", "deal-to-order", "sso", "dupes", "report"] },
      { symbol: "Js", name: "JavaScript", logo: "javascript", projects: ["sso", "report"] },
      { symbol: "Re", name: "React", logo: "react", projects: ["dupes", "sso", "report"] },
      { symbol: "Ve", name: "Vercel serverless", logo: "vercel", projects: ["deal-to-order", "sso"] },
      { symbol: "Gh", name: "GitHub", logo: "github", projects: ["sso"] },
      { symbol: "En", name: "Entra ID (OIDC, PKCE)", logo: "entra", projects: ["sso"] },
      { symbol: "Mg", name: "Microsoft Graph", logo: "graph", projects: ["sso", "agents"] },
      { symbol: "Sl", name: "SQL", logo: "sql", projects: ["report"] },
      { symbol: "Jw", name: "Signed JWT sessions", logo: "jwt", projects: ["sso"] },
    ],
  },
  {
    family: "Integration & data",
    skills: [
      { symbol: "Iw", name: "Idempotent webhooks", logo: "webhook", projects: ["deal-to-order"] },
      { symbol: "Rb", name: "Rate-limit backoff", logo: "backoff", projects: ["deal-to-order", "migration"] },
      { symbol: "Rv", name: "Read-back verification", logo: "verify", projects: ["migration", "report"] },
      { symbol: "Dm", name: "Data migration and reconciliation", logo: "migration", projects: ["migration"] },
      { symbol: "Dd", name: "Duplicate detection", logo: "dupes", projects: ["dupes"] },
      { symbol: "Dg", name: "Data governance", logo: "governance", projects: ["dupes"] },
      { symbol: "Rn", name: "Runbooks", logo: "runbook", projects: [] },
    ],
  },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: "birlasoft",
    kind: "experience",
    start: "2017-08",
    year: "Aug 2017 – Feb 2019",
    title: "Salesforce Developer",
    place: "Birlasoft",
    location: "Noida",
    detail:
      "First two years on the Salesforce platform: Apex, configuration and automation on enterprise CRM engagements.",
  },
  {
    id: "capgemini",
    kind: "experience",
    start: "2019-02",
    year: "Feb 2019 – Jan 2020",
    title: "Salesforce Developer",
    place: "Capgemini",
    location: "Hyderabad",
    detail:
      "Developed Apex classes, triggers and Lightning components on the Toyota Australia Community Cloud programme.",
    bullets: [
      "Built the integrations, data model, automation and security configuration aligned to platform standards.",
    ],
  },
  {
    id: "msc",
    kind: "education",
    start: "2020-09",
    year: "2020 – 2022",
    title: "MSc Advanced Computer Science",
    place: "Northumbria University",
    location: "Newcastle upon Tyne",
    detail: "Programme Representative for the cohort.",
  },
  {
    id: "northumbria-intern",
    kind: "experience",
    start: "2021-01",
    year: "Jan 2021 – Jun 2021",
    title: "Salesforce Manager Intern (Developer / Project Manager)",
    place: "Northumbria University",
    location: "Remote",
    detail: "Designed the data model for GDPR-sensitive personal data within a regulated environment.",
    bullets: [
      "Built Lightning components and UI on the Lightning Design System; delivered reports, dashboards and automation.",
      "Planned the project, coordinated the team and kept stakeholders informed through to delivery.",
    ],
  },
  {
    id: "gds",
    kind: "experience",
    start: "2021-08",
    year: "Aug 2021 – Present",
    title: "CRM Technical Lead",
    place: "GDS Group",
    location: "Bristol",
    detail:
      "Lead CRM engineering for a global B2B events business: Salesforce and HubSpot, the integration layer between them, and the AI automation and internal software on top.",
    bullets: [
      "AI agents in production: around seven scheduled LLM agents with tool connectors into Salesforce, monday.com and Microsoft Teams. Each reads current state, applies business rules and takes one visible action: a chat, a digest, a board update.",
      "Agentic delivery: build with Claude Code, MCP connectors into both CRMs and browser automation for API-less admin screens. Shipped 60+ internal web apps and dashboards into production, 37 catalogued behind one SSO-gated directory, plus 10+ in-CRM React / TypeScript cards.",
      "Integration layer: 20+ Salesforce–HubSpot syncs from every minute to nightly and 11 production integrations on one connected app.",
      "Data migration: 250,000+ records migrated and reconciled across the two CRMs.",
      "Org ownership: profiles, permission sets, field-level security, sandboxes, user and licence admin, IT support queue.",
    ],
  },
];

export const EDUCATION = EXPERIENCE.filter((e) => e.kind === "education");

export const PROJECTS: Project[] = [
  {
    id: "agents",
    index: "01",
    title: "Scheduled LLM agent operations",
    kicker: "AI agents in production",
    description:
      "Around seven agents on cron with tool connectors into Salesforce, a work-management platform and Teams. Business rules applied to live board and CRM state; output as chats, digests and board updates.",
    features: [
      "Around seven scheduled agents",
      "Tool connectors into Salesforce, monday.com and Teams",
      "Reads current state, applies business rules",
      "One visible action: a chat, a digest, a board update",
      "Assembles the next event day's crew chat each morning",
      "Work done by hand each morning now runs on schedule",
    ],
    tech: ["claude", "mcp", "nodejs", "typescript", "salesforce"],
    illustration: "agents",
  },
  {
    id: "deal-to-order",
    index: "02",
    title: "Deal-to-order integration",
    kicker: "Three pipelines as code",
    description:
      "Three Salesforce–HubSpot pipelines as code: idempotent external-ID upsert, signed webhooks, sub-second acknowledgement with deferred processing. A deal-stage change becomes an order in seconds, and the duplicate-order race is gone.",
    features: [
      "Idempotent external-ID upsert",
      "Signed webhooks",
      "Sub-second acknowledgement",
      "Deferred processing",
      "Deal-stage change to Salesforce order in seconds",
      "Duplicate-order race ended",
    ],
    tech: ["salesforce", "hubspot", "nodejs", "typescript", "vercel"],
    illustration: "pipeline",
  },
  {
    id: "dupes",
    index: "03",
    title: "Data-quality and duplicate-detection platform",
    kicker: "One rule set",
    description:
      "One rule set across ~198,000 contacts and ~64,000 companies, surfaced as a dashboard and an in-record card. 1,289 duplicate groups traced upstream and fixed at the source rather than cleaned repeatedly.",
    features: [
      "~198,000 contacts scored",
      "~64,000 companies scored",
      "Beyond exact-email matching",
      "Dashboard and in-record card",
      "1,289 duplicate groups traced upstream",
      "Fixed at the source",
    ],
    tech: ["hubspot", "react", "typescript", "salesforce"],
    illustration: "dupes",
  },
  {
    id: "migration",
    index: "04",
    title: "CRM migration and reconciliation programme",
    kicker: "Two CRMs, one customer",
    description:
      "250,000+ records across two CRMs with Bulk API 2.0 write-back of cross-system IDs. Zero-failure, zero-duplicate runs, and both CRMs agree on who a customer is.",
    features: [
      "250,000+ records migrated and reconciled",
      "40,547 contacts created in one zero-failure run",
      "21,097 opportunities migrated with no duplicates",
      "Cross-system IDs written back via Bulk API 2.0",
      "6,682 broken company associations repaired",
      "Both CRMs agree on who a customer is",
    ],
    tech: ["salesforce", "hubspot", "api", "nodejs"],
    illustration: "migration",
  },
  {
    id: "sso",
    index: "05",
    title: "Internal application platform and SSO gateway",
    kicker: "One shared auth layer",
    description:
      "Entra ID OIDC / PKCE, signed JWT sessions, access lists re-checked server-side on every request. 60+ tools in production, 37 catalogued in one directory, on one shared auth layer.",
    features: [
      "Entra ID OIDC / PKCE",
      "Signed JWT sessions",
      "Server-side access lists on every request",
      "60+ tools in production",
      "37 catalogued in one directory",
      "Used daily across the business",
    ],
    tech: ["entra", "jwt", "nodejs", "react", "vercel", "github"],
    illustration: "sso",
  },
  {
    id: "report",
    index: "06",
    title: "Delegate performance reporting engine",
    kicker: "Workbook to live dashboard",
    description:
      "Replaced a 24,000-row weekly workbook with a live dashboard. Validated against 253 of 253 values the workbook had already calculated before release.",
    features: [
      "Replaced a 24,000-row weekly workbook",
      "Live dashboard",
      "Validated against 253 of 253 values",
      "Checked before release",
    ],
    tech: ["react", "typescript", "sql", "claude"],
    illustration: "report",
  },
  {
    id: "triage",
    index: "07",
    title: "Agentforce triage agent",
    kicker: "Design and specification",
    description:
      "Apex invocable actions, topics and test utterances for a Salesforce pipeline-triage agent. Not yet deployed.",
    features: [
      "Apex invocable actions",
      "Topics",
      "Test utterances",
      "Pipeline-triage agent",
      "Design and specification",
      "Not yet deployed",
    ],
    tech: ["salesforce", "api"],
    illustration: "triage",
  },
];

export const CERTIFICATIONS: Certification[] = [
  { title: "Salesforce Certified Platform Developer I", issuer: "Salesforce" },
  { title: "Salesforce Certified Platform App Builder", issuer: "Salesforce" },
  { title: "Salesforce Certified Administrator", issuer: "Salesforce", year: "2019" },
  { title: "Salesforce Certified Associate", issuer: "Salesforce", year: "2023" },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "tools",
    label: "Internal tools shipped",
    caption: "Into production, as a single engineer",
    detail: "37 catalogued behind one SSO-gated directory used daily",
    value: 60,
    suffix: "+",
    logo: "claude",
  },
  {
    id: "records",
    label: "Records migrated",
    caption: "Reconciled across Salesforce and HubSpot",
    detail: "40,547 contacts created in one zero-failure run",
    value: 250000,
    suffix: "+",
    logo: "salesforce",
  },
  {
    id: "contacts",
    label: "Contacts scored",
    caption: "In-house duplicate detection, one rule set",
    detail: "Plus ~64,000 companies, surfaced in-record",
    value: 198000,
    prefix: "~",
    logo: "hubspot",
  },
  {
    id: "syncs",
    label: "Salesforce–HubSpot syncs",
    caption: "From every minute to nightly",
    detail: "11 production integrations on one connected app",
    value: 20,
    suffix: "+",
    logo: "api",
  },
  {
    id: "agents",
    label: "LLM agents in production",
    caption: "On schedule, with tool connectors",
    detail: "Into Salesforce, monday.com and Microsoft Teams",
    value: 7,
    prefix: "~",
    logo: "mcp",
  },
  {
    id: "validated",
    label: "Values validated",
    caption: "Reporting engine checked before release",
    detail: "Replaced a 24,000-row weekly workbook",
    value: 253,
    suffix: " / 253",
    logo: "verify",
  },
  {
    id: "certs",
    label: "Salesforce certified",
    caption: "Developer I, App Builder, Administrator, Associate",
    detail: "MSc Advanced Computer Science, Northumbria University",
    value: 4,
    suffix: "x",
    logo: "salesforce",
  },
  {
    id: "years",
    label: "Years on Salesforce",
    caption: "The last five leading CRM engineering",
    detail: "Birlasoft, Capgemini, Northumbria, GDS Group",
    value: 9,
    logo: "salesforce",
  },
];

/** Lines for the back of the ID card, all from the résumé. */
export const ID_CARD_BACK: string[] = [
  "CRM Technical Lead at GDS Group",
  "MSc Advanced Computer Science, Northumbria University",
  "4x Salesforce Certified",
  "Nine years on the Salesforce platform",
  "60+ internal tools shipped into production",
];

export const QUICK_FACTS: { label: string; value: string; href?: string }[] = [
  { label: "Based in", value: PROFILE.location },
  { label: "Education", value: "MSc Advanced Computer Science" },
  { label: "Currently", value: PROFILE.currentRole },
  { label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}` },
];
