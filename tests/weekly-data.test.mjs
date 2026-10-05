import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../app/data/weekly.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const weekly = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const now = new Date("2026-10-05T12:00:00+08:00");

test("verification expires at the Shanghai week boundary and excludes unpublished issues", () => {
  assert.equal(weekly.getActionableWeekly(now).length, 4);
  assert.equal(weekly.getActionableWeekly(new Date("2026-10-04T23:59:59+08:00")).length, 0);
  assert.equal(weekly.getActionableWeekly(new Date("2026-10-11T23:59:59+08:00")).length, 4);
  assert.equal(weekly.getActionableWeekly(new Date("2026-10-12T00:00:00+08:00")).length, 0);
  for (const language of ["zh", "en"]) {
    assert.doesNotMatch(weekly.buildWeeklyCalendar(language, new Date("2026-12-01T00:00:00Z")), /BEGIN:VEVENT/);
  }
});

test("calendar preserves exact YC cutoff, date-only reminders and exclusive event ends", () => {
  const calendars = ["zh", "en"].map(lang => weekly.buildWeeklyCalendar(lang, now));
  const unfolded = calendars.map(calendar => calendar.replace(/\r\n /g, ""));
  for (const calendar of unfolded) {
    assert.match(calendar, /DTSTART:20261103T040000Z/);
    assert.match(calendar, /DTSTART;VALUE=DATE:20261118/);
    assert.match(calendar, /DTSTART;VALUE=DATE:20261014\r\nDTEND;VALUE=DATE:20261015/);
    assert.match(calendar, /DTSTART;VALUE=DATE:20261118\r\nDTEND;VALUE=DATE:20261120/);
    assert.equal((calendar.match(/BEGIN:VEVENT/g) ?? []).length, 4);
    assert.doesNotMatch(calendar, /202608|TZ=|TZID=/);
  }
  const uids = unfolded.map(calendar => [...calendar.matchAll(/^UID:(.+)$/gm)].map(match => match[1]));
  assert.deepEqual(uids[0], uids[1]);
  assert.equal(new Set(uids[0]).size, 4);
  const yc = weekly.weeklyOpportunities.find(item => item.id === "yc-winter-2027");
  const cutoff = new Date(yc.expiresAt);
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23" }).formatToParts(cutoff).map(part => [part.type, part.value]));
  assert.equal(parts.month, "11"); assert.equal(parts.day, "02"); assert.equal(parts.hour, "20");
  for (const calendar of calendars) {
    assert.equal(calendar.replace(/\r\n/g, "").includes("\n"), false);
    for (const line of calendar.split("\r\n")) assert.ok(Buffer.byteLength(line, "utf8") <= 75);
    assert.doesNotMatch(calendar, /\uFFFD/);
  }
});

test("syndication escapes text and gives each issue a permanent identity", () => {
  assert.equal(weekly.escapeXml('A&B <C> "D"'), "A&amp;B &lt;C&gt; &quot;D&quot;");
  assert.equal(weekly.escapeCalendar("A,B;C\\D\nE"), "A\\,B\\;C\\\\D\\nE");
  const longLine = "DESCRIPTION:" + "融资🙂,".repeat(30);
  assert.equal(weekly.foldCalendarLine(longLine).replace(/\r\n /g, ""), longLine);
  for (const lang of ["zh", "en"]) {
    const feed = weekly.buildWeeklyFeed(lang, "https://pioneer.example");
    const guids = [...feed.matchAll(/<guid[^>]*>([^<]+)<\/guid>/g)].map(match => match[1]);
    assert.deepEqual(guids, ["pioneer-weekly-003", "pioneer-weekly-002"]);
    assert.match(feed, /\/weekly\/archive\/003/);
    assert.match(feed, /\/weekly\/archive\/002/);
    assert.doesNotMatch(feed, /<guid[^>]*>https:[^<]*\/weekly<\/guid>/);
  }
});
