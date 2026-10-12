const PREFIX = "jinder:";

/** site / email / board survive the browser, the token only this tab */
export const STORAGE = {
  site: { key: `${PREFIX}site`, session: false },
  email: { key: `${PREFIX}email`, session: false },
  board: { key: `${PREFIX}board`, session: false },
  token: { key: `${PREFIX}token`, session: true },
} as const;

type TEntry = (typeof STORAGE)[keyof typeof STORAGE];

const store = (entry: TEntry) => (entry.session ? window.sessionStorage : window.localStorage);

export const readStorage = (entry: TEntry): string => {
  try {
    return store(entry).getItem(entry.key) ?? "";
  } catch {
    return "";
  }
};

export const writeStorage = (entry: TEntry, value: string) => {
  try {
    if (value) store(entry).setItem(entry.key, value);
    else store(entry).removeItem(entry.key);
  } catch {
    // private mode etc. – the page still works for this visit
  }
};
