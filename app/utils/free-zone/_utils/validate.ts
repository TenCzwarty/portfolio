import {
  RSVP_ANSWERS,
  type TCalendarAction,
  type TDay,
  type TNote,
  type TPerson,
  type TPlan,
  type TRsvp,
  type TStamp,
} from "../_types";

import { isStampIcon, isStampLabel, isStampSeed, normalizeStamp } from "./stamps";

const RE_DAY = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const RE_COLOR = /^#[0-9a-f]{6}$/i;
const RE_ID = /^[a-z0-9-]{8,64}$/i;

export const LIMITS = {
  name: 30,
  title: 80,
  description: 500,
  people: 50,
  plans: 500,
  planDays: 62,
  customStamps: 30,
  notes: 300,
  noteText: 140,
  labelText: 40,
  /** how far from the middle of the board things may land */
  notePosition: 20_000,
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const isText = (v: unknown, max: number): v is string =>
  typeof v === "string" && v.trim().length > 0 && v.length <= max;

export const isDay = (v: unknown): v is TDay => typeof v === "string" && RE_DAY.test(v);

export const isId = (v: unknown): v is string => typeof v === "string" && RE_ID.test(v);

export const isColor = (v: unknown): v is string => typeof v === "string" && RE_COLOR.test(v);

const daysBetween = (a: TDay, b: TDay) =>
  Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);

const isPerson = (v: unknown): v is TPerson =>
  isRecord(v) && isId(v.id) && isText(v.name, LIMITS.name) && isColor(v.color);

const isOptionalText = (v: unknown, max: number): v is string | undefined =>
  v === undefined || (typeof v === "string" && v.length <= max);

/** "" and whitespace mean "no description" */
const cleanDescription = (v: string | undefined) => v?.trim() || undefined;

const isRsvp = (v: unknown): v is TRsvp => RSVP_ANSWERS.includes(v as TRsvp);

/** absent on most plans; a deleted plan coming back (undo) brings its answers along */
const isRsvpMap = (v: unknown): v is Record<string, TRsvp> | undefined =>
  v === undefined ||
  (isRecord(v) &&
    Object.keys(v).length <= LIMITS.people &&
    Object.entries(v).every(([id, answer]) => isId(id) && isRsvp(answer)));

const isPlan = (v: unknown): v is TPlan =>
  isRecord(v) &&
  isId(v.id) &&
  isText(v.title, LIMITS.title) &&
  isOptionalText(v.description, LIMITS.description) &&
  isDay(v.start) &&
  isDay(v.end) &&
  isId(v.createdBy) &&
  daysBetween(v.start, v.end) >= 0 &&
  daysBetween(v.start, v.end) < LIMITS.planDays &&
  isRsvpMap(v.rsvp);

const isStamp = (v: unknown): v is TStamp =>
  isRecord(v) &&
  isDay(v.day) &&
  isId(v.personId) &&
  isStampLabel(v.label) &&
  (v.seed === undefined || isStampSeed(v.seed));

const isPosition = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v) && Math.abs(v) <= LIMITS.notePosition;

const maxNoteText = (kind: TNote["kind"]) =>
  kind === "label" ? LIMITS.labelText : LIMITS.noteText;

const isNote = (v: unknown): v is TNote =>
  isRecord(v) &&
  isId(v.id) &&
  (v.kind === "note" || v.kind === "label") &&
  isText(v.text, maxNoteText(v.kind)) &&
  isPosition(v.x) &&
  isPosition(v.y) &&
  isId(v.createdBy) &&
  typeof v.createdAt === "number" &&
  Number.isFinite(v.createdAt);

export const parseAction = (v: unknown): TCalendarAction | null => {
  if (!isRecord(v)) return null;

  switch (v.type) {
    case "person":
      return isPerson(v.person) ? { type: "person", person: v.person } : null;
    case "availability":
      return isId(v.personId) && isDay(v.day) && typeof v.available === "boolean"
        ? { type: "availability", personId: v.personId, day: v.day, available: v.available }
        : null;
    case "plan-add":
      return isPlan(v.plan)
        ? {
            type: "plan-add",
            plan: {
              ...v.plan,
              title: v.plan.title.trim(),
              description: cleanDescription(v.plan.description),
            },
          }
        : null;
    case "plan-update":
      return isId(v.id) &&
        isText(v.title, LIMITS.title) &&
        isOptionalText(v.description, LIMITS.description)
        ? {
            type: "plan-update",
            id: v.id,
            title: v.title.trim(),
            description: cleanDescription(v.description),
          }
        : null;
    case "plan-delete":
      return isId(v.id) ? { type: "plan-delete", id: v.id } : null;
    case "plan-rsvp":
      return isId(v.id) && isId(v.personId) && (v.answer === null || isRsvp(v.answer))
        ? { type: "plan-rsvp", id: v.id, personId: v.personId, answer: v.answer }
        : null;
    case "stamp":
      return isStamp(v.stamp) && typeof v.on === "boolean"
        ? {
            type: "stamp",
            stamp: {
              day: v.stamp.day,
              personId: v.stamp.personId,
              label: v.stamp.label,
              ...(v.stamp.seed ? { seed: v.stamp.seed } : {}),
            },
            on: v.on,
          }
        : null;
    case "stamp-def":
      return isStampLabel(v.label) &&
        v.label === normalizeStamp(v.label) &&
        (v.icon === null || isStampIcon(v.icon))
        ? { type: "stamp-def", label: v.label, icon: v.icon }
        : null;
    case "stamp-label-delete":
      return isStampLabel(v.label) ? { type: v.type, label: v.label } : null;
    case "note-add":
      return isNote(v.note)
        ? {
            type: "note-add",
            note: {
              id: v.note.id,
              kind: v.note.kind,
              text: v.note.text.trim(),
              x: Math.round(v.note.x),
              y: Math.round(v.note.y),
              createdBy: v.note.createdBy,
              createdAt: v.note.createdAt,
            },
          }
        : null;
    case "note-update":
      // the longer limit: which kind this id is gets known only once the note is read
      return isId(v.id) && isText(v.text, LIMITS.noteText)
        ? { type: "note-update", id: v.id, text: v.text.trim() }
        : null;
    case "note-move":
      return isId(v.id) && isPosition(v.x) && isPosition(v.y)
        ? { type: "note-move", id: v.id, x: Math.round(v.x), y: Math.round(v.y) }
        : null;
    case "note-delete":
      return isId(v.id) ? { type: "note-delete", id: v.id } : null;
    case "note-vote":
      return isId(v.noteId) && isId(v.personId) && typeof v.on === "boolean"
        ? { type: "note-vote", noteId: v.noteId, personId: v.personId, on: v.on }
        : null;
    default:
      return null;
  }
};
