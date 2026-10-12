"use client";

import React from "react";

import { Section } from "~/components/section";

import { ConnectForm } from "./_components/connect-form";
import { Deck } from "./_components/deck";
import { SprintSetup } from "./_components/sprint-setup";
import { createDemoClient } from "./_utils/demo-client";
import { createJiraClient } from "./_utils/jira-client";
import { readStorage, STORAGE, writeStorage } from "./_utils/storage";
import type { TPlan } from "./_utils/use-deck";
import type { TCredentials, TJiraClient, TUser } from "./_types";

export default function FunZoneJinderPage() {
  const [initial, setInitial] = React.useState<TCredentials | null>(null);
  const [client, setClient] = React.useState<TJiraClient | null>(null);
  const [me, setMe] = React.useState<TUser | null>(null);
  const [plan, setPlan] = React.useState<TPlan | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const connect = React.useCallback(async (credentials: TCredentials) => {
    setBusy(true);
    setErrorMessage(null);
    const jira = createJiraClient(credentials);
    try {
      const user = await jira.me();
      writeStorage(STORAGE.site, credentials.site);
      writeStorage(STORAGE.email, credentials.email);
      writeStorage(STORAGE.token, credentials.token);
      setInitial(credentials);
      setMe(user);
      setClient(jira);
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "Nie udało się połączyć");
    } finally {
      setBusy(false);
    }
  }, []);

  // reconnect silently while the tab still has the token
  React.useEffect(() => {
    const saved: TCredentials = {
      site: readStorage(STORAGE.site),
      email: readStorage(STORAGE.email),
      token: readStorage(STORAGE.token),
    };
    setInitial(saved);
    if (saved.site && saved.email && saved.token) connect(saved);
  }, [connect]);

  const disconnect = () => {
    writeStorage(STORAGE.token, "");
    setInitial((i) => i && { ...i, token: "" });
    setClient(null);
    setMe(null);
    setPlan(null);
  };

  return (
    <main className="min-h-[calc(100dvh-56px)]">
      <Section>
        <div className="mt-16 mb-8 ml-4">
          <h1 className="text-xl font-semibold sm:text-3xl">Jinder</h1>
          <p>
            sprint planning jak randki: w prawo task zostaje w sprincie, w lewo leci do następnego
          </p>
        </div>

        <div className="space-y-4">
          {errorMessage && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
              {errorMessage}
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                aria-label="zamknij"
                className="px-2"
              >
                ×
              </button>
            </div>
          )}

          {client && (
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="opacity-70">
                {client.demo
                  ? "tryb demo, nic nie trafia do prawdziwej Jiry"
                  : `${me?.displayName ?? ""} @ ${client.site}`}
              </span>
              <button
                type="button"
                onClick={disconnect}
                className="underline opacity-60 hover:opacity-100"
              >
                {client.demo ? "wyjdź z demo" : "rozłącz"}
              </button>
            </div>
          )}

          {!client && initial && (
            <ConnectForm
              initial={initial}
              busy={busy}
              onConnect={connect}
              onDemo={() => {
                setErrorMessage(null);
                setClient(createDemoClient());
              }}
            />
          )}

          {client && !plan && (
            <SprintSetup client={client} onStart={setPlan} onError={setErrorMessage} />
          )}

          {client && plan && (
            <Deck
              key={`${plan.planned.id}-${plan.target?.id}-${plan.spilledFirst}`}
              client={client}
              plan={plan}
              onChangePlan={() => setPlan(null)}
            />
          )}
        </div>
      </Section>
    </main>
  );
}
