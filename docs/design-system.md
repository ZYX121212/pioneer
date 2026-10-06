# Pioneer shared design

The white homepage is the visual reference for both languages and every route.
`SiteNavigation` is the only site header. `SiteChrome` owns the footer; homepage wrappers delegate to it. `app/design-system.css` owns the palette, common typography, page width, cards, forms, responsive navigation and focus states. Resource content, source dates and account behavior stay intact.

- White surfaces, pale neutral panels, black wordmark, forest green announcements and actions, orange editorial accents.
- 1280px content width; 40 / 24 / 16px responsive gutters; 12px card corners.
- Shared discovery menu, resource search, workspace, account and language controls. Mobile keeps search and account accessible through a compact header; discovery exposes the remaining page links.
- Cards open details through the card surface; the separate save control remains operable at the upper right.
- Reset-password, unsubscribe and missing-page states use the same chrome.

## Acceptance, 2026-10-06

- Type checking passed. Existing 115 tests passed.
- `node scripts/check-design-routes.mjs http://localhost:3000` passed for 267 addresses: static routes, all resource slugs in both languages and a missing page. It checks response status and exactly one shared header and footer. It is a rendering check, not a pixel comparison.
- Browser at desktop width: weekly, resource directory, knowledge library, event detail and home search were inspected. Inner-page search for Singapore reached the homepage with the search term and three curated matches.
- Dedicated WAIC, submission and long-form workbook surfaces were also normalized; the knowledge route stylesheet uses the shared palette and readable type scale.
- At 390px: home, four directories, program and event detail, knowledge library and workbook, login, workspace, submit, community, notifications, reset-password and unsubscribe had no horizontal document overflow and retained shared chrome. English weekly was also visually inspected.
- Signed-in private content was not visually exercised with a production account. Existing account and workspace tests cover the preserved behavior; no production account data was modified.
- Local community data and visitor totals are unavailable without production bindings. Their existing fallback messages were observed; local fallback does not establish production service health.

For future pages, use shared chrome and these tokens. Do not introduce a separate logo/header, neon hero, beige global theme or independently styled account controls. Run the route checker against a preview or deployment after changing shared components, and visually inspect representative desktop/mobile pages.
