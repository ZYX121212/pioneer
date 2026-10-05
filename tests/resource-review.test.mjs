import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";
import ts from "typescript";

async function moduleSource(path) {
  return ts.transpileModule(await readFile(new URL(path, import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
}
const reviewUrl = `data:text/javascript;base64,${Buffer.from(await moduleSource("../app/lib/resourceReview.ts")).toString("base64")}`;
const review = await import(reviewUrl);
const serviceSource = (await moduleSource("../app/lib/submissionService.ts")).replace('"./resourceReview"', JSON.stringify(reviewUrl));
const service = await import(`data:text/javascript;base64,${Buffer.from(serviceSource).toString("base64")}`);
const known = new Set(["www.techstars.com"]);
const input = { resourceName: "Techstars NYC", resourceType: "program", resourceUrl: "https://www.techstars.com/accelerators/nyc", deadline: "2026-11-18", whyUseful: "A useful program for founders building AI products and validating customer demand." };
const now = new Date("2026-10-05T12:00:00Z");
const html = '<html><title>Techstars NYC</title><body>Techstars NYC accelerator. Final deadline November 18, 2026.</body></html>';
const fetchOk = async () => new Response(html, { headers: { "Content-Type": "text/html" } });

function adapter(sqlite) {
  const wrap = (query, args = []) => ({
    bind(...values) { return wrap(query, values); },
    async first() { return sqlite.prepare(query).get(...args) ?? null; },
    async all() { return { results: sqlite.prepare(query).all(...args), success: true, meta: {} }; },
    async run() { const result = sqlite.prepare(query).run(...args); return { success: true, results: [], meta: { changes: Number(result.changes), last_row_id: Number(result.lastInsertRowid) } }; },
  });
  return { prepare: wrap, async batch(statements) { sqlite.exec("BEGIN"); try { const results = []; for (const statement of statements) results.push(await statement.run()); sqlite.exec("COMMIT"); return results; } catch (error) { sqlite.exec("ROLLBACK"); throw error; } } };
}
async function database() {
  const sqlite = new DatabaseSync(":memory:");
  const migrations = (await readdir(new URL("../drizzle/", import.meta.url))).filter(name => name.endsWith(".sql")).sort();
  // Preserve a pending legacy row while adding the new nullable receipt fields.
  for (const file of migrations) sqlite.exec(await readFile(new URL(`../drizzle/${file}`, import.meta.url), "utf8"));
  return { sqlite, db: adapter(sqlite) };
}
function insertRow(sqlite, url = input.resourceUrl) {
  sqlite.prepare(`INSERT INTO resource_submissions (resource_type, resource_name, resource_url, canonical_url, deadline, why_useful, submitter_name, submitter_email, relationship, status, review_token, share_token) VALUES ('program', 'Techstars NYC', ?, ?, '2026-11-18', ?, 'Contributor', 'private@example.com', 'community', 'reviewing', ?, ?)`).run(url, review.normalizePublicUrl(url), input.whyUseful, `receipt-${sqlite.prepare('SELECT count(*) AS n FROM resource_submissions').get().n}`, `share-${sqlite.prepare('SELECT count(*) AS n FROM resource_submissions').get().n}`);
  return sqlite.prepare("SELECT * FROM resource_submissions ORDER BY id DESC LIMIT 1").get();
}

test("automatic review verifies source evidence without equating it to all eligibility claims", async () => {
  const result = await review.reviewResource(input, known, fetchOk, now);
  assert.equal(result.status, "approved");
  assert.deepEqual(result.evidence.checks, ["public_https", "known_official_host", "name_on_official_page", "date_on_official_page"]);
  assert.equal(result.evidence.title, "Techstars NYC");
  assert.ok(result.evidence.excerpt.length <= 160);
});

test("unknown and private URLs never cause outbound requests, including redirects", async () => {
  let calls = 0;
  const fetcher = async () => { calls++; return new Response(null, { status: 302, headers: { Location: "http://127.0.0.1/private" } }); };
  for (const url of ["http://localhost/", "https://127.0.0.1/", "https://[::1]/", "https://user:secret@www.techstars.com/", "https://www.techstars.com:8443/", "https://unknown-official.org/"]) {
    const result = await review.reviewResource({ ...input, resourceUrl: url }, known, fetcher, now);
    assert.notEqual(result.status, "approved");
  }
  assert.equal(calls, 0);
  const redirect = await review.reviewResource(input, known, fetcher, now);
  assert.equal(redirect.reason, "redirect_needs_review");
  assert.equal(calls, 1);
});

test("expired, undated events, inaccessible pages and unmatched dates are not auto-published", async () => {
  assert.equal((await review.reviewResource({ ...input, deadline: "2026-08-04" }, known, fetchOk, now)).reason, "historical_window");
  assert.equal((await review.reviewResource({ ...input, resourceType: "event", deadline: "" }, known, fetchOk, now)).reason, "event_date_required");
  assert.equal((await review.reviewResource(input, known, async () => new Response("Blocked", { status: 403 }), now)).status, "pending");
  assert.equal((await review.reviewResource({ ...input, deadline: "2026-11-19" }, known, fetchOk, now)).reason, "date_not_confirmed");
  assert.equal((await review.reviewResource({ ...input, resourceName: "UnknownName" }, known, fetchOk, now)).reason, "name_not_confirmed");
  assert.equal(review.validDeadline("2026-02-30"), false);
});

test("review handles network failures and excessive bodies without losing submissions", async () => {
  assert.equal((await review.reviewResource(input, known, async () => { throw new Error("offline"); }, now)).status, "pending");
  assert.equal((await review.reviewResource(input, known, async () => new Response("x".repeat(400_001), { headers: { "Content-Type": "text/html" } }), now)).reason, "source_too_large");
});

test("canonical URL removes tracking while preserving meaningful query parameters", () => {
  assert.equal(review.normalizePublicUrl("https://www.techstars.com/accelerators/nyc/?utm_source=spam&batch=spring#apply"), "https://www.techstars.com/accelerators/nyc/?batch=spring");
  assert.equal(review.normalizePublicUrl("https://www.techstars.com/accelerators/nyc/"), review.normalizePublicUrl(input.resourceUrl));
});

test("real SQLite migrations, automatic approval, public directory and receipt form a durable loop", async () => {
  const { db, sqlite } = await database();
  const row = insertRow(sqlite);
  await service.processSubmission(db, row, [], known, fetchOk, now);
  const stored = await service.findSubmission(db, row.review_token);
  assert.equal(stored.status, "approved");
  const published = await service.listCommunity(db, "program");
  assert.equal(published.length, 1);
  assert.equal(published[0].slug, stored.published_slug);
  assert.equal(published[0].source_title, "Techstars NYC");
  const result = service.submissionResult(stored);
  assert.equal(result.resourcePath, `/community/${published[0].slug}`);
  assert.equal("submitter_email" in result, false);
  assert.equal("submitter_name" in published[0], false);
  assert.equal(sqlite.prepare("SELECT count(*) AS count FROM moderation_actions").get().count, 1);
  const plan = sqlite.prepare("EXPLAIN QUERY PLAN SELECT * FROM community_resources WHERE status = 'published' AND resource_type = 'program' ORDER BY created_at DESC").all();
  assert.ok(plan.some(row => row.detail.includes("idx_community_status_type_created")));
  sqlite.close();
});

test("repeated processing does not duplicate public resources and rejected review cannot leave a published listing", async () => {
  const { db, sqlite } = await database(); const row = insertRow(sqlite);
  await service.processSubmission(db, row, [], known, fetchOk, now);
  await service.processSubmission(db, row, [], known, fetchOk, now);
  assert.equal((await service.listCommunity(db)).length, 1);
  await service.recordReview(db, row, { status: "rejected", reason: "editor_rejected", evidence: { checks: [], checkedAt: now.toISOString() } }, "test-editor");
  assert.equal((await service.listCommunity(db)).length, 0);
  assert.equal((await service.findSubmission(db, row.review_token)).status, "rejected");
  sqlite.close();
});

test("known directory duplicates are recorded without fetching or creating new public entries", async () => {
  const { db, sqlite } = await database(); const row = insertRow(sqlite); let calls = 0;
  await service.processSubmission(db, row, [input.resourceUrl + "/"], known, async () => { calls++; return fetchOk(); }, now);
  assert.equal(calls, 0);
  assert.equal((await service.findSubmission(db, row.review_token)).status, "duplicate");
  assert.equal((await service.listCommunity(db)).length, 0);
  sqlite.close();
});


test("automatic date evidence must include the same year and exact day together", async () => {
  for (const content of ["Deadline November 18, 2025. Copyright 2026", "Deadline November 181, 2026", "Deadline November 18. Copyright 2026"]) {
    const result = await review.reviewResource(input, known, async () => new Response(`<title>Techstars NYC</title>Techstars NYC ${content}`, { headers: { "Content-Type": "text/html" } }), now);
    assert.equal(result.reason, "date_not_confirmed");
  }
});


test("shared publishing hosts do not establish official ownership for other publishers", () => {
  const hosts = review.officialHosts(["https://github.com/curated-org", "https://curated.substack.com", "https://www.linkedin.com/company/curated", "https://www.techstars.com/accelerators/nyc"]);
  assert.deepEqual([...hosts], ["www.techstars.com"]);
});


test("withdrawn source can be resubmitted with current data and only its current owner can withdraw it", async () => {
  const { db, sqlite } = await database();
  const first = insertRow(sqlite);
  const approved = { status: "approved", reason: "editor_approved", evidence: { checkedAt: now.toISOString(), title: "Verified source", checks: ["editor_verified"] } };
  const rejected = { status: "rejected", reason: "withdraw", evidence: { checkedAt: now.toISOString(), checks: ["withdraw"] } };
  await service.recordReview(db, first, approved);
  const slug = (await service.listCommunity(db))[0].slug;
  await service.recordReview(db, first, rejected);
  const second = insertRow(sqlite);
  Object.assign(second, { resource_name: "Updated program", location: "Berlin", deadline: "2027-01-20", stage: "traction", why_useful: "Updated contributor evidence", resource_type: "event" });
  await service.recordReview(db, second, approved);
  const [listing] = await service.listCommunity(db);
  assert.equal(listing.slug, slug);
  assert.equal(listing.submission_id, second.id);
  assert.equal(listing.name, second.resource_name);
  assert.equal(listing.location, second.location);
  assert.equal(listing.deadline, second.deadline);
  assert.equal(listing.stage, second.stage);
  assert.equal(listing.contributor_reason, second.why_useful);
  assert.equal(listing.resource_type, second.resource_type);
  await service.recordReview(db, first, rejected);
  assert.equal((await service.listCommunity(db)).length, 1);
  await service.recordReview(db, second, rejected);
  assert.equal((await service.listCommunity(db)).length, 0);
  sqlite.close();
});

test("two pending submissions for one source cannot replace the first published owner", async () => {
  const { db, sqlite } = await database();
  const first = insertRow(sqlite), second = insertRow(sqlite);
  const result = { status: "approved", reason: "approved", evidence: { checkedAt: now.toISOString(), checks: [] } };
  assert.equal(await service.recordReview(db, first, result), "approved");
  assert.equal(await service.recordReview(db, second, result), "duplicate");
  const [listing] = await service.listCommunity(db);
  assert.equal(listing.submission_id, first.id);
  assert.equal((await service.findSubmission(db, second.review_token)).status, "duplicate");
  assert.equal(sqlite.prepare("SELECT action FROM moderation_actions ORDER BY id DESC LIMIT 1").get().action, "duplicate");
  sqlite.close();
});

test("report resolution requires a pending durable row and preserves its first resolution evidence", async () => {
  const { db, sqlite } = await database();
  assert.equal(await service.resolveResourceReport(db, 999, "Missing report resolution", "editor-one"), "missing");
  sqlite.prepare("INSERT INTO resource_reports (resource_key, reason, details, requester_hash) VALUES ('resource-1','stale','Source has changed','fixture')").run();
  assert.equal(await service.resolveResourceReport(db, 1, "Checked official updated source", "editor-one"), "resolved");
  assert.equal(await service.resolveResourceReport(db, 1, "Do not overwrite original evidence", "editor-two"), "already-resolved");
  const report = sqlite.prepare("SELECT * FROM resource_reports WHERE id = 1").get();
  assert.equal(report.resolved_by, "editor-one");
  assert.equal(report.resolution_note, "Checked official updated source");
  assert.equal(report.status, "resolved");
  assert.ok(report.resolved_at);
  sqlite.close();
});

test("community discovery includes records beyond the former 200-row cap and excludes withdrawals", async () => {
  const { db, sqlite } = await database();
  const insert = sqlite.prepare("INSERT INTO community_resources (slug, submission_id, canonical_url, resource_type, name, url, stage, contributor_reason, source_title, source_excerpt, evidence, status, verified_at) VALUES (?, ?, ?, 'program', 'Local fixture', ?, 'any', 'Local fixture reason', 'Local source', 'Local evidence', '{}', ?, '2026-10-06')");
  for (let id = 1; id <= 205; id++) insert.run(`fixture-${id}`, id, `https://local-fixture.org/${id}`, `https://local-fixture.org/${id}`, id === 205 ? 'withdrawn' : 'published');
  const rows = await service.listCommunity(db);
  assert.equal(rows.length, 204);
  assert.equal(rows[0].slug, 'fixture-204');
  assert.ok(rows.some(row => row.slug === 'fixture-1'));
  assert.equal(rows.some(row => row.slug === 'fixture-205'), false);
  sqlite.close();
});
