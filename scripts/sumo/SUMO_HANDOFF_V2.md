# Sumo Card Tracker — Claude Code Handoff (v2)

A personal sumo trading-card catalog being added to an existing **Next.js + TypeScript
portfolio** at `app/utils/sumo/`. The owner collects BBM sumo cards and wants a
browsable, eventually trackable catalog of the Reiwa era (2020–present).

This document covers domain knowledge, verified data sources, the data model, and goals.
You write and run the scripts — the architecture decisions are made, the sources are
confirmed, the gotchas are documented.

---

## 1. Reference implementation

There is an existing util that is the **direct template**: **`app/utils/hanayama/`**
(a Hanayama puzzle tracker). Read it before writing anything — it defines the repo's
conventions: `T`-prefixed types, `_const`/`_components`/`_helpers` layout,
per-component folders, shared `components/*` (pill, section, etc.).

---

## 2. Domain knowledge (this is the stuff nobody tells you)

### One company, themed series, layered cards

**BBM (Baseball Magazine Co., Ltd.)** is the only modern sumo card publisher. Every
release since 1997 is BBM. Shops like bigsumofan, haruyama365, gachakawa are
importers/resellers — not manufacturers.

Each year has **2+ series**, released roughly:
- **Series 1** (January) — the ranking-based annual, based on the previous November banzuke.
- **Series 2** (May–September) — a themed concept set with a Japanese name.
- Occasional **specials** (e.g. 2021 "Legend" Heroes — retired greats).

The Series 2 names follow a pattern — each year gets an evocative kanji:

| Year | S2 name | Meaning |
|------|---------|---------|
| 2020 | Shin    | New     |
| 2021 | Takumi  | Artisan |
| 2022 | Hana    | Flower  |
| 2023 | Kizuna  | Bonds   |
| 2024 | Hibiki  | Echo    |
| 2025 | Nagomi  | Calm    |
| 2026 | Sato    | Hometown (Onosato-themed) |

### The two-axis model (this is the whole schema)

A card has two **orthogonal** axes. Never collapse them:

- **Subset** = which checklist the card sits on: `base`, `holo`, `autograph`,
  `combo-auto`, `insert`.
- **Finish** = which printing you're holding: standard, Sparkle, gold foil, 1-of-1.

A single card identity (`set + subset + number`) can have multiple finishes. A parallel
is NOT a new card — it's a new finish on the same card.

| Type | What changed | Has a base twin? | Schema axis |
|------|-------------|-------------------|-------------|
| Parallel (Sparkle/gold/foil) | the *printing* | yes | **finish** on the same card |
| Insert (Giant Stars, TREASURE) | the *card itself* | no | **new subset** |
| Autograph | card + real *signature* | no | **subset**, chase tier |

### Base set structure

A ~90-card base set isn't 90 loose cards — it's themed chapters numbered inline:
- **Regular** (01–42): Makuuchi (top division) wrestlers
- **Regular** (43–70): Juryo (second division) wrestlers
- **Themed subsets** (71–90): varies by year — e.g. "Promising Youth", "Off-shot"
  (candid photos), retirement tributes, "Lucky Charm", "Opening Pitch", etc.

Some base cards feature **two wrestlers** (dual cards) — e.g. card #81 in 2020 is
"Mitakeumi / Tamawashi". The `rikishi` field is ALWAYS an array for this reason.

### What checklists do and don't tell you

Box-bottom checklists (and TCDB) enumerate the **base set completely**. But:
- **Parallels** are described as *rules* ("Sparkle exists for the 42 top-division cards
  + 14 subset cards"), not per-card annotations.
- **Autographs** are often deferred — the 2020 checklist literally says "types and counts
  will be announced later on bbm-japan.com."

So the base index comes from checklists; parallel rules come from shop descriptions;
autograph rosters come from post-release announcements or community tracking.

### Rikishi name changes

Wrestlers change ring names (shikona) on promotion. A card carries `title` = the name
*as printed*; the `rikishi` reference points to the canonical person. Example: card #56
in 2020 reads "Kotonowaka Masahiro" — but that person later became "Kotozakura" on Ozeki
promotion. Both truths are preserved, no collision.

---

## 3. Reiwa-era set index (~15 sets total)

This is the complete scope. TCDB set IDs (sid) are included where known:

| Code | Year | Series | TCDB sid | Name | Base count |
|------|------|--------|----------|------|-----------|
| 20s1 | 2020 | 1 | 245799 | 2020 BBM Sumo | 90 |
| 20s2 | 2020 | 2 | 245801 | 2020 BBM Sumo Shin | 81 |
| 21s1 | 2021 | 1 | ? | 2021 BBM Sumo | ? |
| 21h  | 2021 | — | ? | 2021 BBM Sumo "Legend" Heroes | ? |
| 21s2 | 2021 | 2 | ? | 2021 BBM Sumo Takumi | ? |
| 22s1 | 2022 | 1 | ? | 2022 BBM Sumo | ? |
| 22s2 | 2022 | 2 | ? | 2022 BBM Sumo Hana | ? |
| 23s1 | 2023 | 1 | ? | 2023 BBM Sumo | ? |
| 23s2 | 2023 | 2 | ? | 2023 BBM Grand Sumo Kizuna | ? |
| 24s1 | 2024 | 1 | 401926 | 2024 BBM Sumo | 90 |
| 24s2 | 2024 | 2 | ? | 2024 BBM Sumo Hibiki | ? |
| 25s1 | 2025 | 1 | ? | 2025 BBM Sumo | ? |
| 25s2 | 2025 | 2 | ? | 2025 BBM Sumo Nagomi | ? |
| 26s1 | 2026 | 1 | ? | 2026 BBM Sumo | 90 |
| 26s2 | 2026 | 2 | ? | 2026 BBM Sumo Sato | ? |

To find missing sids: search TCDB's BBM Wrestling brand page or the per-year Wrestling
pages. The URL pattern is `https://www.tcdb.com/ViewAll.cfm/sp/Wrestling/brand/BBM`.

---

## 4. Verified data sources (what works, what doesn't, what's blocked)

### TCDB (tcdb.com) — the structured source

Three endpoints per set. All confirmed working via actual fetch:

| Endpoint | Allowed? | Paginated? | What it gives you |
|----------|----------|------------|-------------------|
| `Checklist.cfm/sid/{sid}` | **YES** | **No** (full set, one page) | Card number, name, cid, person pid. **Best index source.** |
| `Gallery.cfm/sid/{sid}` | **YES** | Yes (10/page) | Front-image URL + number/name in `alt` text. **Best image source.** |
| `PrintChecklist.cfm` | **NO** (robots.txt) | — | Blocked. Don't fetch it. |

The Checklist page gives you structured links like:
```
[56](https://www.tcdb.com/ViewCard.cfm/sid/245799/cid/15286924/2020-BBM-Sumo-56-Kotonowaka-Masahiro)
[Kotonowaka Masahiro](https://www.tcdb.com/Person.cfm/pid/302686/Kotonowaka-Masahiro)
```
So from the URL alone you get: sid, cid, card number, name (romaji), person pid.

The Gallery page front-image URLs follow a stable pattern:
```
https://www.tcdb.com/Images/Cards/Wrestling/{sid}/{sid}-{cid}Fr.jpg
```

The `Inserts.cfm/sid/{sid}` page links to related sub-sets (autographs, parallels) —
worth fetching to discover sibling checklists.

**Politeness rules (non-negotiable):**
- One request at a time, ≥2s delay between requests to the same host.
- Respect robots.txt (the pipeline's fetcher does this automatically).
- Identify yourself: set a User-Agent with a contact URL.
- Cache everything to disk; re-runs read from cache.
- Don't lower the delays. TCDB is a community hobby site, not a CDN.

### sumo-api.com — rikishi metadata (real API, free)

A documented REST API with endpoints like `/api/rikishis`, `/api/rikishi/{id}`.
Paginated (limit 1000, skip N). Returns shikona, kanji, rank, heya, height, weight,
debut, retirement. **Use this for wrestler reference data — no scraping needed.**

Be polite: it's run at someone's personal expense.

### bigsumofan.com — supplementary info

Product pages describe parallel rules, autograph rosters, pack composition, and subset
breakdowns in English prose. Useful for filling in what TCDB checklists don't cover
(which parallels exist, how many autos, etc.). Not a scraping target — read as reference.

### imageevent.com/supplex55 — visual archive

One collector's photo album of Reiwa-era BBM cards. Has gaps (it's one person's
collection, not a complete catalog). Can bulk-download but filenames are generic
(`screenshot-1234.jpg`). Lower priority than TCDB gallery images, which come
pre-associated with card numbers.

---

## 5. Data model

### Output files (what the app imports)

```
app/utils/sumo/_const/
  cards.json      ← sets → cards → finishes (the catalog)
  rikishi.json    ← wrestler reference data, keyed by slug id
  types.ts        ← TSumoSet, TSumoCard, TFinish, TRikishi, etc.
  index.ts        ← getAllSets(), getAllCards(), getRikishi(), getCardName()
```

### Schema shape

```jsonc
// cards.json — array of sets
[{
  "code": "20s1",
  "set": "2020 BBM Sumo",
  "line": "Sumo",
  "year": 2020,
  "series": 1,
  "label": null,
  "subsets": ["base"],
  "cards": [{
    "id": "20s1.base.01",
    "code": "01",
    "number": "01",
    "subset": "base",
    "rikishi": ["kakuryu"],           // ALWAYS an array (dual cards carry two)
    "theme": "regular",               // base-set chapter
    "rankAtIssue": "Yokozuna",        // rank as printed (point-in-time)
    "title": null,                    // only set when name-as-printed differs from canonical
    "src": "01.jpg",                  // image filename, if available
    "finishes": [
      { "id": "std", "name": "Base", "printRun": null },
      { "id": "sparkle", "name": "Sparkle", "printRun": null, "effect": "holo" },
      { "id": "gold", "name": "Gold /50", "printRun": 50, "chase": true, "effect": "foil" }
    ]
  }]
}]

// rikishi.json — keyed by slug
{
  "kakuryu": {
    "shikona": "Kakuryu Rikisaburo",
    "kanji": "鶴竜 力三郎",
    "topRank": "Yokozuna",
    "country": "Mongolia"
  }
}
```

Key rules:
- `rikishi` is always an array (combo/dual cards carry 2+).
- `finish.printRun: null` means "unnumbered" — this is normal, not an error.
- `finish.chase: true` marks trophy tier (autos, 1-of-1s). Excluded from future % complete.
- `finish.effect` drives CSS effects on the website: `"holo"` for shimmer, `"foil"` for
  metallic, `"prismatic"` for rainbow. Null = matte/standard.
- `title` overrides display name only when the printed name differs from the person's
  current shikona (e.g. Kotonowaka on a card, Kotozakura now).
- `theme` captures base-set chapters: `"regular"`, `"off-shot"`, `"promising-youth"`,
  `"kisenosato-tribute"`, `"lucky-charm"`, `"opening-pitch"`, etc.

### Ownership (deferred, but the seam is defined)

Not built yet. When it lands, ownership keys on `${card.id}@${finish.id}` — finish-level,
not card-level. Storage key reserved: `STORAGE_KEY_OWNED_FINISHES = "sumo-owned-finishes"`.

---

## 6. Goals (in order)

### Phase 1: Build the catalog (do this now)

1. **Discover all Reiwa-era TCDB set IDs.** Start from the set index above; find missing
   sids by fetching TCDB's BBM Wrestling pages.

2. **For each set, fetch `Checklist.cfm/sid/{sid}`** — this gives the complete card index
   (number + name + cid + person pid) in one unpaginated page. Parse it.

3. **For each set, fetch `Gallery.cfm/sid/{sid}`** (paginated, 10/page) — download front
   images, named by card number. Not all cards will have images (TCDB is ~50% imaged for
   sumo). That's normal, not a failure.

4. **Fetch rikishi data from sumo-api.com** (`/api/rikishis`, paginated by 1000) for
   wrestler metadata (kanji, rank, heya, etc.).

5. **Build the catalog:** normalize scraped data into the schema above. Merge parallels
   into finishes (same card identity = one card, multiple finishes). Output `cards.json`
   + `rikishi.json` into `app/utils/sumo/_const/`.

### Phase 2: Build the read-only view

A page at `app/utils/sumo/` mirroring the hanayama util. Grouped by set, each card
showing its finishes. **Placeholder-first images** — the page must render correctly with
zero images on disk. No broken-image icons.

**Explicitly deferred (do not build):**
- Ownership / collected state / localStorage
- Percentage complete
- URL share encode/decode
- Filters

### Phase 3 (future, not now): Ownership tracking, filters, holographic CSS effects

The `effect` field on finishes is the hook for CSS holo/foil shaders. The `chase` flag
is the hook for percentage-complete denominator fencing. The filter system ports from
hanayama's `useToggleableArray`. None of this is Phase 1 or 2.

---

## 7. Known gotchas

- **TCDB images are user-contributed scans.** Coverage is partial (~50% for 2020 S1).
  Missing images = unscanned, not a scraper bug. Design for gaps.
- **Some TCDB entries have kanji-only names** (no romaji). Cards #54 and #70 in the 2020
  set show as 一山本大生 and 彩尊光. Cross-reference with sumo-api.com or flag for manual
  resolution.
- **Dual-wrestler cards** exist in the base set (e.g. 2020 #81, #88). The `/` separator
  in the name on TCDB is the signal. Split into two rikishi references.
- **Copyright:** card images are BBM's artwork. Keep images local or show only thumbnails.
  The catalog JSON (names, numbers, print runs) is facts and safe to publish. Flag the
  image-publishing decision to the owner rather than deciding it.
- **Don't lower scraper delays.** The politeness is load-bearing.
