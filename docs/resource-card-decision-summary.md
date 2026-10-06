# Resource card decision summaries

All ResourceCard consumers (Chinese/English homepages and directories) now render a fixed 84px footer with two icon-led information modules and a circular detail arrow. Modules use 12px semibold titles, 12px muted values, whitespace separation and no vertical divider. Long values occupy at most two visual lines and retain full text in the title attribute. The arrow keeps its resource-specific accessible name and existing route.

The resource-card summary resolver reads existing localized highlights and documented fields:

- Programs: application cutoff plus documented stage or audience. Missing deadlines direct users to the specific program; archive cutoffs stay historical.
- Campuses: program count plus documented focus areas or ecosystem focus.
- Institutions: documented incubation record/coverage plus markets or audience.
- Investors: investment stage plus disclosed check size, retaining historical qualifications. Missing standard amounts remain explicitly unpublished.
- Events: actual event dates plus scale/capacity if supplied; otherwise documented audience/goals. Exhibitor counts remain labeled as exhibitors, never participant estimates. Past dates are labeled as historical.
- Projects: recorded company stage plus published resource needs. Unpublished needs remain unknown.
- Courses: participation format plus cost.

No new eligibility, participation forecasts, investment amounts or dates were added. In particular, YC's current cutoff remains 2026.11.02, and the actual Slush 2026 brief dates remain 2026.11.18–11.19. STATION F lists its documented ecosystem focus rather than unsupported sectors from the mockup.

Individual source/review dates remain above the decision footer. Saving remains available above those dates, so the two facts and arrow occupy the bottom of each card.

Validation: build + 106 tests passed; TypeScript passed; lint has no errors (3 unchanged image warnings). Browser checks show all six featured footers and nine English program footers at 84px; the YC detail arrow opens the correct brief; English phone width 390px has no horizontal overflow.
