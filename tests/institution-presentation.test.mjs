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
const { institutionPresentation, institutionImages } = await import(await moduleUrl("data/institutionPresentation"));
const { resources } = await import(await moduleUrl("data/resources"));
const institutions = resources.filter(r => r.type === "organization");
test("all institutions retain resource-specific bilingual content and valid related routes", () => {
  assert.equal(institutions.length, 31);
  for (const lang of ["zh", "en"]) {
    const fingerprints = new Set();
    for (const resource of institutions) {
      const d = institutionPresentation(resource, lang);
      assert.ok(d.thesis && d.copy.description && d.capabilities.length, `${lang}/${resource.slug}`);
      assert.equal(d.tabs.length, 4);
      assert.ok(d.tabs.every(t => t.text || t.points?.length));
      fingerprints.add(JSON.stringify([d.thesis, d.capabilities]));
      for (const program of d.programs) {
        assert.ok(program.detail && program.fit && program.stage);
        if (program.href.startsWith("/")) {
          assert.equal(program.href.startsWith("/en/"), lang === "en");
          assert.ok(resources.some(r => program.href.endsWith(`/resources/${r.slug}`)));
        } else assert.equal(new URL(program.href).protocol, "https:");
      }
      assert.ok(d.related.every(r => r.slug !== resource.slug));
    }
    assert.equal(fingerprints.size, institutions.length);
  }
});
test("program institutions have tailored English programs, boundaries and explicit photo provenance", () => {
  for (const slug of ["station-f", "block71", "entrepreneur-first", "berkeley-skydeck"]) {
    const r = institutions.find(r => r.slug === slug);
    const en = institutionPresentation(r, "en"), zh = institutionPresentation(r, "zh");
    assert.ok(en.programs.length >= 2);
    assert.equal(en.capabilities.length, 4);
    assert.ok(en.capabilities.every(c => c.boundary));
    assert.ok(zh.org.dossier.selection.process.length);
    assert.doesNotMatch(JSON.stringify(en.programs), /[\u4e00-\u9fff]/);
  }
  assert.match(institutionImages["station-f"].source, /stationf.co/);
  assert.match(institutionImages["berkeley-skydeck"].credit, /Marla Aufmuth/);
  assert.equal(institutionImages.block71, undefined);
});
