import React from "react";
import { ExternalLinkIcon, HistoryIcon } from "lucide-react";

import type { TIssueDetails, TIssueSummary, TIssueUpdate, TPriority, TUser } from "../../_types";
import { AssigneePicker } from "../assignee-picker";
import { CommentForm } from "../comment-form";
import { LabelsEditor } from "../labels-editor";
import { RichHtml } from "../rich-html";

type TIssueCard = {
  issue: TIssueSummary;
  details: TIssueDetails | null;
  site: string;
  priorities: Array<TPriority>;
  searchUsers: (query: string) => Promise<Array<TUser>>;
  onUpdate: (update: TIssueUpdate) => void;
  onComment: (text: string) => Promise<boolean>;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pl-PL", { day: "numeric", month: "short", year: "numeric" });

const Heading = ({ children }: TChildren) => (
  <h4 className="mb-2 text-xs font-semibold tracking-wide uppercase opacity-60">{children}</h4>
);

export const IssueCard = ({
  issue,
  details,
  site,
  priorities,
  searchUsers,
  onUpdate,
  onComment,
}: TIssueCard) => {
  const browse = (key: string) => `https://${site}/browse/${key}`;

  return (
    <article className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="opacity-70">{issue.type}</span>
          <a
            href={browse(issue.key)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-semibold hover:underline"
          >
            {issue.key} <ExternalLinkIcon size={14} />
          </a>
          <span className="rounded-full border border-neutral-200 px-2 py-0.5 text-xs">
            {issue.status}
          </span>
          {issue.spilledFrom && (
            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-900">
              <HistoryIcon size={12} /> spadło z {issue.spilledFrom}
            </span>
          )}
        </div>
        <h2 className="text-xl font-semibold sm:text-2xl">{issue.summary}</h2>
      </header>

      {!details ? (
        <div className="h-40 animate-pulse rounded-xl bg-neutral-200/60" />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <AssigneePicker
              assignee={details.assignee}
              search={searchUsers}
              onChange={(user) => onUpdate({ type: "assignee", user })}
            />
            <select
              aria-label="priorytet"
              value={details.priority?.id ?? ""}
              onChange={(e) => {
                const priority = priorities.find((p) => p.id === e.target.value);
                if (priority) onUpdate({ type: "priority", priority });
              }}
              className="rounded-full border border-neutral-200 bg-transparent px-3 py-1 text-sm hover:bg-neutral-200"
            >
              {!details.priority && <option value="">bez priorytetu</option>}
              {priorities.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <LabelsEditor
            labels={details.labels}
            onChange={(labels) => onUpdate({ type: "labels", labels })}
          />

          <section>
            <Heading>opis</Heading>
            <RichHtml html={details.descriptionHtml} site={site} empty="brak opisu" />
          </section>

          {details.links.length > 0 && (
            <section>
              <Heading>powiązane</Heading>
              <ul className="space-y-1 text-sm">
                {details.links.map((link) => (
                  <li key={`${link.relation}-${link.key}`} className="flex flex-wrap gap-x-2">
                    <span className="opacity-60">{link.relation}</span>
                    <a
                      href={browse(link.key)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold hover:underline"
                    >
                      {link.key}
                    </a>
                    <span>{link.summary}</span>
                    <span className="text-xs opacity-60">({link.status})</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <Heading>komentarze ({details.comments.length})</Heading>
            <div className="space-y-3">
              {details.comments.map((comment) => (
                <div key={comment.id} className="rounded-xl bg-white/60 p-3">
                  <div className="mb-1 text-xs opacity-60">
                    {comment.author} · {formatDate(comment.created)}
                  </div>
                  <RichHtml html={comment.html} site={site} />
                </div>
              ))}
              <CommentForm onSave={onComment} />
            </div>
          </section>
        </>
      )}
    </article>
  );
};
