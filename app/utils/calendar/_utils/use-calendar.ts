import React from "react";

import type { TCalendarAction, TCalendarData, TPerson } from "../_types";

import { findByName, STORAGE_KEY_ME, STORAGE_KEY_SECRET } from "./identity";
import { sameStamp } from "./stamps";

const API = "/api/calendar";

const EMPTY: TCalendarData = {
  people: [],
  plans: [],
  availability: {},
  stamps: [],
  customStamps: [],
};

const readStorage = <T>(key: string): T | null => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const writeStorage = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // private mode etc. – the page still works for this visit
  }
};

/** Pure reducer so the UI can update before the server answers */
const applyAction = (data: TCalendarData, action: TCalendarAction): TCalendarData => {
  switch (action.type) {
    case "person":
      return {
        ...data,
        people: [...data.people.filter((p) => p.id !== action.person.id), action.person],
      };
    case "availability": {
      const days = data.availability[action.personId] ?? [];
      const next = action.available
        ? [...new Set([...days, action.day])]
        : days.filter((d) => d !== action.day);
      return { ...data, availability: { ...data.availability, [action.personId]: next } };
    }
    case "plan-add":
      return { ...data, plans: [...data.plans, action.plan] };
    case "plan-delete":
      return { ...data, plans: data.plans.filter((p) => p.id !== action.id) };
    case "stamp": {
      const rest = data.stamps.filter((s) => !sameStamp(s, action.stamp));
      return { ...data, stamps: action.on ? [...rest, action.stamp] : rest };
    }
    case "stamp-label-add":
      return {
        ...data,
        customStamps: [...new Set([...data.customStamps, action.label])].sort(),
      };
    case "stamp-label-delete":
      return { ...data, customStamps: data.customStamps.filter((l) => l !== action.label) };
  }
};

export const useCalendar = () => {
  const [data, setData] = React.useState<TCalendarData>(EMPTY);
  const [canEdit, setCanEdit] = React.useState(false);
  const [status, setStatus] = React.useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [me, setMeState] = React.useState<TPerson | null>(null);
  const [hydrated, setHydrated] = React.useState(false);
  const secretRef = React.useRef<string | null>(null);

  const headers = React.useCallback(
    (): HeadersInit => ({
      "Content-Type": "application/json",
      ...(secretRef.current ? { "x-calendar-key": secretRef.current } : {}),
    }),
    []
  );

  const refresh = React.useCallback(async () => {
    try {
      const response = await fetch(API, { headers: headers(), cache: "no-store" });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error ?? "Could not load the calendar");

      const { canEdit: editable, ...rest } = json as TCalendarData & { canEdit: boolean };
      setData(rest);
      setCanEdit(editable);
      setStatus("ready");
      setErrorMessage(null);
    } catch (e) {
      setStatus("error");
      setErrorMessage(e instanceof Error ? e.message : "Could not load the calendar");
    }
  }, [headers]);

  const send = React.useCallback(
    async (action: TCalendarAction) => {
      setData((d) => applyAction(d, action));
      try {
        const response = await fetch(API, {
          method: "POST",
          headers: headers(),
          body: JSON.stringify(action),
        });
        if (!response.ok) {
          const json = await response.json().catch(() => ({}));
          throw new Error(json.error ?? "Could not save");
        }
      } catch (e) {
        setErrorMessage(e instanceof Error ? e.message : "Could not save");
        await refresh();
      }
    },
    [headers, refresh]
  );

  // pick up the secret from the link once, then hide it from the address bar
  React.useEffect(() => {
    const url = new URL(window.location.href);
    // "klucz" is the pre-rename name of the param, links with it are still out there
    const fromUrl = url.searchParams.get("key") ?? url.searchParams.get("klucz");

    if (fromUrl) {
      writeStorage(STORAGE_KEY_SECRET, fromUrl);
      url.searchParams.delete("key");
      url.searchParams.delete("klucz");
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    }

    secretRef.current = fromUrl ?? readStorage<string>(STORAGE_KEY_SECRET);
    setMeState(readStorage<TPerson>(STORAGE_KEY_ME));
    setHydrated(true);
    refresh();

    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    const interval = window.setInterval(refresh, 60_000);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.clearInterval(interval);
    };
  }, [refresh]);

  // remember what was last pushed, so a rejected update is not retried on every refresh
  const lastSentRef = React.useRef<string | null>(null);

  // make sure the server knows my current name / color
  React.useEffect(() => {
    if (!me || !canEdit || status !== "ready") return;
    const known = data.people.find((p) => p.id === me.id);
    if (known?.name === me.name && known.color === me.color) return;

    // same name already on the server under another id (new device / browser) -> that's me
    const namesake = known ? undefined : findByName(data.people, me.name);
    if (namesake) {
      writeStorage(STORAGE_KEY_ME, namesake);
      setMeState(namesake);
      return;
    }

    const payload = JSON.stringify(me);
    if (lastSentRef.current === payload) return;
    lastSentRef.current = payload;
    send({ type: "person", person: me });
  }, [me, canEdit, data.people, status, send]);

  const setMe = (person: TPerson) => {
    writeStorage(STORAGE_KEY_ME, person);
    setMeState(person);
  };

  const forgetSecret = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY_SECRET);
    } catch {}
    secretRef.current = null;
    setCanEdit(false);
  };

  return {
    data,
    canEdit,
    status,
    errorMessage,
    clearError: () => setErrorMessage(null),
    me,
    setMe,
    hydrated,
    send,
    forgetSecret,
  };
};
