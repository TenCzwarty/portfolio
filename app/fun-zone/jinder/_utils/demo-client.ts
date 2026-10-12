import type { TEpic, TIssueDetails, TJiraClient, TPriority, TSprint, TUser } from "../_types";

import { textToHtml } from "./adf";

const AVATAR_COLORS: Record<string, string> = {
  "u-ania": "#e8590c",
  "u-bartek": "#1971c2",
  "u-celina": "#2f9e44",
  "u-darek": "#9c36b5",
};

const USERS: Array<TUser> = [
  { accountId: "u-ania", displayName: "Ania Frontend" },
  { accountId: "u-bartek", displayName: "Bartek Backend" },
  { accountId: "u-celina", displayName: "Celina QA" },
  { accountId: "u-darek", displayName: "Darek DevOps" },
].map((user) => ({ ...user, avatarUrl: `/demo/avatar/${user.accountId}` }));

const EPICS: Array<TEpic> = [
  { key: "DEMO-1", summary: "Formularze 2.0" },
  { key: "DEMO-2", summary: "Raportowanie" },
  { key: "DEMO-3", summary: "Infrastruktura" },
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
    <text x="396" y="164" font-family="sans-serif" font-size="14" fill="#fff" text-anchor="middle">Zapisz</text>
    <text x="320" y="132" font-family="sans-serif" font-size="13" fill="#c92a2a">kliknij 2x ↓</text>
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
    summary: "Przycisk „Zapisz” zapisuje dopiero za drugim razem",
    type: "Bug",
    status: "To Do",
    spilledFrom: "DEMO Sprint 41",
    description:
      "Kroki:\n1. Otwórz formularz profilu\n2. Kliknij Zapisz\n3. Nic się nie dzieje, kliknij jeszcze raz\nOczekiwane: zapis za pierwszym razem.\nFaktyczne: użytkownicy nauczyli się klikać dwa razy i uważają to za feature.",
    html: `<p><img src="${SCREENSHOT}" alt="screenshot.png"></p>`,
    labels: ["frontend", "regression"],
    priority: "High",
    assignee: "u-ania",
    parent: "DEMO-1",
    comments: [
      ["Celina QA", "Reprodukuje się tylko w Safari. I u prezesa."],
      ["Ania Frontend", "Debounce na onClick, 300 ms. Ktoś kiedyś chciał dobrze."],
    ],
    links: [
      { key: "DEMO-87", summary: "Refactor formularzy", status: "Done", relation: "is caused by" },
    ],
  },
  {
    key: "DEMO-102",
    summary: "Migracja na nową wersję frameworka",
    type: "Story",
    status: "To Do",
    spilledFrom: "DEMO Sprint 41",
    description:
      "Ten task przechodzi ze sprintu do sprintu od marca.\nNikt go nie chce, nikt go nie zamyka.\nDefinition of done: aplikacja działa tak samo jak wcześniej, tylko na nowszych bibliotekach.",
    labels: ["tech-debt"],
    priority: "Medium",
    comments: [["Bartek Backend", "Może w przyszłym sprincie."]],
    links: [],
  },
  {
    key: "DEMO-103",
    summary: "Eksport raportu do PDF",
    type: "Story",
    status: "To Do",
    description:
      "Jako manager chcę wyeksportować raport do PDF, żeby go wydrukować, zeskanować i wysłać mailem.\nAkceptacja: PDF ma logo firmy w prawym górnym rogu.",
    labels: ["reports"],
    priority: "High",
    assignee: "u-bartek",
    parent: "DEMO-2",
    links: [
      {
        key: "DEMO-110",
        summary: "Nowe logo firmy",
        status: "In Progress",
        relation: "is blocked by",
      },
    ],
  },
  {
    key: "DEMO-104",
    summary: "Ciemny motyw",
    type: "Story",
    status: "To Do",
    description:
      "Użytkownicy pytają o ciemny motyw.\nKonkretnie jeden użytkownik, ale pyta bardzo często.",
    labels: ["frontend", "nice-to-have"],
    priority: "Low",
    links: [],
  },
  {
    key: "DEMO-105",
    summary: "Certyfikat SSL wygasa za 9 dni",
    type: "Task",
    status: "To Do",
    description:
      "Automatyczne odnawianie wyłączył ktoś, kto już tu nie pracuje.\nWłączyć z powrotem.",
    labels: ["ops"],
    priority: "Highest",
    assignee: "u-darek",
    parent: "DEMO-3",
    comments: [["Darek DevOps", "To ja go wyłączyłem. Nadal tu pracuję. Były powody."]],
    links: [],
  },
  {
    key: "DEMO-106",
    summary: "Testy E2E są czerwone co trzeci build",
    type: "Bug",
    status: "To Do",
    spilledFrom: "DEMO Sprint 41",
    description:
      "Flaky test logowania.\nObecne rozwiązanie zespołu: re-run.\nProponowane rozwiązanie: naprawić.",
    labels: ["testing"],
    priority: "Medium",
    assignee: "u-celina",
    links: [],
  },
  {
    key: "DEMO-107",
    summary: "Spike: czy możemy użyć AI do estymacji tasków",
    type: "Task",
    status: "To Do",
    description:
      "Timebox: 2 dni.\nPytanie badawcze: czy model językowy zgaduje story pointy lepiej niż planning poker.\nHipoteza zerowa: oba zgadują.",
    labels: ["research"],
    priority: "Lowest",
    links: [],
  },
  {
    key: "DEMO-108",
    summary: "Aktualizacja dokumentacji API",
    type: "Task",
    status: "To Do",
    description: "Dokumentacja opisuje endpointy, których nie ma, i pomija te, które są.",
    labels: ["docs"],
    priority: "Medium",
    assignee: "u-bartek",
    links: [
      {
        key: "DEMO-103",
        summary: "Eksport raportu do PDF",
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
    if (!issue) throw new Error(`Nie ma ${key}`);
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
