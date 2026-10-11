import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";

import type { TCalendarData, TPerson, TPlan } from "~/app/utils/kalendarz/_types";
import { LIMITS, parseAction } from "~/app/utils/kalendarz/_utils/validate";

export const dynamic = "force-dynamic";

const KEY_PEOPLE = "kalendarz:people";
const KEY_PLANS = "kalendarz:plans";
const KEY_AVAILABILITY = "kalendarz:availability";

// UPSTASH_REDIS_REST_* or KV_REST_API_* (what the Vercel Marketplace integration injects)
const hasRedisEnv = () =>
  Boolean(
    (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
    (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN)
  );

let redis: Redis | null = null;
const getRedis = () => (redis ??= Redis.fromEnv());

const sha256 = (value: string) => createHash("sha256").update(value).digest();

const canEdit = (request: Request) => {
  const secret = process.env.KALENDARZ_SECRET;
  const key = request.headers.get("x-kalendarz-key");

  if (!secret || !key) return false;

  return timingSafeEqual(sha256(secret), sha256(key));
};

const error = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status });

export async function GET(request: Request) {
  if (!hasRedisEnv()) return error("Brak konfiguracji Redis", 503);

  const db = getRedis();
  const [people, plans, availability] = await Promise.all([
    db.hgetall<Record<string, TPerson>>(KEY_PEOPLE),
    db.hgetall<Record<string, TPlan>>(KEY_PLANS),
    db.smembers(KEY_AVAILABILITY),
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
    canEdit: canEdit(request),
  };

  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!hasRedisEnv()) return error("Brak konfiguracji Redis", 503);
  if (!canEdit(request)) return error("Zły albo brakujący sekretny link", 401);

  const action = parseAction(await request.json().catch(() => null));
  if (!action) return error("Niepoprawne dane", 400);

  const db = getRedis();

  switch (action.type) {
    case "person": {
      const exists = await db.hexists(KEY_PEOPLE, action.person.id);
      if (!exists && (await db.hlen(KEY_PEOPLE)) >= LIMITS.people) {
        return error("Za dużo osób", 409);
      }
      const { id, name, color } = action.person;
      await db.hset(KEY_PEOPLE, { [id]: { id, name: name.trim(), color } });
      break;
    }
    case "availability": {
      if (!(await db.hexists(KEY_PEOPLE, action.personId))) {
        return error("Nieznana osoba", 404);
      }
      const member = `${action.day}|${action.personId}`;
      if (action.available) await db.sadd(KEY_AVAILABILITY, member);
      else await db.srem(KEY_AVAILABILITY, member);
      break;
    }
    case "plan-add": {
      if ((await db.hlen(KEY_PLANS)) >= LIMITS.plans) return error("Za dużo planów", 409);
      const { id, title, start, end, createdBy } = action.plan;
      await db.hset(KEY_PLANS, { [id]: { id, title: title.trim(), start, end, createdBy } });
      break;
    }
    case "plan-delete":
      await db.hdel(KEY_PLANS, action.id);
      break;
  }

  return NextResponse.json({ ok: true });
}
