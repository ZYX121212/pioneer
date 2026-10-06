import type { CardFact } from "../lib/resourceCardSummary";
export function CardFactIcon({ kind }: { kind: CardFact["icon"] }) {
  const shapes = {
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 10h18M7 14h1m4 0h1m4 0h1M7 18h1m4 0h1" /></>,
    people: <><circle cx="9" cy="7" r="3" /><path d="M2 21v-3a7 7 0 0 1 14 0v3ZM17 4a3 3 0 0 1 0 6m2 4a6 6 0 0 1 3 5v2" /></>,
    building: <><path d="M3 21V5h11v16M14 10h7v11M1 21h22M7 8h3m-3 4h3m-3 4h3m7-2h1m-1 4h1M7 21v-2h3v2" /></>,
    money: <><rect x="2" y="5" width="20" height="14" rx="2" /><circle cx="12" cy="12" r="3" /><path d="M5 9h1m12 6h1" /></>,
    layers: <><path d="m12 2 10 6-10 6L2 8l10-6Zm-9 11 9 5 9-5m-18 5 9 5 9-5" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[kind]}</svg>;
}
