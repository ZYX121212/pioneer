import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const urls = new Map();
async function moduleUrl(path) {
  if (urls.has(path)) return urls.get(path);
  let js = ts.transpileModule(await readFile(new URL(`../app/${path}.ts`, import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  for (const match of [...js.matchAll(/from "([^"]+)"/g)]) {
    if (!match[1].startsWith(".")) continue;
    const resolved = new URL(match[1], `https://local/${path}`).pathname.slice(1);
    js = js.replace(JSON.stringify(match[1]), JSON.stringify(await moduleUrl(resolved)));
  }
  const url = "data:text/javascript;base64," + Buffer.from(js).toString("base64");
  urls.set(path, url);
  return url;
}
const { decisionProfiles, hasDecisionProfile, getDecisionProfile, summaryDecisionProfile } = await import(await moduleUrl("data/decisionProfiles"));
const { resourceProfiles } = await import(await moduleUrl("data/resourceProfiles"));
const { resources } = await import(await moduleUrl("data/resources"));
const { getEnglishResource } = await import(await moduleUrl("data/english"));
const sections = ["capabilities", "offers", "entryPaths", "stageFit", "costs", "diligence", "playbook"];
const programs = ["y-combinator", "techstars-accelerators", "antler-residency", "berkeley-skydeck-batch-23", "entrepreneur-first-london", "launch-by-station-f"];
const targets = [...resources.filter(r => r.type === "event").map(r => r.slug), ...programs];

test("every current event and migrated program has a complete bilingual decision profile", () => {
  assert.equal(targets.length, 24);
  assert.deepEqual(Object.keys(decisionProfiles).sort(), targets.sort());
  for (const slug of targets) {
    const { zh, en } = decisionProfiles[slug];
    assert.equal(zh, resourceProfiles[slug], `preserve Chinese source: ${slug}`);
    assert.equal(getDecisionProfile(slug), zh);
    assert.equal(getDecisionProfile(slug, "en"), en);
    assert.deepEqual(Object.keys(en).sort(), Object.keys(zh).sort());
    assert.deepEqual(Object.keys(en.identity).sort(), Object.keys(zh.identity).sort());
    assert.deepEqual(Object.keys(en.comparison).sort(), Object.keys(zh.comparison).sort());
    for (const section of sections) {
      assert.equal(en[section].length, zh[section].length, `${slug}.${section}`);
      assert.ok(zh[section].length === 0 || en[section].length > 0, `${slug}.${section} is populated`);
      en[section].forEach((row, i) => {
        if (typeof row === "string") return;
        assert.deepEqual(Object.keys(row).sort(), Object.keys(zh[section][i]).sort(), `${slug}.${section}[${i}] fields`);
        for (const rating of ["strength", "fit", "level"]) {
          if (rating in row) assert.equal(row[rating], zh[section][i][rating], `${slug}: preserve ${rating}`);
        }
      });
    }
    function checkText(value, key = "") {
      if (["strength", "fit", "level"].includes(key)) return;
      if (typeof value === "string") {
        assert.ok(value.trim(), `${slug}: nonempty ${key}`);
        assert.doesNotMatch(value, /[\u3400-\u9fff]/u, `${slug}: English text ${key}`);
      } else Object.entries(value).forEach(([k, v]) => checkText(v, k));
    }
    checkText(en);
  }
});

test("resources retain distinct capabilities, offers, diligence and playbooks in both languages", () => {
  for (const lang of ["zh", "en"]) for (const section of ["capabilities", "offers", "diligence", "playbook"]) {
    const bodies = targets.map(slug => JSON.stringify(decisionProfiles[slug][lang][section]));
    assert.equal(new Set(bodies).size, targets.length, `${lang}.${section} must not collapse to a shared template`);
  }
  for (const [slug, terms] of [
    ["y-combinator", ["YC partner", "Early Decision", "founder ownership", "eight weeks"]],
    ["techstars-accelerators", ["corporate partners", "three alumni", "five candidates", "managing director"]],
    ["antler-residency", ["cofounder", "six weeks", "regional offer", "Before incorporation"]],
    ["slush-2026", ["Meeting Tool", "twenty target funds", "thirty funds", "Slush 100"]],
    ["waic-shanghai-2026", ["Zhangjiang", "Hi WAIC", "WAIC Academic", "Daily decision memo"]],
    ["dreamforce-2026", ["AppExchange", "Salesforce+", "integration demo"]],
  ]) for (const term of terms) assert.ok(JSON.stringify(decisionProfiles[slug].en).includes(term), `${slug}: ${term}`);
});

test("fallback is reserved for missing profiles; a missing translation fails visibly", () => {
  assert.equal(getDecisionProfile("unknown-event", "en"), undefined);
  for (const lang of ["zh", "en"]) {
    const copy = lang === "zh" ? resources[0] : getEnglishResource(resources[0].slug);
    const fallback = summaryDecisionProfile(copy, lang);
    assert.equal(fallback.identity.primaryValue, copy.whyItMatters);
    assert.deepEqual(fallback.diligence, copy.considerations);
    assert.equal(fallback.offers[0].includes, copy.overview);
    assert.equal(fallback.playbook[0].action, copy.editorialNote);
  }
  const saved = decisionProfiles["y-combinator"];
  delete decisionProfiles["y-combinator"];
  try {
    assert.equal(hasDecisionProfile("y-combinator"), true, "the route still requires an authored profile");
    assert.throws(() => getDecisionProfile("y-combinator", "en"), /Missing English decision profile/);
    assert.equal(getDecisionProfile("y-combinator", "zh"), resourceProfiles["y-combinator"]);
  } finally { decisionProfiles["y-combinator"] = saved; }
});

function escapeHtml(text) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
}
const { default: worker } = await import(new URL("../dist/server/index.js", import.meta.url));
async function render(path) {
  const NativeDate = globalThis.Date;
  globalThis.Date = class extends NativeDate {
    constructor(...args) { super(...(args.length ? args : ["2026-10-06T04:00:00Z"])); }
    static now() { return NativeDate.parse("2026-10-06T04:00:00Z"); }
  };
  try {
    const response = await worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
    assert.equal(response.status, 200, path);
    // Assert visible article content, not serialized React payloads or related cards.
    const html = await response.text();
    return html.slice(html.indexOf("<article"), html.indexOf("</article>"));
  } finally { globalThis.Date = NativeDate; }
}
for (const slug of targets) for (const lang of ["zh", "en"]) test(`${lang} ${slug} renders its full resource-specific decision content`, async () => {
  const article = await render(`${lang === "en" ? "/en" : ""}/resources/${slug}`);
  const p = decisionProfiles[slug][lang];
  const expected = [
    ...Object.values(p.identity), ...p.capabilities.flatMap(x => [x.label, x.detail]),
    ...p.costs.map(x => x.detail), ...p.stageFit.map(x => x.reason), ...p.diligence,
    ...p.playbook.flatMap(x => [x.phase, x.action, x.output]), ...Object.values(p.comparison),
  ];
  if (slug !== "techcrunch-disrupt-2026") expected.push(...p.offers.flatMap(x => [x.includes, x.founderValue]), ...p.entryPaths.flatMap(x => [x.title, x.forWhom, x.prepare]));
  for (const text of expected) assert.ok(article.includes(escapeHtml(text)), `${lang}/${slug} missing visible text: ${text}`);
  assert.ok(!article.includes("Book conversations around a concrete customer, funding or partnership objective."));
});

test("TechCrunch keeps verified bilingual modules and closed application paths", async () => {
  for (const lang of ["zh", "en"]) {
    const html = await render(`${lang === "en" ? "/en" : ""}/resources/techcrunch-disrupt-2026`);
    for (const term of lang === "en" ? ["2026 applications closed", "Published exhibit cutoff passed", "does not grant a booth or a pitch slot"] : ["2026 申请已关闭", "本届展位截止已过", "普通参会不自动获得展位或路演名额"]) assert.ok(html.includes(term), term);
  }
});
