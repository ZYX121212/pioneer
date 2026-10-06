# Resource finder redesign

The homepage is now a working resource finder in Chinese and English. It shows search, need categories and resource results before weekly or subscription content.

- Need categories: funding / accelerators, incubators / support, events, learning / reference companies. Categories use documented resource types and kinds. They do not imply an open application or investment offer.
- Search matches every space-separated term across Chinese and English names, descriptions, locations and tags.
- Location, founder stage and freshness are optional, collapsed filters. Country presets match documented institutional or venue locations; these are not applicant eligibility rules.
- Default results exclude historical windows. Searching an expired edition also excludes it until users explicitly select archives or all briefs. Historical cards show an ended-window reference label.
- Queries, category, location, stage, freshness and pagination are retained in URLs. Refresh and browser navigation restore these conditions; pagination anchors preserve filters.
- Cards show a short description, first documented best-fit group, time, individual review status and detail link. Full descriptions, conditions, sources and saving remain accessible.
- Desktop navigation contains resource search, workspace, weekly and guides. Email account access remains visible. Direct category routes and community, submission, notification and subscription functions remain available.
- Mobile uses one column. Pagination wraps without horizontal overflow. Additional filters and footer subscriptions can be expanded when needed.

## Verification

- `npm test`: build + 95 tests passed, including 5 new finder behavior tests.
- `npx tsc --noEmit`: passed.
- `npm run lint`: no errors; 2 existing image warnings.
- Browser: support + Singapore returned BLOCK71; TechBBQ produced zero default results and appeared only in the historical archive with an ended-window label.
- English URL with funding category and Y Combinator query restored a single matching result after navigation.
- Chinese and English mobile views at 390px had no horizontal overflow; the first resource was visible in the first screen.

No source dates or eligibility claims were refreshed as part of this layout change. Older review dates remain visible, and email delivery still requires mail configuration.

## Community discovery follow-up

- Submitted public knowledge is explicitly labeled as learning content and appears in the learning category on both homepages. Internal conversion uses the existing brief structure while retaining its community detail route and link-only verification label.
- Cards with no documented audience display that the audience was not supplied; they do not leave an empty suitability label or invent eligibility.
- Anonymous save failures offer email login directly and preserve the current path and filters through the account page's `return_to` parameter. Signing in does not silently save a resource; the visitor can return and select it.
- Generated TypeScript build cache is excluded from source control.

## Homepage presentation rollback — 2026-10-06

At the owner's request, Chinese and English homepages and shared navigation/footer restore the presentation from before commit 07dd202: editorial globe hero, search, live audience metrics, four category entries, weekly spotlight and sample tabs. Email/password accounts, resource submission/review, cloud workspace and backup download/recovery remain on current implementations. Directory finder filters and community resource classification remain available on their existing routes.

Validation: build and 102 tests passed; TypeScript passed; lint has no errors and four existing image-element warnings on the restored pages and resource detail pages. Local browser confirmed the restored globe hero and Y Combinator search produced one result.
