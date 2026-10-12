import React from "react";

import { NOBODY, type TPersonFilter, type TPersonStats } from "../_components/people-bar";
import type {
  TDecision,
  TIssueDetails,
  TIssueSummary,
  TIssueUpdate,
  TJiraClient,
  TSprint,
} from "../_types";

export type TPlan = {
  boardId: number;
  planned: TSprint;
  /** where a left swipe sends the issue; null = the next sprint does not exist yet */
  target: TSprint | null;
  spilledFirst: boolean;
};

type TDecisionState = TDecision & { failed?: string };

const message = (e: unknown) => (e instanceof Error ? e.message : "Coś poszło nie tak");

const applyUpdate = <T extends TIssueSummary>(issue: T, update: TIssueUpdate): T => {
  switch (update.type) {
    case "assignee":
      return { ...issue, assignee: update.user };
    case "labels":
      return { ...issue, labels: update.labels };
    case "priority":
      return { ...issue, priority: update.priority };
    case "parent":
      return { ...issue, parent: update.parent };
  }
};

const personId = (issue: TIssueSummary) => issue.assignee?.accountId ?? NOBODY;

export const useDeck = (client: TJiraClient, plan: TPlan, filter: TPersonFilter) => {
  const [issues, setIssues] = React.useState<Array<TIssueSummary>>([]);
  const [status, setStatus] = React.useState<"loading" | "ready" | "error">("loading");
  const [decisions, setDecisions] = React.useState<Array<TDecisionState>>([]);
  /** shown first regardless of the filter – the issue that was just undone */
  const [pinned, setPinned] = React.useState<string | null>(null);
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
    setPinned(null);
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

  const decided = React.useMemo(() => new Set(decisions.map((d) => d.key)), [decisions]);

  const queueOrder = React.useMemo(() => {
    const open = issues.filter(
      (issue) => !decided.has(issue.key) && (filter === null || personId(issue) === filter)
    );
    const first = issues.find((issue) => issue.key === pinned && !decided.has(issue.key));
    return first ? [first, ...open.filter((issue) => issue !== first)] : open;
  }, [issues, decided, filter, pinned]);

  const current = queueOrder[0] ?? null;
  const next = queueOrder[1] ?? null;

  // load the visible card and prefetch the next one, so swiping does not wait for Jira
  React.useEffect(() => {
    if (current) fetchDetails(current.key);
    if (next) fetchDetails(next.key);
  }, [current, next, fetchDetails]);

  const people = React.useMemo(() => {
    const byId = new Map<string, TPersonStats>();
    for (const issue of issues) {
      const id = personId(issue);
      const stats = byId.get(id) ?? { id, user: issue.assignee, kept: 0, pending: 0 };
      const decision = decisions.find((d) => d.key === issue.key);
      if (!decision) stats.pending++;
      else if (decision.keep) stats.kept++;
      byId.set(id, stats);
    }
    // unassigned last, everyone else by name
    return [...byId.values()].sort((a, b) =>
      !a.user ? 1 : !b.user ? -1 : a.user.displayName.localeCompare(b.user.displayName, "pl")
    );
  }, [issues, decisions]);

  const decide = (keep: boolean) => {
    if (!current) return;
    const { key } = current;
    if (!keep && !plan.target) return;

    setPinned(null);
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
    setPinned(last.key);
    if (last.keep || last.failed) return;

    try {
      await enqueue(() => client.moveToSprint(last.key, plan.planned.id));
    } catch (e) {
      setErrorMessage(`${last.key} nie wrócił do ${plan.planned.name}: ${message(e)}`);
    }
  };

  const update = async (key: string, change: TIssueUpdate) => {
    const before = details[key];
    const beforeSummary = issues.find((issue) => issue.key === key);
    if (before) setDetails((d) => ({ ...d, [key]: applyUpdate(before, change) }));
    // the people bar counts from the list, so it has to follow assignee changes too
    if (change.type === "assignee") {
      // a reassigned card stays on screen even if the filter no longer matches it
      setPinned(key);
      setIssues((list) =>
        list.map((issue) => (issue.key === key ? applyUpdate(issue, change) : issue))
      );
    }
    try {
      await client.update(key, change);
    } catch (e) {
      if (before) setDetails((d) => ({ ...d, [key]: before }));
      if (beforeSummary) {
        setIssues((list) => list.map((issue) => (issue.key === key ? beforeSummary : issue)));
      }
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
    people,
    current,
    currentDetails: current ? (details[current.key] ?? null) : null,
    decisions,
    /** cards left for the current filter */
    remaining: queueOrder.length,
    done: status === "ready" && decided.size >= issues.length,
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
