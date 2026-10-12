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
        <h3 className="text-lg font-semibold sm:text-xl">połącz z Jirą</h3>
        <label className="flex flex-col gap-1 text-sm">
          adres Jiry
          <input
            required
            placeholder="twojafirma.atlassian.net"
            {...field("site")}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          email konta
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
          token wygenerujesz w{" "}
          <LinkExternal
            href="https://id.atlassian.com/manage-profile/security/api-tokens"
            label="ustawieniach konta Atlassian"
          />
          . Przechodzi przez serwer tej strony tylko dlatego, że Jira nie wpuszcza zapytań prosto z
          przeglądarki. Nic nie jest zapisywane po stronie serwera, a w przeglądarce token żyje do
          zamknięcia karty.
        </p>
        <button
          type="submit"
          disabled={busy}
          className="bg-primary-900 hover:bg-accent-500 hover:text-primary-900 self-start rounded-full px-4 py-1 text-white disabled:opacity-50"
        >
          {busy ? "łączę…" : "połącz"}
        </button>
      </form>

      <button
        type="button"
        onClick={onDemo}
        className="self-start rounded-full border border-neutral-200 px-4 py-1 hover:bg-neutral-200"
      >
        albo wypróbuj demo bez Jiry
      </button>
    </div>
  );
};
