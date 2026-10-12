import React from "react";
import { UserIcon } from "lucide-react";

import type { TUser } from "../../_types";

type TAssigneePicker = {
  assignee: TUser | null;
  search: (query: string) => Promise<Array<TUser>>;
  onChange: (user: TUser | null) => void;
};

// initials instead of Jira avatars – the site CSP only allows its own images
const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const Avatar = ({ user }: { user: TUser | null }) =>
  user ? (
    <span className="bg-primary-900 flex size-5 items-center justify-center rounded-full text-[10px] text-white">
      {initials(user.displayName)}
    </span>
  ) : (
    <UserIcon size={16} />
  );

export const AssigneePicker = ({ assignee, search, onChange }: TAssigneePicker) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Array<TUser>>([]);

  React.useEffect(() => {
    if (!open) return;
    let stale = false;
    const timeout = window.setTimeout(async () => {
      const users = await search(query).catch(() => []);
      if (!stale) setResults(users);
    }, 250);
    return () => {
      stale = true;
      window.clearTimeout(timeout);
    };
  }, [open, query, search]);

  const pick = (user: TUser | null) => {
    onChange(user);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1 text-sm hover:bg-neutral-200"
      >
        <Avatar user={assignee} />
        {assignee?.displayName ?? "nieprzypisany"}
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-64 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg">
          <input
            autoFocus
            placeholder="szukaj osoby"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
            className="mb-1 w-full rounded-md bg-neutral-100 p-1.5 text-sm focus:outline-2"
          />
          <ul className="max-h-60 overflow-auto text-sm">
            <li>
              <button
                type="button"
                onClick={() => pick(null)}
                className="w-full rounded-md p-1.5 text-left opacity-70 hover:bg-neutral-100"
              >
                nieprzypisany
              </button>
            </li>
            {results.map((user) => (
              <li key={user.accountId}>
                <button
                  type="button"
                  onClick={() => pick(user)}
                  className="flex w-full items-center gap-2 rounded-md p-1.5 text-left hover:bg-neutral-100"
                >
                  <Avatar user={user} />
                  {user.displayName}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
