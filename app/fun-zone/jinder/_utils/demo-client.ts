import type { TEpic, TIssueDetails, TJiraClient, TPriority, TSprint, TUser } from "../_types";

import { textToHtml } from "./adf";

const AVATAR_COLORS: Record<string, string> = {
  "u-alice": "#e8590c",
  "u-bob": "#1971c2",
  "u-carol": "#2f9e44",
  "u-dave": "#9c36b5",
};

const USERS: Array<TUser> = [
  { accountId: "u-alice", displayName: "Alice Frontend" },
  { accountId: "u-bob", displayName: "Bob Backend" },
  { accountId: "u-carol", displayName: "Carol QA" },
  { accountId: "u-dave", displayName: "Dave DevOps" },
].map((user) => ({ ...user, avatarUrl: `/demo/avatar/${user.accountId}` }));

const EPICS: Array<TEpic> = [
  { key: "DEMO-1", summary: "Forms 2.0" },
  { key: "DEMO-2", summary: "Reporting" },
  { key: "DEMO-3", summary: "Infrastructure" },
];

const EXTRA_LABELS = ["backend", "security", "ux", "performance"];

const SCREENSHOT = "/rest/api/3/attachment/content/1";

/** stand-ins for what Jira would serve, so the demo goes through the same image path */
const DEMO_IMAGES: Record<string, () => string> = {
  [SCREENSHOT]:
    () => `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="200" viewBox="0 0 480 200">
    <rect width="480" height="200" rx="12" fill="#f1f3f5" stroke="#adb5bd"/>
    <rect x="24" y="24" width="432" height="28" rx="6" fill="#dee2e6"/>
    <rect x="24" y="68" width="300" height="20" rx="4" fill="#dee2e6"/>
    <rect x="24" y="100" width="260" height="20" rx="4" fill="#dee2e6"/>
    <rect x="336" y="140" width="120" height="36" rx="18" fill="#1971c2"/>
    <text x="396" y="164" font-family="sans-serif" font-size="14" fill="#fff" text-anchor="middle">Save</text>
    <text x="320" y="132" font-family="sans-serif" font-size="13" fill="#c92a2a">click twice ↓</text>
  </svg>`,
  ...Object.fromEntries(
    Object.entries(AVATAR_COLORS).map(([id, color]) => [
      `/demo/avatar/${id}`,
      () => `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="24" fill="${color}"/>
        <circle cx="17" cy="20" r="3" fill="#fff"/><circle cx="31" cy="20" r="3" fill="#fff"/>
        <path d="M15 30 q9 8 18 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
      </svg>`,
    ])
  ),
};

const PRIORITIES: Array<TPriority> = ["Highest", "High", "Medium", "Low", "Lowest"].map(
  (name, i) => ({ id: String(i + 1), name })
);

const SPRINTS: Array<TSprint> = [
  { id: 42, name: "DEMO Sprint 42", state: "future" },
  { id: 43, name: "DEMO Sprint 43", state: "future" },
];

type TSeed = Omit<
  TIssueDetails,
  "descriptionHtml" | "comments" | "priority" | "assignee" | "parent"
> & {
  description: string;
  /** appended as is, for things plain text cannot express */
  html?: string;
  priority: string;
  assignee?: string;
  parent?: string;
  comments?: Array<[string, string]>;
};

const SEED: Array<TSeed> = [
  {
    key: "DEMO-101",
    summary: "The Save button only saves on the second click",
    type: "Bug",
    status: "To Do",
    spilledFrom: "DEMO Sprint 41",
    description:
      "Steps:\n1. Open the profile form\n2. Click Save\n3. Nothing happens, click again\nExpected: saved on the first click.\nActual: users learned to click twice and consider it a feature.",
    html: `<p><img src="${SCREENSHOT}" alt="screenshot.png"></p>`,
    labels: ["frontend", "regression"],
    priority: "High",
    assignee: "u-alice",
    parent: "DEMO-1",
    comments: [
      ["Carol QA", "Only reproduces in Safari. And on the CEO's laptop."],
      ["Alice Frontend", "A 300 ms debounce on onClick. Someone once meant well."],
    ],
    links: [
      { key: "DEMO-87", summary: "Forms refactor", status: "Done", relation: "is caused by" },
    ],
  },
  {
    key: "DEMO-102",
    summary: "Migrate to the new framework version",
    type: "Story",
    status: "To Do",
    spilledFrom: "DEMO Sprint 41",
    description:
      "This issue has been rolling from sprint to sprint since March.\nNobody wants it, nobody closes it.\nDefinition of done: the app works exactly as before, just on newer libraries.",
    labels: ["tech-debt"],
    priority: "Medium",
    comments: [["Bob Backend", "Maybe next sprint."]],
    links: [],
  },
  {
    key: "DEMO-103",
    summary: "Export the report to PDF",
    type: "Story",
    status: "To Do",
    description:
      "As a manager I want to export the report to PDF, so I can print it, scan it and email it.\nAcceptance: the PDF has the company logo in the top right corner.",
    labels: ["reports"],
    priority: "High",
    assignee: "u-bob",
    parent: "DEMO-2",
    links: [
      {
        key: "DEMO-110",
        summary: "New company logo",
        status: "In Progress",
        relation: "is blocked by",
      },
    ],
  },
  {
    key: "DEMO-104",
    summary: "Dark mode",
    type: "Story",
    status: "To Do",
    description: "Users keep asking for dark mode.\nOne user, specifically, but very often.",
    labels: ["frontend", "nice-to-have"],
    priority: "Low",
    links: [],
  },
  {
    key: "DEMO-105",
    summary: "SSL certificate expires in 9 days",
    type: "Task",
    status: "To Do",
    description:
      "Auto-renewal was turned off by someone who no longer works here.\nTurn it back on.",
    labels: ["ops"],
    priority: "Highest",
    assignee: "u-dave",
    parent: "DEMO-3",
    comments: [["Dave DevOps", "I turned it off. I still work here. There were reasons."]],
    links: [],
  },
  {
    key: "DEMO-106",
    summary: "E2E tests are red on every third build",
    type: "Bug",
    status: "To Do",
    spilledFrom: "DEMO Sprint 41",
    description: "Flaky login test.\nCurrent team solution: re-run.\nProposed solution: fix it.",
    labels: ["testing"],
    priority: "Medium",
    assignee: "u-carol",
    links: [],
  },
  {
    key: "DEMO-107",
    summary: "Spike: can we use AI to estimate issues",
    type: "Task",
    status: "To Do",
    description:
      "Timebox: 2 days.\nResearch question: does a language model guess story points better than planning poker.\nNull hypothesis: both are guessing.",
    labels: ["research"],
    priority: "Lowest",
    links: [],
  },
  {
    key: "DEMO-108",
    summary: "Update the API docs",
    type: "Task",
    status: "To Do",
    description: "The docs describe endpoints that do not exist and skip the ones that do.",
    labels: ["docs"],
    priority: "Medium",
    assignee: "u-bob",
    links: [
      {
        key: "DEMO-103",
        summary: "Export the report to PDF",
        status: "To Do",
        relation: "relates to",
      },
    ],
  },
];

const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const toDetails = (seed: TSeed): TIssueDetails => ({
  key: seed.key,
  summary: seed.summary,
  type: seed.type,
  status: seed.status,
  spilledFrom: seed.spilledFrom,
  assignee: USERS.find((u) => u.accountId === seed.assignee) ?? null,
  parent: EPICS.find((e) => e.key === seed.parent) ?? null,
  descriptionHtml: textToHtml(seed.description) + (seed.html ?? ""),
  labels: seed.labels,
  links: seed.links,
  priority: PRIORITIES.find((p) => p.name === seed.priority) ?? null,
  comments: (seed.comments ?? []).map(([author, text], i) => ({
    id: `${seed.key}-c${i}`,
    author,
    created: new Date(Date.now() - (i + 1) * 86_400_000).toISOString(),
    html: textToHtml(text),
  })),
});

/** In-memory Jira, so the page can be tried without anyone's token */
export const createDemoClient = (): TJiraClient => {
  const issues = new Map(SEED.map((seed) => [seed.key, toDetails(seed)]));
  const sprintOf = new Map(SEED.map((seed) => [seed.key, SPRINTS[0].id]));
  const images = new Map<string, string>();

  const get = (key: string) => {
    const issue = issues.get(key);
    if (!issue) throw new Error(`No issue ${key}`);
    return issue;
  };

  return {
    demo: true,
    site: "demo.atlassian.net",
    me: async () => USERS[0],
    boards: async () => [{ id: 1, name: "DEMO board", projectKey: "DEMO" }],
    sprints: async () => SPRINTS,
    issues: async (sprintId) => {
      await wait();
      return [...issues.values()]
        .filter((issue) => sprintOf.get(issue.key) === sprintId)
        .map(({ key, summary, type, status, assignee, spilledFrom }) => ({
          key,
          summary,
          type,
          status,
          assignee,
          spilledFrom,
        }));
    },
    issue: async (key) => {
      await wait();
      return structuredClone(get(key));
    },
    priorities: async () => PRIORITIES,
    labels: async () =>
      [...new Set([...SEED.flatMap((seed) => seed.labels), ...EXTRA_LABELS])].sort(),
    epics: async () => EPICS,
    image: async (url) => {
      const svg = DEMO_IMAGES[url];
      if (!svg) return null;
      if (!images.has(url)) {
        images.set(url, URL.createObjectURL(new Blob([svg()], { type: "image/svg+xml" })));
      }
      return images.get(url)!;
    },
    dispose: () => {
      images.forEach((blobUrl) => URL.revokeObjectURL(blobUrl));
      images.clear();
    },
    assignable: async (_key, query) =>
      USERS.filter((u) => u.displayName.toLowerCase().includes(query.toLowerCase())),
    update: async (key, update) => {
      await wait(150);
      const issue = get(key);
      if (update.type === "summary") issue.summary = update.summary;
      if (update.type === "assignee") issue.assignee = update.user;
      if (update.type === "labels") issue.labels = update.labels;
      if (update.type === "priority") issue.priority = update.priority;
      if (update.type === "parent") issue.parent = update.parent;
    },
    comment: async (key, text) => {
      await wait(150);
      get(key).comments.push({
        id: `${key}-c${Date.now()}`,
        author: USERS[0].displayName,
        created: new Date().toISOString(),
        html: textToHtml(text),
      });
    },
    moveToSprint: async (key, sprintId) => {
      await wait(150);
      sprintOf.set(key, sprintId);
    },
  };
};
