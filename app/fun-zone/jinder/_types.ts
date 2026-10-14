export type TCredentials = {
  site: string;
  email: string;
  token: string;
};

export type TBoard = {
  id: number;
  name: string;
  projectKey?: string;
};

export type TSprint = {
  id: number;
  name: string;
  state: "active" | "future" | "closed";
  startDate?: string;
};

export type TUser = {
  accountId: string;
  displayName: string;
  avatarUrl?: string;
};

export type TEpic = {
  key: string;
  summary: string;
};

export type TPriority = {
  id: string;
  name: string;
};

/** What the deck needs to show a card before its details are loaded */
export type TIssueSummary = {
  key: string;
  summary: string;
  type: string;
  typeIconUrl?: string;
  status: string;
  assignee: TUser | null;
  /** name of the last closed sprint it was in – it spilled over from there */
  spilledFrom?: string;
};

export type TComment = {
  id: string;
  author: string;
  created: string;
  html: string;
};

export type TLinkedIssue = {
  key: string;
  summary: string;
  status: string;
  relation: string;
};

export type TIssueDetails = TIssueSummary & {
  descriptionHtml: string;
  labels: Array<string>;
  assignee: TUser | null;
  priority: TPriority | null;
  parent: TEpic | null;
  comments: Array<TComment>;
  links: Array<TLinkedIssue>;
};

export type TIssueUpdate =
  | { type: "assignee"; user: TUser | null }
  | { type: "labels"; labels: Array<string> }
  | { type: "summary"; summary: string }
  | { type: "priority"; priority: TPriority }
  | { type: "parent"; parent: TEpic | null };

/** Same shape for the real Jira and the demo, so the page does not care which one it talks to */
export type TJiraClient = {
  demo: boolean;
  site: string;
  me: () => Promise<TUser>;
  boards: (name: string) => Promise<Array<TBoard>>;
  sprints: (boardId: number) => Promise<Array<TSprint>>;
  issues: (sprintId: number) => Promise<Array<TIssueSummary>>;
  issue: (key: string) => Promise<TIssueDetails>;
  priorities: () => Promise<Array<TPriority>>;
  /** every label that already exists in the Jira instance */
  labels: () => Promise<Array<string>>;
  /** open epics of the board – the possible parents */
  epics: (boardId: number) => Promise<Array<TEpic>>;
  /** Jira image (attachment, avatar, icon) as a blob: URL, or null when it cannot be shown */
  image: (url: string) => Promise<string | null>;
  /** frees the blob: URLs */
  dispose: () => void;
  assignable: (key: string, query: string) => Promise<Array<TUser>>;
  update: (key: string, update: TIssueUpdate) => Promise<void>;
  comment: (key: string, text: string) => Promise<void>;
  moveToSprint: (key: string, sprintId: number) => Promise<void>;
};

export type TDecision = {
  key: string;
  keep: boolean;
};
