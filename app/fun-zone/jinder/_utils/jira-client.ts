import type {
  TCredentials,
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
  raw ? { accountId: raw.accountId, displayName: raw.displayName } : null;

const toSummary = (raw: any): TIssueSummary => {
  const closed: Array<any> = raw.fields.closedSprints ?? [];
  const last = [...closed].sort((a, b) => (a.endDate ?? "").localeCompare(b.endDate ?? "")).pop();
  return {
    key: raw.key,
    summary: raw.fields.summary,
    type: raw.fields.issuetype?.name ?? "",
    status: raw.fields.status?.name ?? "",
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

export const createJiraClient = (credentials: TCredentials): TJiraClient => {
  const call = async <T = any>(method: string, path: string, body?: unknown): Promise<T> => {
    const response = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...credentials, method, path, body }),
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(errorMessage(response.status, json));
    return json as T;
  };

  const query = (params: Record<string, string | number>) =>
    new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString();

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
            fields: "summary,issuetype,status,closedSprints",
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
            "summary,issuetype,status,description,labels,assignee,priority,comment,issuelinks",
          expand: "renderedFields",
        })}`
      );
      const renderedComments: Array<any> = raw.renderedFields?.comment?.comments ?? [];
      const details: TIssueDetails = {
        ...toSummary(raw),
        descriptionHtml: raw.renderedFields?.description ?? "",
        labels: raw.fields.labels ?? [],
        assignee: toUser(raw.fields.assignee),
        priority: raw.fields.priority
          ? { id: raw.fields.priority.id, name: raw.fields.priority.name }
          : null,
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

    assignable: async (key, q) =>
      (
        await call(
          "GET",
          `/rest/api/3/user/assignable/search?${query({ issueKey: key, query: q, maxResults: 20 })}`
        )
      ).map(toUser),

    update: async (key, update) => {
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
