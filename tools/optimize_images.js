#!/usr/bin/env node
/**
 * Optimize all raster images in site/img/ from PNG to WebP.
 *
 * Uses ImageMagick 7.1+ (the "magick" command) which supports WebP encoding.
 * After each .webp is created and verified (exists + non-zero size), the
 * source .png is deleted. Idempotent: skip if .webp exists and .png is gone.
 *
 * Usage:
 *   node tools/optimize_images.js           # optimize all
 *   node tools/optimize_images.js --dry-run # show what would be done
 *
 * Categories and max dimensions:
 *   cases       1536x1152  (patient images, 4:3)
 *   exams        768x768   (exam tiles, 1:1)
 *   procedures   768x768   (procedure tiles, 1:1)
 *   drug-groups  768x384   (group banners, 2:1)
 */

import { execFileSync } from "node:child_process";
import { readdirSync, existsSync, statSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMG_ROOT = join(__dirname, "..", "site", "img");

const dryRun = process.argv.includes("--dry-run");

// Category → { dir, maxWidth, maxHeight }
const CATEGORIES = [
  { name: "cases",       dir: join(IMG_ROOT, "cases"),       maxW: 1536, maxH: 1152 },
  { name: "exams",       dir: join(IMG_ROOT, "exams"),       maxW: 768,  maxH: 768  },
  { name: "procedures",  dir: join(IMG_ROOT, "procedures"),  maxW: 768,  maxH: 768  },
  { name: "drug-groups", dir: join(IMG_ROOT, "drug-groups"), maxW: 768,  maxH: 384  },
];

const QUALITY = 82;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

let totalConverted = 0;
let totalSkipped = 0;
let totalBeforeBytes = 0;
let totalAfterBytes = 0;

for (const cat of CATEGORIES) {
  let pngs = [];
  let webps = [];
  try {
    pngs = readdirSync(cat.dir).filter((f) => f.endsWith(".png"));
    webps = readdirSync(cat.dir).filter((f) => f.endsWith(".webp"));
  } catch {
    console.log(`  [${cat.name}] directory not found, skipping`);
    continue;
  }

  const webpSet = new Set(webps);
  let catConverted = 0;
  let catSkipped = 0;
  let catBefore = 0;
  let catAfter = 0;

  for (const png of pngs) {
    const pngPath = join(cat.dir, png);
    const webpName = png.replace(/\.png$/, ".webp");
    const webpPath = join(cat.dir, webpName);

    // Idempotent: if webp already exists and png should be deleted
    if (webpSet.has(webpName)) {
      // webp exists — check if png should be cleaned up
      const webpSize = statSync(webpPath).size;
      if (webpSize > 0) {
        if (!dryRun) {
          unlinkSync(pngPath);
        }
        catSkipped++;
        catAfter += webpSize;
        continue;
      }
    }

    // Convert PNG -> WebP
    const resizeSpec = `${cat.maxW}x${cat.maxH}>`;
    const beforeSize = statSync(pngPath).size;
    catBefore += beforeSize;
    totalBeforeBytes += beforeSize;

    if (dryRun) {
      console.log(`  [DRY] ${cat.name}/${png} -> ${webpName} (-resize ${resizeSpec} -quality ${QUALITY})`);
      catConverted++;
      continue;
    }

    try {
      execFileSync("magick", [
        pngPath,
        "-resize", resizeSpec,
        "-quality", String(QUALITY),
        webpPath,
      ], { stdio: ["pipe", "pipe", "pipe"] });

      // Verify the webp was created and is non-zero
      if (!existsSync(webpPath) || statSync(webpPath).size === 0) {
        throw new Error(`webp output is missing or empty: ${webpPath}`);
      }

      const afterSize = statSync(webpPath).size;
      catAfter += afterSize;
      totalAfterBytes += afterSize;

      // Delete the source PNG
      unlinkSync(pngPath);
      catConverted++;
    } catch (err) {
      console.error(`  [ERROR] ${cat.name}/${png}: ${err.message}`);
      // Don't delete png on error
      process.exitCode = 1;
    }
  }

  // Also count existing webps (already converted in prior run) for after-total
  for (const wp of webps) {
    if (!pngs.includes(wp.replace(/\.webp$/, ".png"))) {
      totalAfterBytes += statSync(join(cat.dir, wp)).size;
      catAfter += statSync(join(cat.dir, wp)).size;
    }
  }

  totalConverted += catConverted;
  totalSkipped += catSkipped;
  console.log(`  [${cat.name}] ${catConverted} converted, ${catSkipped} already done` +
    (catBefore > 0 ? ` | ${formatBytes(catBefore)} -> ${formatBytes(catAfter)}` : ""));
}

console.log("");
console.log(`Total: ${totalConverted} converted, ${totalSkipped} already done`);
if (totalBeforeBytes > 0) {
  console.log(`Size: ${formatBytes(totalBeforeBytes)} -> ${formatBytes(totalAfterBytes)}` +
    ` (-${Math.round(100 * (1 - totalAfterBytes / (totalBeforeBytes + totalAfterBytes)))}%)`);
}
