import type { TCalendarData, TNote, TNoteKind, TPerson } from "~/app/utils/free-zone/_types";

/** what both views of the board (canvas and list) need */
export type TBoardView = {
  notes: Array<TNote>;
  votes: TCalendarData["noteVotes"];
  people: Array<TPerson>;
  me: TPerson | null;
  /** person whose notes stay bright, everything else fades */
  highlightId: string | null;
  actions: TNoteActions;
};

export type TNoteActions = {
  add: (kind: TNoteKind, text: string, position: { x: number; y: number }) => void;
  update: (id: string, text: string) => void;
  move: (id: string, x: number, y: number) => void;
  remove: (note: TNote) => void;
  toggleVote: (id: string) => void;
};
