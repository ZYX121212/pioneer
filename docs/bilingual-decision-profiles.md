# Bilingual founder decision profiles

Based on main `ae2206541e902d04b5f77abd02e5c5dae39b8197`, reconciled with
the existing Sites source at `7e24c4e` before publication. The additional
AWS re:Invent, Entrepreneur Day and InnoVEX events retains the same complete bilingual profile coverage.

`english.ts` remains the directory/hero summary model. `decisionProfiles.ts`
provides a `Record<"zh" | "en", ResourceResearchProfile>` per migrated resource.
The Chinese entry references the existing authored `resourceProfiles`; the English
entry supplies the same identity, capabilities, offers, entry paths, stage fit,
costs, diligence, playbook and comparison fields. Semantic rating codes remain
shared, with display labels translated in the view.

The migration covers all 18 current event resources and six detailed early-stage
programs: YC, Techstars, Antler, SkyDeck Batch 23, EF London and LAUNCH by STATION F.
These are translations of existing editorial research; verification dates,
source links, deadlines and official terms were not refreshed by this change.

Both event languages resolve the profile before rendering the same sections.
TechCrunch retains its verified bilingual program modules and participation paths.
Other resource-specific sections, including costs and playbook outputs, are now
visible in English. Original preparation phases are preserved instead of replacing
every first phase with six weeks before attendance.

`DecisionProfileSections` shares full research rendering across Chinese detail
pages and the six migrated English program pages. Other specialized institution,
investor and startup views retain their existing routing.

## Adding content

1. Author the Chinese research profile in `resourceProfiles.ts`.
2. Add the corresponding complete English profile to `englishDecisionProfiles.ts`.
3. Preserve section counts, ordering and semantic ratings; translate all content
   fields including `includes`, `prepare`, `reason` and `output`.
4. Add resource-specific assertions for meaningful distinctions. Adding an event
   without a complete English decision profile fails coverage tests.

The bilingual registry checks section counts during initialization. Missing
English content for an existing profile throws instead of silently rendering a
generic template. Only resources without authored profiles can use the conservative
localized summary fallback, which introduces no new benefits or factual claims.

## Validation

```sh
npm ci --no-audit --no-fund
npm test
npx tsc --noEmit
npm run lint
```

`tests/decision-profiles.test.mjs` adds 52 checks: complete locale coverage and
field/section parity, shared ratings, nonempty English content, distinct resource
content, missing-translation/fallback behavior, 48 visible server-rendered pages,
and TechCrunch's closed application paths. Assertions target article HTML rather
than serialized React data.

Full lint on the base main currently fails at `InteractiveGlobe.tsx:20` for
`react-hooks/set-state-in-effect`. The reconciled Sites source also has the same rule violation in
`LocationPanel.tsx:19`. Both are pre-existing errors in unchanged components. To check only this change:

```sh
npx eslint app/components/EventDecisionDetail.tsx \
  app/components/DecisionProfileSections.tsx \
  app/data/decisionProfiles.ts app/data/englishDecisionProfiles.ts \
  app/data/english.ts 'app/resources/[slug]/page.tsx' \
  'app/en/resources/[slug]/page.tsx' tests/decision-profiles.test.mjs
```
