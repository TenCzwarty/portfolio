import type { TCalendarAction, TDay, TPerson, TPlan, TStamp } from "../_types";

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

const isPlan = (v: unknown): v is TPlan =>
  isRecord(v) &&
  isId(v.id) &&
  isText(v.title, LIMITS.title) &&
  isOptionalText(v.description, LIMITS.description) &&
  isDay(v.start) &&
  isDay(v.end) &&
  isId(v.createdBy) &&
  daysBetween(v.start, v.end) >= 0 &&
  daysBetween(v.start, v.end) < LIMITS.planDays;

const isStamp = (v: unknown): v is TStamp =>
  isRecord(v) &&
  isDay(v.day) &&
  isId(v.personId) &&
  isStampLabel(v.label) &&
  (v.seed === undefined || isStampSeed(v.seed));

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
    default:
      return null;
  }
};
