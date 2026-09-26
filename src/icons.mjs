// Inline SVG icon set — stroke-based, 1.5px, 24x24 viewBox.
// Usage: icon("shield", "h-5 w-5")

const P = {
  arrowRight: '<path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5"/>',
  arrowUpRight: '<path d="M7 17 17 7m0 0H8m9 0v9"/>',
  check: '<path d="m4.5 12.5 5 5 10-11"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  ledger:
    '<path d="M5 4.5h11a2.5 2.5 0 0 1 2.5 2.5v13H7.5A2.5 2.5 0 0 1 5 17.5v-13Z"/><path d="M5 4.5A2.5 2.5 0 0 0 2.5 7v10.5A2.5 2.5 0 0 1 5 15"/><path d="M9 9h6M9 12.5h4"/>',
  reconcile:
    '<path d="M3.5 8h13m0 0-3.5-3.5M16.5 8 13 11.5"/><path d="M20.5 16h-13m0 0L11 12.5M7.5 16 11 19.5"/>',
  calendar:
    '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8.5 3v4M15.5 3v4"/>',
  chart:
    '<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16.5V12M12.5 16.5V7.5M17 16.5v-6"/>',
  receipt:
    '<path d="M5.5 3.5h13v17l-2.2-1.6-2.15 1.6-2.15-1.6-2.15 1.6-2.2-1.6v-15Z"/><path d="M9 8h6M9 12h6"/>',
  wallet:
    '<path d="M3.5 8.5A2.5 2.5 0 0 1 6 6h12.5a2 2 0 0 1 2 2v9.5a2 2 0 0 1-2 2H6a2.5 2.5 0 0 1-2.5-2.5v-9.5Z"/><path d="M3.5 8.5h13"/><circle cx="16.5" cy="13" r="1.25"/>',
  user: '<circle cx="12" cy="8" r="3.75"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
  building:
    '<path d="M4.5 20.5V5.5A2 2 0 0 1 6.5 3.5h6a2 2 0 0 1 2 2v15"/><path d="M14.5 9.5h3a2 2 0 0 1 2 2v9"/><path d="M3 20.5h18M8 7.5h3M8 11h3M8 14.5h3"/>',
  magnifier:
    '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4.5 4.5"/>',
  stamp:
    '<path d="M4 20.5h16"/><path d="M6.5 17h11v-2.5a2 2 0 0 0-2-2h-1.2l.5-4.2a3 3 0 0 0-3-3.3h-.6a3 3 0 0 0-3 3.3l.5 4.2H8.5a2 2 0 0 0-2 2V17Z"/>',
  inbox:
    '<path d="M3.5 13.5 6 5.5A2 2 0 0 1 7.9 4h8.2a2 2 0 0 1 1.9 1.5l2.5 8"/><path d="M3.5 13.5H9l1.2 2.5h3.6L15 13.5h5.5v4a2.5 2.5 0 0 1-2.5 2.5H6a2.5 2.5 0 0 1-2.5-2.5v-4Z"/>',
  compass:
    '<circle cx="12" cy="12" r="8.5"/><path d="m15 9-1.8 4.2L9 15l1.8-4.2L15 9Z"/>',
  shield:
    '<path d="M12 3.2 19.5 6v6c0 4.3-3 7.6-7.5 9-4.5-1.4-7.5-4.7-7.5-9V6L12 3.2Z"/><path d="m9 12 2 2 4-4"/>',
  lock: '<rect x="4.5" y="10" width="15" height="10.5" rx="2.5"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/>',
  people:
    '<circle cx="9" cy="8.5" r="3.25"/><path d="M3 19.5a6 6 0 0 1 12 0"/><path d="M16 5.6a3.25 3.25 0 0 1 0 5.8M17 14.2a6 6 0 0 1 4 5.3"/>',
  leaf: '<path d="M20 4.5c0 9-5 13-10.5 13A5.5 5.5 0 0 1 4 12C4 6.5 10 4.5 20 4.5Z"/><path d="M4.5 20c1.5-5 5-8.5 9.5-10.5"/>',
  cpu: '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
  handshake:
    '<path d="m3 11 3-3.5 4 .5 2 1.5 2-1.5 4-.5 3 3.5"/><path d="M6 7.5v8.2l4.6 3.4a1.6 1.6 0 0 0 2.2-.3l4.2-5.1"/><path d="M18 7.5v7"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  globe:
    '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.2 2.4 3.4 5.4 3.4 8.5S14.2 18.1 12 20.5c-2.2-2.4-3.4-5.4-3.4-8.5S9.8 5.9 12 3.5Z"/>',
  spark:
    '<path d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.5 10.1 12.8 4.5 10.9 10.1 9 12 3.5Z"/>',
  layers:
    '<path d="m12 3.5 8.5 4.5L12 12.5 3.5 8 12 3.5Z"/><path d="m3.5 12.5 8.5 4.5 8.5-4.5"/><path d="m3.5 16.5 8.5 4.5 8.5-4.5"/>',
  scale:
    '<path d="M12 4v16M7 20h10"/><path d="M12 6.5 4.5 8.5M12 6.5 19.5 8.5"/><path d="M4.5 8.5 2 14.5h5l-2.5-6ZM19.5 8.5 17 14.5h5l-2.5-6Z"/>',
  target:
    '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
  route:
    '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6H14a3.5 3.5 0 0 1 0 7h-4a3.5 3.5 0 0 0 0 7h5.5"/>',
  phone:
    '<path d="M7.5 3.5h-1A3 3 0 0 0 3.5 6.7c.4 6.9 5.9 12.4 12.8 12.8a3 3 0 0 0 3.2-3v-1a1.5 1.5 0 0 0-1.1-1.45l-2.8-.75a1.5 1.5 0 0 0-1.5.5l-.9 1.05a11.5 11.5 0 0 1-5.3-5.3l1.05-.9a1.5 1.5 0 0 0 .5-1.5l-.75-2.8A1.5 1.5 0 0 0 7.5 3.5Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.8 6.5 7.1 5.6a1.75 1.75 0 0 0 2.2 0l7.1-5.6"/>',
  pin: '<path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"/><circle cx="12" cy="10" r="2.75"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5"/>',
  quote:
    '<path d="M9.5 6C6.5 7.5 5 10 5 13v5h6v-6H8.5c0-2 .8-3.5 2.5-4.5L9.5 6ZM19.5 6C16.5 7.5 15 10 15 13v5h6v-6h-2.5c0-2 .8-3.5 2.5-4.5L19.5 6Z"/>',
  volume: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  chevronDown: '<path d="m6 9.5 6 6 6-6"/>',
};

export function icon(name, cls = "h-5 w-5") {
  const path = P[name];
  if (!path) throw new Error(`Unknown icon: ${name}`);
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

export const arrow = (cls = "h-4 w-4") =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P.arrowRight}</svg>`;
