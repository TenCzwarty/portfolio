#!/usr/bin/env node
// -----------------------------------------------------------------------------
// Builds app/utils/sumo/_const/rikishi.json from sumo-api.com and points every
// card in cards.json at one canonical slug per person.
//
// Usage (run from scripts/sumo/):
//   node build-rikishi.mjs              # fetch (cached) + match + write both files
//   node build-rikishi.mjs --dry-run    # report matches, write nothing
//
// Every response is cached in cache/sumo-api/, so re-runs are free.
// sumo-api.com is run at someone's personal expense: one request at a time,
// 1s apart. Don't lower it.
//
// Matching: card slugs come from the name as printed on the card (TCDB), e.g.
// "kotonowaka-masahiro". Each rikishi's shikona history (/api/shikonas) is
// searched for that name, so pre-promotion names still resolve to the right
// person (Kotonowaka -> Kotozakura). Retired legends are matched on their full
// name. Whatever's left over is mostly not a rikishi at all (gyoji, mascots,
// group shots) and keeps its original slug.
//
// Canonical slug = current shikona + latest given name, e.g. "kotozakura-masahiro".
// The card's `title` keeps the name as printed.
// -----------------------------------------------------------------------------

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const API = "https://www.sumo-api.com/api";
const UA = "portfolio sumo-card-tracker (https://the.fourth.one)";
const DELAY_MS = 1000;
const CACHE_DIR = "cache/sumo-api";
const CARDS_PATH = "../../app/utils/sumo/_const/cards.json";
const OUT_PATH = "../../app/utils/sumo/_const/rikishi.json";
// Only rikishi who could appear on a Reiwa-era card (legends handled separately)
const ERA_START = "2019-01-01";
// rankValue: Yokozuna 1xx, Ozeki 2xx … Juryo 6xx, Makushita 7xx, Sandanme 8xx
const MAKUSHITA_CUTOFF = 800;

// Card id -> rikishi slugs, for cards whose TCDB name couldn't be slugged
const CARD_FIXES = {
  "20s1.base.54": ["ichiyamamoto"], // TCDB has kanji only: 一山本大生
  "20s1.base.70": ["irodori"], // TCDB has kanji only: 彩尊光
  "26s2.base.57": ["asakoryu", "ura", "gonoyama"], // trio card, slugged as two
  "26s2.base.60": ["wakatakakage", "wakamotoharu"], // "Onami Brothers !"
  "26s2.base.61": ["kotoshoho", "kotoeiho"], // "Tebakari Brothers !"
  "26s2.base.62": ["asakoryu", "asasuiryu"], // "Ishizaki Brothers !"
};

// Slug -> sumo-api rikishi id, for names the matcher can't resolve
const OVERRIDES = {
  midorifuj: 34, // TCDB typo
  midorofuji: 34, // TCDB typo
  "chiyondo-miyohito": 184, // TCDB lost the ō: Chiyonoō
  irodori: 705,
  yoshinofuji: 8857, // several historic Yoshinofujis
  "yoshinofuji-naoya": 8857,
  "fujinokawa-seigo": 615,
  "takanosho-nobuakiu": 37, // TCDB typo
  "shohozan-yuyau": 673, // TCDB typo
  "tohakuryu-masashito": 54, // TCDB typo
  // Kakuryu career-milestone cards
  "kakuryu-juryo-promotion": 3181,
  "kakuryu-makuuchi-debut": 3181,
  "kakuryu-ozeki-promotion": 3181,
  "kakuryu-first-emperor": 3181,
  "kakuryu-yokozuna-promotion": 3181,
  "fujiryoga-masaharu": 9051, // given name never recorded in the API
};

// Slugs that are not rikishi but share a name with one
const NOT_RIKISHI = new Set([
  // 24s2 yobidashi cards, known by given name only
  "jiro",
  "katsuyuki",
  "shiro",
  "shigeo",
  "goro",
]);

const dryRun = process.argv.includes("--dry-run");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let lastRequest = 0;
const getJson = async (urlPath) => {
  const file = path.join(CACHE_DIR, urlPath.replace(/[^a-z0-9]+/gi, "_") + ".json");
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {}

  const wait = lastRequest + DELAY_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastRequest = Date.now();

  const res = await fetch(API + urlPath, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${urlPath}`);
  const data = await res.json();
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(file, JSON.stringify(data));
  return data;
};

// Same rules the catalog uses for slugs: strip diacritics, kebab-case
const slugify = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Looser form for matching: also folds romanization variants (Kotoōshū/Kotooshu)
const normalize = (s) => slugify(s).replace(/ou/g, "o").replace(/uu/g, "u");

const shikonaOf = (s) => normalize(s).split("-")[0];

// "Mongolia, Ulaanbaatar" -> "Mongolia"; "Hyogo-ken, Ashiya-shi" / "Aichi" -> "Japan"
// "Georgia (old), Tbilissi - Georgia, Tbilissi" -> "Georgia"
const countryOf = (shusshin) => {
  if (!shusshin) return null;
  if (!shusshin.includes(",")) return "Japan";
  const first = shusshin
    .split(",")[0]
    .replace(/\(.*\)/, "")
    .trim();
  return /-(ken|to|fu)$|^Hokkaido$|^Tokyo$|^Osaka$|^Kyoto$/i.test(first) ? "Japan" : first;
};

// "Maegashira 6 East" -> "Maegashira"
const rankName = (rank) => rank.split(" ")[0];

const main = async () => {
  const cardsRaw = await readFile(CARDS_PATH, "utf8");
  const sets = JSON.parse(cardsRaw);
  const cards = sets.flatMap((set) => set.cards);

  for (const card of cards) if (CARD_FIXES[card.id]) card.rikishi = CARD_FIXES[card.id];

  const slugs = new Map(); // slug -> printed name (first seen)
  for (const card of cards)
    card.rikishi.forEach((slug, i) => {
      if (!slugs.has(slug)) slugs.set(slug, card.title.split(" / ")[i] ?? card.title);
    });
  console.log(`${slugs.size} rikishi slugs on cards`);

  // 1. Every rikishi, retired included
  const all = [];
  for (let skip = 0; ; skip += 1000) {
    const page = await getJson(`/rikishis?limit=1000&skip=${skip}&intai=true`);
    all.push(...page.records);
    if (skip + 1000 >= page.total) break;
  }
  const byId = new Map(all.map((r) => [r.id, r]));
  const eraRikishi = all.filter((r) => !r.intai || r.intai >= ERA_START);
  console.log(`${all.length} rikishi from API, ${eraRikishi.length} active since ${ERA_START}`);

  // Everyone who held a Makushita-or-higher rank in an era basho
  const rankedIds = new Set();
  const lastBasho = new Date().toISOString().slice(0, 7).replace("-", "");
  for (let y = Number(ERA_START.slice(0, 4)); `${y}01` <= lastBasho; y++)
    for (const m of ["01", "03", "05", "07", "09", "11"]) {
      const bashoId = `${y}${m}`;
      if (bashoId > lastBasho) break;
      for (const rank of await getJson(`/ranks?bashoId=${bashoId}`))
        if (rank.rankValue < MAKUSHITA_CUTOFF) rankedIds.add(rank.rikishiId);
    }
  const eraRanked = all.filter((r) => rankedIds.has(r.id));
  console.log(`${eraRanked.length} rikishi ranked Makushita+ since ${ERA_START}`);

  // 2. Match slugs to people
  const byShikona = new Map();
  for (const r of eraRikishi) {
    const key = shikonaOf(r.shikonaEn);
    byShikona.set(key, [...(byShikona.get(key) ?? []), r]);
  }

  const historyCache = new Map();
  const historyOf = async (id) => {
    if (!historyCache.has(id)) historyCache.set(id, await getJson(`/shikonas?rikishiId=${id}`));
    return historyCache.get(id);
  };
  // Since 2025 the API stores shikona without the given name, so the given
  // name may only appear next to an older shikona ("Ishizaki Ryoma" ->
  // "Asasuiryu"). Pair every shikona with every given name the person had.
  const namesOf = async (r) => {
    const raw = [r.shikonaEn, ...(await historyOf(r.id)).map((h) => h.shikonaEn)].map(normalize);
    const shikonas = new Set(raw.map((n) => n.split("-")[0]));
    const givens = new Set(
      raw.filter((n) => n.includes("-")).map((n) => n.split("-").slice(1).join("-"))
    );
    return [...raw, ...[...shikonas].flatMap((s) => [...givens].map((g) => `${s}-${g}`))];
  };

  const matched = new Map(); // slug -> api record
  const unmatched = [];
  for (const [slug] of slugs) {
    if (OVERRIDES[slug]) {
      matched.set(slug, byId.get(OVERRIDES[slug]));
      continue;
    }
    if (!slug || NOT_RIKISHI.has(slug)) {
      unmatched.push(slug);
      continue;
    }

    const target = normalize(slug);
    // Some TCDB entries are given-name first ("Yuta Tomokaze")
    const reversed = target.split("-").reverse().join("-");
    const isMatch = async (r) => {
      const names = await namesOf(r);
      return names.includes(target) || names.includes(reversed);
    };
    const candidates = [
      ...new Set([
        ...(byShikona.get(shikonaOf(slug)) ?? []),
        ...(byShikona.get(shikonaOf(reversed)) ?? []),
      ]),
    ];

    let hit = null;
    for (const r of candidates) if (!hit && (await isMatch(r))) hit = r;
    // Name changed since the card: search everyone ranked Makushita+ in the era
    if (!hit) for (const r of eraRanked) if (!hit && (await isMatch(r))) hit = r;
    // Shikona-only card ("Ura") and exactly one era rikishi by that name
    const sameShikona = byShikona.get(target) ?? [];
    if (!hit && !target.includes("-") && sameShikona.length === 1) hit = sameShikona[0];
    // Retired legends: unique exact full-name match, no history needed
    if (!hit) {
      const legends = all.filter((r) => normalize(r.shikonaEn) === target);
      if (legends.length === 1) hit = legends[0];
    }

    if (hit) matched.set(slug, hit);
    else unmatched.push(slug);
  }

  // 3. One canonical slug per person: current shikona + latest given name
  const canonicalOf = new Map(); // api id -> slug
  for (const r of new Set(matched.values())) {
    const [shikona, ...given] = r.shikonaEn.trim().split(/\s+/);
    const latestGiven = (await historyOf(r.id))
      .filter((h) => h.shikonaEn.trim().includes(" "))
      .sort((a, b) => b.bashoId.localeCompare(a.bashoId))[0]
      ?.shikonaEn.trim()
      .split(/\s+/)
      .slice(1);
    const name = [shikona, ...(given.length ? given : (latestGiven ?? []))].join(" ");
    canonicalOf.set(r.id, slugify(name));
  }
  const taken = new Map();
  for (const [id, slug] of canonicalOf) {
    if (taken.has(slug))
      throw new Error(`canonical slug clash: ${slug} (${taken.get(slug)}, ${id})`);
    taken.set(slug, id);
  }
  const unmatchedSet = new Set(unmatched);
  for (const slug of unmatched)
    if (taken.has(slug)) throw new Error(`unmatched slug collides with canonical: ${slug}`);

  let renamed = 0;
  for (const card of cards)
    card.rikishi = card.rikishi.map((slug) => {
      if (unmatchedSet.has(slug)) return slug;
      const canonical = canonicalOf.get(matched.get(slug).id);
      if (canonical !== slug) renamed++;
      return canonical;
    });

  // 4. Career-best rank + kanji per person
  const out = {};
  for (const [id, slug] of [...canonicalOf].sort(([, a], [, b]) => a.localeCompare(b))) {
    const r = byId.get(id);
    const ranks = await getJson(`/ranks?rikishiId=${id}`);
    const best = ranks
      .filter((rank) => rank.rankValue && rank.rank)
      .reduce((a, b) => (!a || b.rankValue < a.rankValue ? b : a), null);
    const kanji =
      r.shikonaJp || (await historyOf(id)).map((h) => h.shikonaJp).find((jp) => jp) || null;

    out[slug] = {
      sumoApiId: id,
      shikona: r.shikonaEn,
      // "朝乃山　広暉" / "遠藤(えんどう)" -> "朝乃山 広暉" / "遠藤"
      kanji: kanji
        ? kanji
            .replace(/[(（].*$/, "")
            .replace(/　/g, " ")
            .trim()
        : null,
      topRank: best ? rankName(best.rank) : null,
      heya: r.heya || null,
      country: countryOf(r.shusshin),
      retired: Boolean(r.intai),
    };
  }

  const people = Object.keys(out).length;
  console.log(`\nmatched ${matched.size}/${slugs.size} slugs -> ${people} people`);
  console.log(`${renamed} card references renamed to canonical slugs`);
  if (unmatched.length) {
    console.log(`unmatched (${unmatched.length}), kept as-is:`);
    for (const slug of unmatched) console.log(`  ${slug || "(empty)"}  "${slugs.get(slug)}"`);
  }

  if (dryRun) return;
  await writeFile(OUT_PATH, JSON.stringify(out, null, 2) + "\n");
  await writeFile(
    CARDS_PATH,
    JSON.stringify(sets, null, 2) + (cardsRaw.endsWith("\n") ? "\n" : "")
  );
  console.log(`\nwrote ${people} rikishi to ${OUT_PATH} and updated ${CARDS_PATH}`);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
