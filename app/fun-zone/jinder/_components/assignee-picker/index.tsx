import React from "react";

import type { TUser } from "../../_types";
import { Avatar } from "../avatar";

type TAssigneePicker = {
  assignee: TUser | null;
  search: (query: string) => Promise<Array<TUser>>;
  loadImage: (url: string) => Promise<string | null>;
  onChange: (user: TUser | null) => void;
};

export const AssigneePicker = ({ assignee, search, loadImage, onChange }: TAssigneePicker) => {
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
        className="flex items-center gap-1.5 rounded-full border border-neutral-200 py-1 pr-3 pl-1 text-sm hover:bg-neutral-200"
      >
        <Avatar user={assignee} loadImage={loadImage} />
        {assignee?.displayName ?? "unassigned"}
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-64 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg">
          <input
            autoFocus
            placeholder="search people"
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
                className="flex w-full items-center gap-2 rounded-md p-1.5 text-left opacity-70 hover:bg-neutral-100"
              >
                <Avatar user={null} loadImage={loadImage} />
                unassigned
              </button>
            </li>
            {results.map((user) => (
              <li key={user.accountId}>
                <button
                  type="button"
                  onClick={() => pick(user)}
                  className="flex w-full items-center gap-2 rounded-md p-1.5 text-left hover:bg-neutral-100"
                >
                  <Avatar user={user} loadImage={loadImage} />
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
