# Activity detail = facts + decision + action

The bilingual `/resources/[slug]` event pages now use one shared decision layout. Other resource types and the dedicated WAIC city/archive guide retain their existing product surfaces.

Order: edition facts → Pioneer Verdict (value / fit / constraint) → overview → founder value and program modules → six role recommendations → separate entry paths → pre-trip diligence → costs and local budget calculator → Founder Playbook → recommendation → official sources → related events / accelerators / investors.

Visual hierarchy follows the supplied reference: dark photographic hero for Disrupt, pale green verdict, direct prose for explanations, cards for genuinely parallel choices, restrained sticky action rail. Mobile uses a single column. The Disrupt image is a past-edition photograph currently served by TechCrunch, explicitly labeled; no photograph or attendance count is fabricated for other events.

## Facts checked on 2026-10-06

- https://moscone.com/events/techcrunch-disrupt-2026 — October 13–15, Moscone West, San Francisco.
- https://techcrunch.com/events/techcrunch-disrupt/ — forecast 10,000+ attendance; current ticket snapshots $949 Attendee / $999 Founder / $1,099 Investor (USD); exhibit cutoff October 2. Prices may change; checkout controls fees and access.
- https://techcrunch.com/startup-battlefield/ — 2026 applications closed. Next-edition dates are not presented as verified.
- https://techcrunch.com/events/techcrunch-disrupt/attendee-portal/ — pass-dependent spaces and separate activity access; a ticket is not a booth, pitch slot or guaranteed investor meeting.
- Hero asset: https://techcrunch.com/wp-content/uploads/2025/10/Disrupt-Audience.webp (official past-edition audience photograph).

Only Disrupt was rechecked in this change. Other catalog entries keep their own verification dates and show stale/historical states. No unsupported countries/investor/startup totals or arbitrary numeric ROI ratings from the mockup were added. Role recommendations, value judgments and preparation plans are editorial guidance, distinguished from factual snapshots.

## Real actions

Shortlist uses existing authenticated workspace save. Official links use independent entry paths. Bilingual event-specific `.ics` routes emit all-day date-only events with an exclusive end date; optional 1- or 7-day DISPLAY alarms require explicit selection. User must import the file and enable notifications in their calendar. No email reminder delivery is claimed. Historical/stale/undated editions cannot download an actionable calendar; server verifies this again for direct requests.

Budget inputs use one chosen currency and sum cash costs; team person-days remain separate. Estimates stay in current page state and are not submitted or saved.

## Validation

`npm test`, `npx tsc --noEmit`, `git diff --check`.

Tests cover bilingual page sections and closed participation paths, exclusive calendar ends, venue-timezone archive transition, UTF-8 line folding, opt-in alarms, malformed/stale/historical input rejection, invalid alarm parameters and direct-route archive protection. Existing deep event research stays visible, including Slush offers and playbook outputs.

Browser acceptance: 390px viewport has no horizontal overflow; reminder dialog selection downloaded a real `.ics` file with `TRIGGER:-P1D`; $999 + $1,200 + $800 yields USD 2,999. English and historical rendering also checked. No ticket purchase or actual calendar import was performed.
