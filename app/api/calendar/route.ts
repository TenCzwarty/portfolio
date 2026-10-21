import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";

import type { TCalendarData, TPerson, TPlan } from "~/app/utils/free-zone/_types";
import { findByName } from "~/app/utils/free-zone/_utils/identity";
import { withRsvp } from "~/app/utils/free-zone/_utils/rsvp";
import {
  DEFAULT_STAMPS,
  parseStamp,
  serializeStamp,
  stampKey,
} from "~/app/utils/free-zone/_utils/stamps";
import { LIMITS, parseAction } from "~/app/utils/free-zone/_utils/validate";

export const dynamic = "force-dynamic";

// keys keep the original "kalendarz:" prefix so existing data survives the rename
const KEY_PEOPLE = "kalendarz:people";
const KEY_PLANS = "kalendarz:plans";
const KEY_AVAILABILITY = "kalendarz:availability";
const KEY_STAMPS = "kalendarz:stamps";
// label -> { icon? }; a hash because set members get number-parsed by Upstash ("007" -> 7)
const KEY_STAMP_DEFS = "kalendarz:stamp-defs";
// labels added before icons existed - still read, no longer written
const KEY_CUSTOM_STAMPS = "kalendarz:custom-stamps";

/**
 * The Vercel Marketplace integration injects KV_REST_API_URL / KV_REST_API_TOKEN, but lets you
 * pick a custom prefix (e.g. CALENDAR_KV_REST_API_URL), so accept any matching URL + TOKEN pair.
 */
const findRedisEnv = () => {
  const { UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: token } = process.env;
  if (url && token) return { url, token };

  for (const [key, value] of Object.entries(process.env)) {
    if (!key.endsWith("REST_API_URL") || !value) continue;
    const pairedToken = process.env[key.replace(/REST_API_URL$/, "REST_API_TOKEN")];
    if (pairedToken) return { url: value, token: pairedToken };
  }

  console.error(
    "[calendar] no Redis REST env found, candidates:",
    Object.keys(process.env).filter((k) => /REDIS|KV|UPSTASH|REST_API/.test(k))
  );
  return null;
};

let redis: Redis | null = null;
const getRedis = () => {
  if (redis) return redis;
  const env = findRedisEnv();
  return env ? (redis = new Redis(env)) : null;
};

const sha256 = (value: string) => createHash("sha256").update(value).digest();

const canEdit = (request: Request) => {
  const secret = process.env.KALENDARZ_SECRET;
  const key = request.headers.get("x-calendar-key");

  if (!secret || !key) return false;

  return timingSafeEqual(sha256(secret), sha256(key));
};

const error = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status });

export async function GET(request: Request) {
  const db = getRedis();
  if (!db) return error("Redis is not configured", 503);
  // names, plans and who-is-where are private: without the secret nothing leaves the server
  if (!canEdit(request)) return error("This calendar is private", 401);

  const [people, plans, availability, stamps, legacyCustomStamps, stampDefs] = await Promise.all([
    db.hgetall<Record<string, TPerson>>(KEY_PEOPLE),
    db.hgetall<Record<string, TPlan>>(KEY_PLANS),
    db.smembers(KEY_AVAILABILITY),
    db.smembers(KEY_STAMPS),
    db.smembers(KEY_CUSTOM_STAMPS),
    db.hgetall<Record<string, { icon?: string }>>(KEY_STAMP_DEFS),
  ]);

  const availabilityByPerson: TCalendarData["availability"] = {};
  for (const entry of availability) {
    const [day, personId] = String(entry).split("|");
    (availabilityByPerson[personId] ??= []).push(day);
  }

  const data: TCalendarData & { canEdit: boolean } = {
    people: Object.values(people ?? {}),
    plans: Object.values(plans ?? {}).sort((a, b) => a.start.localeCompare(b.start)),
    availability: availabilityByPerson,
    stamps: stamps.map((m) => parseStamp(String(m))).filter((s) => s !== null),
    customStamps: [...new Set([...legacyCustomStamps.map(String), ...Object.keys(stampDefs ?? {})])]
      .filter((label) => !DEFAULT_STAMPS.includes(label))
      .sort(),
    stampIcons: Object.fromEntries(
      Object.entries(stampDefs ?? {}).flatMap(([label, def]) =>
        def?.icon ? [[label, def.icon]] : []
      )
    ),
    canEdit: true,
  };

  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const db = getRedis();
  if (!db) return error("Redis is not configured", 503);
  if (!canEdit(request)) return error("Missing or wrong secret link", 401);

  const action = parseAction(await request.json().catch(() => null));
  if (!action) return error("Invalid data", 400);

  switch (action.type) {
    case "person": {
      const people = Object.values((await db.hgetall<Record<string, TPerson>>(KEY_PEOPLE)) ?? {});
      const exists = people.some((p) => p.id === action.person.id);
      if (!exists && people.length >= LIMITS.people) return error("Too many people", 409);

      const namesake = findByName(people, action.person.name);
      if (namesake && namesake.id !== action.person.id) {
        return error(`The name "${namesake.name}" is already taken`, 409);
      }
      const { id, name, color } = action.person;
      await db.hset(KEY_PEOPLE, { [id]: { id, name: name.trim(), color } });
      break;
    }
    case "availability": {
      if (!(await db.hexists(KEY_PEOPLE, action.personId))) {
        return error("Unknown person", 404);
      }
      const member = `${action.day}|${action.personId}`;
      if (action.available) await db.sadd(KEY_AVAILABILITY, member);
      else await db.srem(KEY_AVAILABILITY, member);
      break;
    }
    case "plan-add": {
      if ((await db.hlen(KEY_PLANS)) >= LIMITS.plans) return error("Too many plans", 409);
      const { id, title, description, start, end, createdBy, rsvp } = action.plan;
      await db.hset(KEY_PLANS, { [id]: { id, title, description, start, end, createdBy, rsvp } });
      break;
    }
    case "plan-rsvp": {
      const plan = await db.hget<TPlan>(KEY_PLANS, action.id);
      if (!plan) return error("Unknown plan", 404);
      if (!(await db.hexists(KEY_PEOPLE, action.personId))) return error("Unknown person", 404);
      const rsvp = withRsvp(plan.rsvp, action.personId, action.answer);
      await db.hset(KEY_PLANS, { [action.id]: { ...plan, rsvp } });
      break;
    }
    case "plan-update": {
      const plan = await db.hget<TPlan>(KEY_PLANS, action.id);
      if (!plan) return error("Unknown plan", 404);
      const { title, description } = action;
      await db.hset(KEY_PLANS, { [action.id]: { ...plan, title, description } });
      break;
    }
    case "stamp": {
      if (!(await db.hexists(KEY_PEOPLE, action.stamp.personId))) {
        return error("Unknown person", 404);
      }
      // the same stamp may sit there under an older seed - replace or remove it whatever its seed
      const key = stampKey(action.stamp);
      const existing = (await db.smembers(KEY_STAMPS))
        .map(String)
        .filter((m) => m === key || m.startsWith(`${key}|`));
      if (existing.length) await db.srem(KEY_STAMPS, ...existing);
      if (action.on) await db.sadd(KEY_STAMPS, serializeStamp(action.stamp));
      break;
    }
    case "stamp-def": {
      const { label, icon } = action;
      const isKnown =
        DEFAULT_STAMPS.includes(label) ||
        (await db.hexists(KEY_STAMP_DEFS, label)) ||
        (await db.sismember(KEY_CUSTOM_STAMPS, label));
      if (!isKnown && (await db.hlen(KEY_STAMP_DEFS)) >= LIMITS.customStamps) {
        return error("Too many custom stamps", 409);
      }
      await db.hset(KEY_STAMP_DEFS, { [label]: icon ? { icon } : {} });
      break;
    }
    // stamps already placed with this label stay - only the shortcut disappears
    case "stamp-label-delete":
      if (DEFAULT_STAMPS.includes(action.label)) break;
      await db.hdel(KEY_STAMP_DEFS, action.label);
      await db.srem(KEY_CUSTOM_STAMPS, action.label);
      break;
    case "plan-delete":
      await db.hdel(KEY_PLANS, action.id);
      break;
  }

  return NextResponse.json({ ok: true });
}
