#!/usr/bin/env node
// -----------------------------------------------------------------------------
// Sumo card image downloader
//
// Reads sumo-catalog-reiwa.json and downloads every card's front image from TCDB.
// Designed to run unattended for hours without getting you banned.
//
// Usage:
//   node download-images.mjs                          # all sets
//   node download-images.mjs --only=20s1              # one set
//   node download-images.mjs --dry-run                # see what it would do
//   node download-images.mjs --delay=5000             # 5s between requests (default 3s)
//   node download-images.mjs --catalog=path/to.json   # custom catalog path
//
// Resume: already-downloaded images are skipped. Kill it anytime, re-run later.
//
// Output layout:
//   images/
//     20s1/01.jpg
//     20s1/02.jpg
//     20s2/01.jpg
//     21h/001.jpg
//     ...
//
// ── POLITENESS (READ THIS) ──────────────────────────────────────────────────
// Default: 3 seconds between requests, one at a time, sequential.
// That's ~7 minutes per 90-card set, ~2.5 hours for all 1,278 cards.
// DO NOT lower the delay. TCDB is a community hobby site run by volunteers.
// If you're impatient, go do something else — the script is resumable.
//
// The User-Agent identifies the project. Change CONTACT_URL to your own site
// so an admin who sees traffic can reach you. Anonymous bots get banned;
// identifiable hobby projects get left alone.
// -----------------------------------------------------------------------------

import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ── Config ──────────────────────────────────────────────────────────────────

const DEFAULTS = {
  catalogPath: "sumo-catalog-reiwa.json",
  outDir: "images",
  delayMs: 3000,
  retries: 3,
  backoffBase: 10000,      // 10s base backoff on failure, doubles each retry
  contactUrl: "https://the.fourth.one",  // ← CHANGE THIS TO YOUR OWN
};

// ── Args ────────────────────────────────────────────────────────────────────

function parseArgs() {
  const opts = { ...DEFAULTS };
  for (const a of process.argv.slice(2)) {
    if (a === "--dry-run") opts.dryRun = true;
    else if (a === "--verbose") opts.verbose = true;
    else if (a.startsWith("--only=")) opts.only = a.slice(7);
    else if (a.startsWith("--delay=")) opts.delayMs = Number(a.slice(8));
    else if (a.startsWith("--catalog=")) opts.catalogPath = a.slice(10);
    else if (a.startsWith("--out=")) opts.outDir = a.slice(6);
    else if (a === "--help") {
      console.log(`
Sumo card image downloader

  node download-images.mjs [options]

Options:
  --only=CODE      Download one set only (e.g. --only=20s1)
  --delay=MS       Delay between requests in ms (default: ${DEFAULTS.delayMs})
  --catalog=PATH   Path to catalog JSON (default: ${DEFAULTS.catalogPath})
  --out=DIR        Output directory (default: ${DEFAULTS.outDir})
  --dry-run        List what would be downloaded, don't fetch
  --verbose        Print every skip/download
  --help           This message
`);
      process.exit(0);
    }
  }
  return opts;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

const exists = (p) => access(p).then(() => true, () => false);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function formatDuration(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

function progressBar(done, total, width = 30) {
  const pct = total ? done / total : 0;
  const filled = Math.round(pct * width);
  return "[" + "█".repeat(filled) + "░".repeat(width - filled) + "]"
    + ` ${done}/${total} (${(pct * 100).toFixed(1)}%)`;
}

// ── Download one image ──────────────────────────────────────────────────────

async function downloadImage(url, dest, opts) {
  for (let attempt = 0; attempt <= opts.retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          "user-agent": `sumo-card-tracker/1.0 (+${opts.contactUrl}; personal collection)`,
          "accept": "image/jpeg,image/png,image/webp,image/*,*/*;q=0.8",
          "accept-language": "en",
        },
        redirect: "follow",
      });

      if (res.status === 429) {
        const wait = opts.backoffBase * 2 ** attempt;
        process.stdout.write(`\n  ⏳ Rate limited (429). Backing off ${formatDuration(wait)}...\n`);
        await sleep(wait);
        continue;
      }

      if (res.status === 403 || res.status === 401) {
        return { status: "blocked", httpStatus: res.status };
      }

      if (res.status === 404) {
        return { status: "not-found" };
      }

      if (res.status >= 500) {
        const wait = opts.backoffBase * 2 ** attempt;
        process.stdout.write(`\n  ⏳ Server error (${res.status}). Backing off ${formatDuration(wait)}...\n`);
        await sleep(wait);
        continue;
      }

      if (!res.ok) {
        return { status: "error", httpStatus: res.status };
      }

      const buf = Buffer.from(await res.arrayBuffer());

      // Sanity: real card images are at least a few KB
      if (buf.length < 1000) {
        return { status: "too-small", bytes: buf.length };
      }

      await mkdir(path.dirname(dest), { recursive: true });
      await writeFile(dest, buf);
      return { status: "ok", bytes: buf.length };

    } catch (e) {
      if (attempt < opts.retries) {
        const wait = opts.backoffBase * 2 ** attempt;
        process.stdout.write(`\n  ⏳ Network error: ${e.message}. Retrying in ${formatDuration(wait)}...\n`);
        await sleep(wait);
      } else {
        return { status: "error", message: e.message };
      }
    }
  }
  return { status: "error", message: "max retries exceeded" };
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const opts = parseArgs();

  // Load catalog
  if (!(await exists(opts.catalogPath))) {
    console.error(`✗ Catalog not found: ${opts.catalogPath}`);
    console.error(`  Place sumo-catalog-reiwa.json next to this script, or use --catalog=path`);
    process.exit(1);
  }

  const catalog = JSON.parse(await readFile(opts.catalogPath, "utf8"));
  let sets = catalog.filter((s) => s.cards && s.cards.length > 0);
  if (opts.only) {
    sets = sets.filter((s) => s.code === opts.only || s.slug?.includes(opts.only));
    if (!sets.length) {
      console.error(`✗ No set matching "${opts.only}". Available: ${catalog.map(s => s.code).join(", ")}`);
      process.exit(1);
    }
  }

  // Build download queue
  const queue = [];
  for (const set of sets) {
    for (const card of set.cards) {
      if (!card.imageUrl) continue;
      const ext = path.extname(new URL(card.imageUrl).pathname).toLowerCase() || ".jpg";
      const dest = path.join(opts.outDir, set.code, `${card.number}${ext}`);
      queue.push({ set: set.code, number: card.number, name: card.name, url: card.imageUrl, dest });
    }
  }

  // Pre-check what's already downloaded
  const todo = [];
  let alreadyHave = 0;
  for (const item of queue) {
    if (await exists(item.dest)) {
      alreadyHave++;
    } else {
      todo.push(item);
    }
  }

  const eta = formatDuration(todo.length * (opts.delayMs + 800)); // rough: delay + download time

  console.log(`
╔══════════════════════════════════════════════════════════╗
║  Sumo Card Image Downloader                             ║
╚══════════════════════════════════════════════════════════╝

  Sets:       ${sets.length}
  Total:      ${queue.length} cards
  Already:    ${alreadyHave} downloaded (skipped)
  To fetch:   ${todo.length} remaining
  Delay:      ${opts.delayMs}ms between requests
  Est. time:  ~${eta}
  Output:     ${path.resolve(opts.outDir)}/
${opts.dryRun ? "\n  ** DRY RUN — nothing will be downloaded **\n" : ""}
`);

  if (!todo.length) {
    console.log("  ✓ All images already downloaded. Nothing to do.");
    return;
  }

  if (opts.dryRun) {
    const sample = todo.slice(0, 10);
    for (const item of sample) {
      console.log(`  would fetch: ${item.set}/${item.number} "${item.name}"`);
      console.log(`    ← ${item.url}`);
    }
    if (todo.length > 10) console.log(`  … and ${todo.length - 10} more`);
    return;
  }

  // Download loop
  const started = Date.now();
  const report = { ok: 0, notFound: 0, blocked: 0, tooSmall: 0, error: 0 };
  let currentSet = "";
  let blockedStreak = 0;

  for (let i = 0; i < todo.length; i++) {
    const item = todo[i];

    // Print set header on change
    if (item.set !== currentSet) {
      currentSet = item.set;
      const setCards = todo.filter((t) => t.set === currentSet).length;
      console.log(`\n  ── ${currentSet} (${setCards} to fetch) ──`);
    }

    // Progress
    const elapsed = Date.now() - started;
    const remaining = todo.length - i;
    const etaRemaining = i > 0 ? formatDuration((elapsed / i) * remaining) : "calculating";
    process.stdout.write(
      `\r  ${progressBar(i + alreadyHave, queue.length)} ETA ${etaRemaining}  ${item.set}/#${item.number}  `
    );

    // Download
    const result = await downloadImage(item.url, item.dest, opts);

    switch (result.status) {
      case "ok":
        report.ok++;
        blockedStreak = 0;
        if (opts.verbose) process.stdout.write(`✓ ${(result.bytes/1024).toFixed(0)}KB\n`);
        break;
      case "not-found":
        report.notFound++;
        blockedStreak = 0;
        if (opts.verbose) process.stdout.write(`- not on TCDB\n`);
        break;
      case "too-small":
        report.tooSmall++;
        if (opts.verbose) process.stdout.write(`- placeholder (${result.bytes}b)\n`);
        break;
      case "blocked":
        report.blocked++;
        blockedStreak++;
        process.stdout.write(`\n  ⚠ Blocked (HTTP ${result.httpStatus})\n`);
        if (blockedStreak >= 5) {
          console.log(`\n  ✗ 5 consecutive blocks — stopping to avoid a ban.`);
          console.log(`    ${report.ok} images saved. Re-run later to resume.`);
          await writeReport(opts, report, queue, alreadyHave);
          process.exit(1);
        }
        break;
      default:
        report.error++;
        if (opts.verbose) process.stdout.write(`✗ ${result.message || result.httpStatus}\n`);
    }

    // Delay before next request
    if (i < todo.length - 1) await sleep(opts.delayMs);
  }

  // Final summary
  const totalTime = formatDuration(Date.now() - started);
  console.log(`\n
  ── Done ──────────────────────────────────────────────
  Downloaded:   ${report.ok}
  Not on TCDB:  ${report.notFound} (no scan uploaded by anyone)
  Blocked:      ${report.blocked}
  Too small:    ${report.tooSmall} (placeholder, not a real scan)
  Errors:       ${report.error}
  Time:         ${totalTime}
  ─────────────────────────────────────────────────────
`);

  await writeReport(opts, report, queue, alreadyHave);
}

async function writeReport(opts, report, queue, alreadyHave) {
  const reportPath = path.join(opts.outDir, "_download-report.json");
  await mkdir(opts.outDir, { recursive: true });
  await writeFile(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    total: queue.length,
    alreadyHad: alreadyHave,
    ...report,
  }, null, 2) + "\n");
  console.log(`  Report: ${reportPath}`);
}

main().catch((e) => {
  console.error(`\n  ✗ Fatal: ${e.message}`);
  process.exit(1);
});
