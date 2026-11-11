#!/usr/bin/env node
// -----------------------------------------------------------------------------
// Turns the full-resolution card cut-outs (from cut-cards.py) into the web
// images the tracker serves: public/images/utils/hannah-montana/NN.webp.
//
// Usage: node scripts/hannah-montana/export-web.mjs <cut_dir>
//
// 1050 px tall = twice the zoomed card's 525 px, so it stays sharp on retina
// screens without shipping the 600 dpi scans.
// -----------------------------------------------------------------------------

import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const HEIGHT = 1050;
const OUT_DIR = "public/images/utils/hannah-montana";

const cutDir = process.argv[2];
if (!cutDir) {
  console.error("usage: node scripts/hannah-montana/export-web.mjs <cut_dir>");
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });

const files = (await readdir(cutDir)).filter((f) => /^\d+\.png$/.test(f)).sort();
for (const file of files) {
  const out = path.join(OUT_DIR, file.replace(".png", ".webp"));
  const info = await sharp(path.join(cutDir, file))
    .resize({ height: HEIGHT })
    .webp({ quality: 82 })
    .toFile(out);
  console.log(`${out}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}
console.log(`\n${files.length} cards exported`);
