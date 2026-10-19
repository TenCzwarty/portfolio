import React from "react";
import { ExternalLinkIcon, HistoryIcon } from "lucide-react";

import type {
  TEpic,
  TIssueDetails,
  TIssueSummary,
  TIssueUpdate,
  TPriority,
  TUser,
} from "../../_types";
import { AssigneePicker } from "../assignee-picker";
import { CommentForm } from "../comment-form";
import { LabelsEditor } from "../labels-editor";
import { RichHtml } from "../rich-html";
import { TitleEditor } from "../title-editor";

/** what the card can offer in its pickers, shared by every card of the deck */
export type TCardOptions = {
  site: string;
  priorities: Array<TPriority>;
  /** null while loading */
  labels: Array<string> | null;
  epics: Array<TEpic>;
  searchUsers: (query: string) => Promise<Array<TUser>>;
  loadImage: (url: string) => Promise<string | null>;
};

type TIssueCard = {
  issue: TIssueSummary;
  details: TIssueDetails | null;
  options: TCardOptions;
  onUpdate: (update: TIssueUpdate) => void;
  onComment: (text: string) => Promise<boolean>;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const TypeIcon = ({ url, loadImage }: { url?: string; loadImage: TCardOptions["loadImage"] }) => {
  const [src, setSrc] = React.useState<string | null>(null);
  React.useEffect(() => {
    let stale = false;
    if (url) loadImage(url).then((blobUrl) => !stale && setSrc(blobUrl));
    return () => {
      stale = true;
    };
  }, [url, loadImage]);
  // eslint-disable-next-line @next/next/no-img-element -- blob: URL, nothing to optimize
  return src ? <img src={src} alt="" className="size-4" /> : null;
};

const pillClass =
  "rounded-full border border-neutral-200 bg-transparent px-3 py-1 text-sm hover:bg-neutral-200";

const Heading = ({ children }: TChildren) => (
  <h4 className="mb-2 text-xs font-semibold tracking-wide uppercase opacity-60">{children}</h4>
);

export const IssueCard = ({ issue, details, options, onUpdate, onComment }: TIssueCard) => {
  const { site, priorities, labels, epics, searchUsers, loadImage } = options;
  // the current parent may be a closed epic the board no longer lists
  const parents =
    details?.parent && !epics.some((e) => e.key === details.parent!.key)
      ? [details.parent, ...epics]
      : epics;
  const browse = (key: string) => `https://${site}/browse/${key}`;

  return (
    <article className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <TypeIcon url={issue.typeIconUrl} loadImage={loadImage} />
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
              <HistoryIcon size={12} /> spilled over from {issue.spilledFrom}
            </span>
          )}
        </div>
        <TitleEditor
          title={issue.summary}
          onSave={(summary) => onUpdate({ type: "summary", summary })}
        />
      </header>

      {!details ? (
        <div className="h-40 animate-pulse rounded-xl bg-neutral-200/60" />
      ) : (
        // one column on narrow screens (fields, description, discussion), on wide ones the
        // description gets the left column and everything else stacks on the right
        <div className="grid gap-5 xl:grid-cols-2 xl:grid-rows-[auto_1fr] xl:gap-x-8">
          <div className="flex flex-col gap-4 xl:col-start-2 xl:row-start-1">
            <div className="flex flex-wrap items-center gap-2">
              <AssigneePicker
                assignee={details.assignee}
                search={searchUsers}
                loadImage={loadImage}
                onChange={(user) => onUpdate({ type: "assignee", user })}
              />
              <select
                aria-label="priority"
                value={details.priority?.id ?? ""}
                onChange={(e) => {
                  const priority = priorities.find((p) => p.id === e.target.value);
                  if (priority) onUpdate({ type: "priority", priority });
                }}
                className={pillClass}
              >
                {!details.priority && <option value="">no priority</option>}
                {priorities.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <select
                aria-label="parent"
                value={details.parent?.key ?? ""}
                onChange={(e) =>
                  onUpdate({
                    type: "parent",
                    parent: parents.find((p) => p.key === e.target.value) ?? null,
                  })
                }
                className={`${pillClass} max-w-full truncate sm:max-w-72`}
              >
                <option value="">no parent</option>
                {parents.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.key}: {p.summary}
                  </option>
                ))}
              </select>
            </div>

            <LabelsEditor
              available={labels}
              labels={details.labels}
              onChange={(labels) => onUpdate({ type: "labels", labels })}
            />
          </div>

          <section className="min-w-0 xl:col-start-1 xl:row-span-2 xl:row-start-1">
            <Heading>description</Heading>
            <RichHtml
              html={details.descriptionHtml}
              site={site}
              loadImage={loadImage}
              empty="no description"
            />
          </section>

          <div className="flex min-w-0 flex-col gap-5 xl:col-start-2 xl:row-start-2">
            {details.links.length > 0 && (
              <section>
                <Heading>linked issues</Heading>
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
              <Heading>comments ({details.comments.length})</Heading>
              <div className="space-y-3">
                {details.comments.map((comment) => (
                  <div key={comment.id} className="rounded-xl bg-white/60 p-3">
                    <div className="mb-1 text-xs opacity-60">
                      {comment.author} · {formatDate(comment.created)}
                    </div>
                    <RichHtml html={comment.html} site={site} loadImage={loadImage} />
                  </div>
                ))}
                <CommentForm onSave={onComment} />
              </div>
            </section>
          </div>
        </div>
      )}
    </article>
  );
};
