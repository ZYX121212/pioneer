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
