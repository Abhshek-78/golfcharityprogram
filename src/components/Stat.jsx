import { C } from "../data/constants";

export function Stat({ label, value, sub, color = C.lime }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span
        style={{
          fontSize: 12,
          color: "var(--c-text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>
        {value}
      </span>
      {sub && <span style={{ fontSize: 12, color: "var(--c-text-dim)" }}>{sub}</span>}
    </div>
  );
}
