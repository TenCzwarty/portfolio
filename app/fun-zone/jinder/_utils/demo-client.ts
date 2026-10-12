import type { TIssueDetails, TJiraClient, TPriority, TSprint, TUser } from "../_types";

import { textToHtml } from "./adf";

const USERS: Array<TUser> = [
  { accountId: "u-ania", displayName: "Ania Frontend" },
  { accountId: "u-bartek", displayName: "Bartek Backend" },
  { accountId: "u-celina", displayName: "Celina QA" },
  { accountId: "u-darek", displayName: "Darek DevOps" },
];

const PRIORITIES: Array<TPriority> = ["Highest", "High", "Medium", "Low", "Lowest"].map(
  (name, i) => ({ id: String(i + 1), name })
);

const SPRINTS: Array<TSprint> = [
  { id: 42, name: "DEMO Sprint 42", state: "future" },
  { id: 43, name: "DEMO Sprint 43", state: "future" },
];

type TSeed = Omit<TIssueDetails, "descriptionHtml" | "comments" | "priority" | "assignee"> & {
  description: string;
  priority: string;
  assignee?: string;
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
    labels: ["frontend", "regression"],
    priority: "High",
    assignee: "u-ania",
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
  descriptionHtml: textToHtml(seed.description),
  labels: seed.labels,
  links: seed.links,
  priority: PRIORITIES.find((p) => p.name === seed.priority) ?? null,
  assignee: USERS.find((u) => u.accountId === seed.assignee) ?? null,
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
        .map(({ key, summary, type, status, spilledFrom }) => ({
          key,
          summary,
          type,
          status,
          spilledFrom,
        }));
    },
    issue: async (key) => {
      await wait();
      return structuredClone(get(key));
    },
    priorities: async () => PRIORITIES,
    assignable: async (_key, query) =>
      USERS.filter((u) => u.displayName.toLowerCase().includes(query.toLowerCase())),
    update: async (key, update) => {
      await wait(150);
      const issue = get(key);
      if (update.type === "assignee") issue.assignee = update.user;
      if (update.type === "labels") issue.labels = update.labels;
      if (update.type === "priority") issue.priority = update.priority;
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
