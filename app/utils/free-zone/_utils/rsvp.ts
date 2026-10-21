import type { TPlan, TRsvp } from "../_types";

export const RSVP_LABELS: Record<TRsvp, string> = {
  yes: "going",
  maybe: "maybe",
  no: "can't go",
};

/** sets or (null) takes back one person's answer - shared by the page and the server */
export const withRsvp = (rsvp: TPlan["rsvp"], personId: string, answer: TRsvp | null) => {
  const rest = Object.fromEntries(Object.entries(rsvp ?? {}).filter(([id]) => id !== personId));
  return answer ? { ...rest, [personId]: answer } : rest;
};
