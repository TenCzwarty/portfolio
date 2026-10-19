import React from "react";

import { LinkExternal } from "~/components/link-external";

import type { TCredentials } from "../../_types";

type TConnectForm = {
  initial: TCredentials;
  busy: boolean;
  onConnect: (credentials: TCredentials) => void;
  onDemo: () => void;
};

const inputClass = "rounded-md bg-white p-2 focus:outline-2";

export const ConnectForm = ({ initial, busy, onConnect, onDemo }: TConnectForm) => {
  const [form, setForm] = React.useState(initial);

  const field = (name: keyof TCredentials) => ({
    value: form[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [name]: e.target.value })),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // people paste the whole URL, take just the host
    const site = form.site
      .trim()
      .replace(/^https?:\/\//, "")
      .split("/")[0];
    onConnect({ ...form, site });
  };

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4"
      >
        <h3 className="text-lg font-semibold sm:text-xl">connect to Jira</h3>
        <label className="flex flex-col gap-1 text-sm">
          Jira site
          <input
            required
            placeholder="yourcompany.atlassian.net"
            {...field("site")}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          account email
          <input
            required
            type="email"
            autoComplete="username"
            {...field("email")}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          API token
          <input
            required
            type="password"
            autoComplete="current-password"
            {...field("token")}
            className={inputClass}
          />
        </label>
        <p className="text-xs opacity-70">
          create a token in your{" "}
          <LinkExternal
            href="https://id.atlassian.com/manage-profile/security/api-tokens"
            label="Atlassian account settings"
          />
          . It passes through this site&apos;s server only because Jira does not accept requests
          straight from the browser. Nothing is stored on the server, and in the browser the token
          lives until you close the tab.
        </p>
        <button
          type="submit"
          disabled={busy}
          className="bg-primary-900 hover:bg-accent-500 hover:text-primary-900 self-start rounded-full px-4 py-1 text-white disabled:opacity-50"
        >
          {busy ? "connecting…" : "connect"}
        </button>
      </form>

      <button
        type="button"
        onClick={onDemo}
        className="self-start rounded-full border border-neutral-200 px-4 py-1 hover:bg-neutral-200"
      >
        or try the demo without Jira
      </button>
    </div>
  );
};
