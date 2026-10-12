import React from "react";

import type {
  TDecision,
  TIssueDetails,
  TIssueSummary,
  TIssueUpdate,
  TJiraClient,
  TSprint,
} from "../_types";

export type TPlan = {
  planned: TSprint;
  /** where a left swipe sends the issue; null = the next sprint does not exist yet */
  target: TSprint | null;
  spilledFirst: boolean;
};

type TDecisionState = TDecision & { failed?: string };

const message = (e: unknown) => (e instanceof Error ? e.message : "Coś poszło nie tak");

const applyUpdate = (issue: TIssueDetails, update: TIssueUpdate): TIssueDetails =>
  update.type === "assignee"
    ? { ...issue, assignee: update.user }
    : update.type === "labels"
      ? { ...issue, labels: update.labels }
      : { ...issue, priority: update.priority };

export const useDeck = (client: TJiraClient, plan: TPlan) => {
  const [issues, setIssues] = React.useState<Array<TIssueSummary>>([]);
  const [status, setStatus] = React.useState<"loading" | "ready" | "error">("loading");
  const [decisions, setDecisions] = React.useState<Array<TDecisionState>>([]);
  const [details, setDetails] = React.useState<Record<string, TIssueDetails>>({});
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const requested = React.useRef(new Set<string>());
  // moves run one after another, so an undo can never overtake the swipe it undoes
  const queue = React.useRef<Promise<unknown>>(Promise.resolve());
  const enqueue = (task: () => Promise<void>) => {
    const run = queue.current.then(task);
    queue.current = run.catch(() => {});
    return run;
  };

  const load = React.useCallback(async () => {
    setStatus("loading");
    setDecisions([]);
    try {
      const list = await client.issues(plan.planned.id);
      // stable sort keeps the board rank inside both groups
      const ordered = plan.spilledFirst
        ? [...list].sort((a, b) => Number(!!b.spilledFrom) - Number(!!a.spilledFrom))
        : list;
      setIssues(ordered);
      setStatus("ready");
    } catch (e) {
      setErrorMessage(message(e));
      setStatus("error");
    }
  }, [client, plan.planned.id, plan.spilledFirst]);

  React.useEffect(() => {
    load();
  }, [load]);

  const fetchDetails = React.useCallback(
    async (key: string, force = false) => {
      if (!force && requested.current.has(key)) return;
      requested.current.add(key);
      try {
        const issue = await client.issue(key);
        setDetails((d) => ({ ...d, [key]: issue }));
      } catch (e) {
        requested.current.delete(key);
        setErrorMessage(`${key}: ${message(e)}`);
      }
    },
    [client]
  );

  const index = decisions.length;
  const current = issues[index] ?? null;
  const next = issues[index + 1] ?? null;

  // load the visible card and prefetch the next one, so swiping does not wait for Jira
  React.useEffect(() => {
    if (current) fetchDetails(current.key);
    if (next) fetchDetails(next.key);
  }, [current, next, fetchDetails]);

  const decide = (keep: boolean) => {
    if (!current) return;
    const { key } = current;
    if (!keep && !plan.target) return;

    setDecisions((d) => [...d, { key, keep }]);
    if (keep) return;

    enqueue(() => client.moveToSprint(key, plan.target!.id)).catch((e) => {
      setDecisions((d) => d.map((x) => (x.key === key ? { ...x, failed: message(e) } : x)));
      setErrorMessage(`${key} nie przeniósł się do ${plan.target!.name}: ${message(e)}`);
    });
  };

  const retry = async (key: string) => {
    if (!plan.target) return;
    try {
      await enqueue(() => client.moveToSprint(key, plan.target!.id));
      setDecisions((d) => d.map((x) => (x.key === key ? { ...x, failed: undefined } : x)));
    } catch (e) {
      setErrorMessage(`${key}: ${message(e)}`);
    }
  };

  const undo = async () => {
    const last = decisions.at(-1);
    if (!last) return;
    setDecisions((d) => d.slice(0, -1));
    if (last.keep || last.failed) return;

    try {
      await enqueue(() => client.moveToSprint(last.key, plan.planned.id));
    } catch (e) {
      setErrorMessage(`${last.key} nie wrócił do ${plan.planned.name}: ${message(e)}`);
    }
  };

  const update = async (key: string, change: TIssueUpdate) => {
    const before = details[key];
    if (before) setDetails((d) => ({ ...d, [key]: applyUpdate(before, change) }));
    try {
      await client.update(key, change);
    } catch (e) {
      if (before) setDetails((d) => ({ ...d, [key]: before }));
      setErrorMessage(`${key}: ${message(e)}`);
    }
  };

  const comment = async (key: string, text: string) => {
    try {
      await client.comment(key, text);
      await fetchDetails(key, true);
      return true;
    } catch (e) {
      setErrorMessage(`${key}: ${message(e)}`);
      return false;
    }
  };

  return {
    status,
    issues,
    index,
    current,
    currentDetails: current ? (details[current.key] ?? null) : null,
    decisions,
    done: status === "ready" && index >= issues.length,
    errorMessage,
    clearError: () => setErrorMessage(null),
    decide,
    undo,
    retry,
    update,
    comment,
    reload: load,
  };
};
