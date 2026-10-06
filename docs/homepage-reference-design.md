# Reference-led homepage

The Chinese and English homepages follow the supplied reference: warm off-white paper, dark forest-green navigation and search actions, orange title emphasis, a two-column hero with a luminous gold/green globe, four informational feature groups and an inset rounded statistics strip. A responsive single-column version retains the map, search and navigation on phones.

- Search, quick searches, category tabs, resource details, saving and submission keep their existing behavior.
- Region map buttons filter documented resource locations and scroll to results. Selecting the same region again or clearing the visible region filter restores the default view. They do not imply applicant eligibility.
- Regional counts derive from the curated catalog, include historical briefs and omit global/unknown locations from named regions. Zero counts remain zero. Audience and page-view totals use live analytics, never reference-image numbers.
- Email/password login, resource submission/review and cloud workspace/backup implementations remain intact. Account links remain in mobile navigation and the footer; the workspace also provides login access.
- Home styles are scoped to `.pioneer-home`; other product pages keep their current presentation. Reduced-motion preferences are respected.

## Validation

Build + 103 tests passed. TypeScript passed. Lint passed without errors (3 image-element warnings). Browser checks: 1663 × 945 desktop and 390 × 844 Chinese/English phone layouts have no horizontal overflow; Europe filtering returns 10 current catalog matches; clearing and searching Y Combinator returns one match. Actual database counts in localhost screenshots differ from production.

## Globe asset

Built-in ImageGen generated `public/globe-signal-v2.png` using the supplied screenshot as a style/composition reference. It is decorative art; all labels, counters and buttons are HTML/SVG elements.

Prompt: “Use case: stylized-concept. Create a production website hero background asset matching ONLY the dark green globe panel in the attached reference UI. Landscape 3:2 composition. A luminous realistic dimensional planet Earth centered, Africa and Europe facing viewer, dark teal green oceans and land, intricate raised metallic geography outlined in soft golden light, tiny golden city lights and thin golden orbital network arcs surrounding sphere, subtle stars on very dark emerald background #062b20. Globe occupies 82% of image height with ample dark edges. Polished quiet cinematic lighting, warm champagne golden rim and nodes, highly detailed. Match reference globe's materials, angle and luminous routes as closely as possible. NO text whatsoever, no numbers, no labels, no typography, no cards, no buttons, no border, no watermark. The reference image is style and composition guidance; do not recreate the surrounding website. Deliver only the globe panel art.”
