export const C = {
  lime: "#C8F04A",
  limeDeep: "#9BC436",
  dark: "#0A0F0A",
  darkCard: "#111811",
  darkBorder: "#1E2A1E",
  darkMid: "#1A241A",
  text: "#E8F0E8",
  textMuted: "#7A9A7A",
  textDim: "#4A6A4A",
  accent: "#4AE88A",
  accentSoft: "#1A3A2A",
  danger: "#FF5A5A",
  dangerSoft: "#2A1010",
  gold: "#F0C040",
  goldSoft: "#2A2010",
  purple: "#A080F0",
  purpleSoft: "#1A1030",
};

export const CHARITIES = [
  { id: 1, name: "Golf4Good Foundation", cause: "Youth development", raised: 48200, img: "⛳", color: C.lime },
  { id: 2, name: "Fairway for All", cause: "Disability access", raised: 31500, img: "🤝", color: C.accent },
  { id: 3, name: "Green Futures", cause: "Environmental", raised: 22100, img: "🌿", color: "#4AE8C0" },
  { id: 4, name: "Caddie Scholars", cause: "Education", raised: 18800, img: "📚", color: C.gold },
  { id: 5, name: "Stroke of Hope", cause: "Medical research", raised: 14200, img: "❤️", color: C.danger },
  { id: 6, name: "Eagle Eye Vision", cause: "Eye health", raised: 9600, img: "👁️", color: C.purple },
];

export const INITIAL_USERS = [
  { id: 1, name: "James Whitmore", email: "james@example.com", password: "Pass@123", plan: "yearly", charity: 1, charityPct: 15, active: true, scores: [{v:34,d:"2026-03-10"},{v:29,d:"2026-02-22"},{v:31,d:"2026-02-05"},{v:28,d:"2026-01-18"},{v:36,d:"2025-12-30"}], joined: "2025-09-01", role: "user" },
  { id: 2, name: "Sarah Chen", email: "sarah@example.com", password: "Pass@123", plan: "monthly", charity: 3, charityPct: 10, active: true, scores: [{v:22,d:"2026-03-12"},{v:25,d:"2026-02-28"},{v:19,d:"2026-02-10"},{v:27,d:"2026-01-25"},{v:21,d:"2026-01-08"}], joined: "2025-11-14", role: "user" },
  { id: 3, name: "Marcus Reid", email: "marcus@example.com", password: "Pass@123", plan: "monthly", charity: 2, charityPct: 20, active: true, scores: [{v:38,d:"2026-03-08"},{v:41,d:"2026-02-20"},{v:35,d:"2026-02-02"},{v:39,d:"2026-01-16"},{v:33,d:"2025-12-28"}], joined: "2026-01-03", role: "user" },
  { id: 4, name: "Priya Nair", email: "priya@example.com", password: "Pass@123", plan: "yearly", charity: 4, charityPct: 10, active: false, scores: [{v:27,d:"2026-02-14"},{v:30,d:"2026-01-30"},{v:24,d:"2026-01-10"},{v:29,d:"2025-12-20"},{v:26,d:"2025-12-01"}], joined: "2025-08-22", role: "user" },
  { id: 5, name: "Tom Gallagher", email: "tom@example.com", password: "Pass@123", plan: "yearly", charity: 1, charityPct: 25, active: true, scores: [{v:44,d:"2026-03-15"},{v:42,d:"2026-02-25"},{v:45,d:"2026-02-08"},{v:40,d:"2026-01-22"},{v:43,d:"2026-01-05"}], joined: "2025-07-10", role: "user" },
];

export const DRAW_NUMBERS = [18, 24, 31, 38, 42];

export function genDraw() {
  const pool = Array.from({ length: 5 }, () => Math.floor(Math.random() * 44) + 1);
  return [...new Set(pool)].slice(0, 5);
}
