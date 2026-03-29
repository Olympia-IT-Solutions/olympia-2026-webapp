const fs = require("fs");
const path = require("path");
const base = "public/locales";
const locales = ["de", "en", "fr", "it"];

function flatten(obj, prefix = "") {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? prefix + "." + k : k;
    if (v && typeof v === "object" && !Array.isArray(v)) return flatten(v, key);
    return [key];
  });
}

const maps = {};
for (const locale of locales) {
  const data = JSON.parse(fs.readFileSync(path.join(base, locale, "translation.json"), "utf8"));
  maps[locale] = new Set(flatten(data));
}

const union = new Set();
for (const locale of locales) for (const key of maps[locale]) union.add(key);
let parity = true;
for (const locale of locales) {
  const missing = [...union].filter((k) => !maps[locale].has(k));
  console.log("LOCALE " + locale + ": keys=" + maps[locale].size + ", missing=" + missing.length);
  if (missing.length) {
    parity = false;
    for (const key of missing.slice(0, 200)) console.log("  - " + key);
  }
}
console.log("UNION_KEYS=" + union.size);
console.log("PARITY=" + (parity ? "PASS" : "FAIL"));
