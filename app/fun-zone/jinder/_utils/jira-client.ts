import type {
  TCredentials,
  TEpic,
  TIssueDetails,
  TIssueSummary,
  TJiraClient,
  TLinkedIssue,
  TPriority,
  TSprint,
  TUser,
} from "../_types";

import { textToAdf } from "./adf";

const API = "/api/jira";

/* eslint-disable @typescript-eslint/no-explicit-any -- raw Jira payloads, mapped right below */

const errorMessage = (status: number, json: any) => {
  if (status === 401) return "Jira nie przyjęła emaila albo tokena";
  const messages = [...(json?.errorMessages ?? []), ...Object.values(json?.errors ?? {})];
  return messages.length ? messages.join(", ") : `Jira odpowiedziała błędem ${status}`;
};

const toUser = (raw: any): TUser | null =>
  raw
    ? {
        accountId: raw.accountId,
        displayName: raw.displayName,
        avatarUrl: raw.avatarUrls?.["48x48"],
      }
    : null;

const toSummary = (raw: any): TIssueSummary => {
  const closed: Array<any> = raw.fields.closedSprints ?? [];
  const last = [...closed].sort((a, b) => (a.endDate ?? "").localeCompare(b.endDate ?? "")).pop();
  return {
    key: raw.key,
    summary: raw.fields.summary,
    type: raw.fields.issuetype?.name ?? "",
    typeIconUrl: raw.fields.issuetype?.iconUrl,
    status: raw.fields.status?.name ?? "",
    assignee: toUser(raw.fields.assignee),
    spilledFrom: last?.name,
  };
};

const toLink = (raw: any): TLinkedIssue => {
  const other = raw.outwardIssue ?? raw.inwardIssue;
  return {
    key: other.key,
    summary: other.fields?.summary ?? "",
    status: other.fields?.status?.name ?? "",
    relation: raw.outwardIssue ? raw.type.outward : raw.type.inward,
  };
};

const ATTACHMENT_CONTENT = /\/attachment\/content\/(\d+)$/;

export const createJiraClient = (credentials: TCredentials): TJiraClient => {
  const request = (method: string, path: string, body?: unknown, binary = false) =>
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...credentials, method, path, body, binary }),
    });

  const call = async <T = any>(method: string, path: string, body?: unknown): Promise<T> => {
    const response = await request(method, path, body);
    const json = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(errorMessage(response.status, json));
    return json as T;
  };

  const query = (params: Record<string, string | number>) =>
    new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString();

  /** pages of the agile API ({ values, isLast }) or the label API (same shape) */
  const paged = async (path: string, params: Record<string, string | number>, limit = 10) => {
    const all: Array<any> = [];
    for (let page = 0, startAt = 0; page < limit; page++) {
      const json = await call("GET", `${path}?${query({ ...params, startAt })}`);
      all.push(...json.values);
      startAt += json.values.length;
      if (json.isLast !== false || !json.values.length) break;
    }
    return all;
  };

  const loadImage = async (url: string): Promise<string | null> => {
    const site = credentials.site;
    const absolute = new URL(url, `https://${site}/`);
    const path = absolute.host === site ? absolute.pathname + absolute.search : absolute.href;

    let response = await request("GET", path, undefined, true);
    // too big for the proxy – a thumbnail is better than nothing
    const id = absolute.pathname.match(ATTACHMENT_CONTENT)?.[1];
    if (response.status === 413 && id) {
      response = await request("GET", `/rest/api/3/attachment/thumbnail/${id}`, undefined, true);
    }
    if (!response.ok) return null;
    return URL.createObjectURL(await response.blob());
  };

  const images = new Map<string, Promise<string | null>>();

  const setParent = async (key: string, epic: TEpic | null) => {
    // the parent field works for team-managed and most company-managed projects,
    // the agile epic endpoint covers the older "Epic Link" setups
    try {
      await call("PUT", `/rest/api/3/issue/${key}`, {
        fields: { parent: epic ? { key: epic.key } : null },
      });
    } catch (e) {
      await call("POST", `/rest/agile/1.0/epic/${epic?.key ?? "none"}/issue`, {
        issues: [key],
      }).catch(() => Promise.reject(e));
    }
  };

  return {
    demo: false,
    site: credentials.site,

    me: async () => toUser(await call("GET", "/rest/api/3/myself"))!,

    boards: async (name) => {
      const json = await call(
        "GET",
        `/rest/agile/1.0/board?${query({ type: "scrum", maxResults: 50, ...(name ? { name } : {}) })}`
      );
      return json.values.map((b: any) => ({
        id: b.id,
        name: b.name,
        projectKey: b.location?.projectKey,
      }));
    },

    sprints: async (boardId) => {
      const json = await call(
        "GET",
        `/rest/agile/1.0/board/${boardId}/sprint?${query({ state: "active,future", maxResults: 50 })}`
      );
      return json.values.map(
        (s: any): TSprint => ({ id: s.id, name: s.name, state: s.state, startDate: s.startDate })
      );
    },

    // agile endpoints already return issues in rank order
    issues: async (sprintId) => {
      const all: Array<any> = [];
      for (let startAt = 0; ; ) {
        const json = await call(
          "GET",
          `/rest/agile/1.0/sprint/${sprintId}/issue?${query({
            startAt,
            maxResults: 100,
            fields: "summary,issuetype,status,assignee,closedSprints",
          })}`
        );
        all.push(...json.issues);
        startAt += json.issues.length;
        if (!json.issues.length || startAt >= json.total) break;
      }
      // sub-tasks follow their parent between sprints, they are not separate decisions
      return all.filter((raw) => !raw.fields.issuetype?.subtask).map(toSummary);
    },

    issue: async (key) => {
      const raw = await call(
        "GET",
        `/rest/api/3/issue/${key}?${query({
          fields:
            "summary,issuetype,status,description,labels,assignee,priority,parent,comment,issuelinks",
          expand: "renderedFields",
        })}`
      );
      const renderedComments: Array<any> = raw.renderedFields?.comment?.comments ?? [];
      const parent = raw.fields.parent;
      const details: TIssueDetails = {
        ...toSummary(raw),
        descriptionHtml: raw.renderedFields?.description ?? "",
        labels: raw.fields.labels ?? [],
        priority: raw.fields.priority
          ? { id: raw.fields.priority.id, name: raw.fields.priority.name }
          : null,
        parent: parent ? { key: parent.key, summary: parent.fields?.summary ?? "" } : null,
        comments: (raw.fields.comment?.comments ?? []).map((c: any, i: number) => ({
          id: c.id,
          author: c.author?.displayName ?? "?",
          created: c.created,
          html: renderedComments[i]?.body ?? "",
        })),
        links: (raw.fields.issuelinks ?? []).map(toLink),
      };
      return details;
    },

    priorities: async () =>
      (await call("GET", "/rest/api/3/priority")).map(
        (p: any): TPriority => ({ id: p.id, name: p.name })
      ),

    labels: async () =>
      (await paged("/rest/api/3/label", { maxResults: 1000 })).sort((a: string, b: string) =>
        a.localeCompare(b)
      ),

    epics: async (boardId) =>
      (await paged(`/rest/agile/1.0/board/${boardId}/epic`, { done: "false", maxResults: 50 })).map(
        (e: any): TEpic => ({ key: e.key, summary: e.summary ?? e.name ?? "" })
      ),

    image: (url) => {
      if (!images.has(url))
        images.set(
          url,
          loadImage(url).catch(() => null)
        );
      return images.get(url)!;
    },

    dispose: () => {
      images.forEach((p) => p.then((blobUrl) => blobUrl && URL.revokeObjectURL(blobUrl)));
      images.clear();
    },

    assignable: async (key, q) =>
      (
        await call(
          "GET",
          `/rest/api/3/user/assignable/search?${query({ issueKey: key, query: q, maxResults: 20 })}`
        )
      ).map(toUser),

    update: async (key, update) => {
      if (update.type === "parent") return setParent(key, update.parent);
      const fields =
        update.type === "assignee"
          ? { assignee: update.user ? { accountId: update.user.accountId } : null }
          : update.type === "labels"
            ? { labels: update.labels }
            : { priority: { id: update.priority.id } };
      await call("PUT", `/rest/api/3/issue/${key}`, { fields });
    },

    comment: async (key, text) => {
      await call("POST", `/rest/api/3/issue/${key}/comment`, { body: textToAdf(text) });
    },

    moveToSprint: async (key, sprintId) => {
      await call("POST", `/rest/agile/1.0/sprint/${sprintId}/issue`, { issues: [key] });
    },
  };
};
