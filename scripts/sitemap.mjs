import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const PUBLIC_DIR = join(process.cwd(), "public");
const OUTPUT_FILE = join(PUBLIC_DIR, "sitemap.xml");

function walkIndexHtml(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "assets") continue;
      results.push(...walkIndexHtml(fullPath));
    } else if (entry.isFile() && entry.name === "index.html") {
      results.push(fullPath);
    }
  }
  return results;
}

function isNoindex(html) {
  const robotsMatch = html.match(
    /<meta\s+[^>]*name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i
  ) || html.match(
    /<meta\s+[^>]*content=["']([^"']+)["'][^>]*name=["']robots["'][^>]*>/i
  );
  return robotsMatch ? /\bnoindex\b/i.test(robotsMatch[1]) : false;
}

function getCanonical(html) {
  const match = html.match(
    /<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i
  ) || html.match(
    /<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i
  );
  return match ? match[1].trim() : null;
}

function getLastMod(filePath) {
  try {
    const relPath = relative(process.cwd(), filePath);
    const gitDate = execFileSync(
      "git",
      ["log", "-1", "--format=%cs", "--", relPath],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    ).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(gitDate)) return gitDate;
  } catch {
    // Fallback ke tanggal modifikasi file jika belum di-commit
  }
  return statSync(filePath).mtime.toISOString().slice(0, 10);
}

function escapeXml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

const files = walkIndexHtml(PUBLIC_DIR).sort();
const urls = [];

for (const file of files) {
  const html = readFileSync(file, "utf8");
  if (isNoindex(html)) continue;

  const canonical = getCanonical(html);
  if (!canonical) {
    console.warn(`sitemap: dilewati (tanpa canonical): ${relative(PUBLIC_DIR, file)}`);
    continue;
  }

  urls.push({
    loc: canonical,
    lastmod: getLastMod(file),
  });
}

const body = urls
  .map(
    ({ loc, lastmod }) => `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body ? `${body}\n` : ""}</urlset>
`;

writeFileSync(OUTPUT_FILE, xml, "utf8");
console.log(`sitemap.xml dibuat: ${urls.length} URL terindeks.`);
