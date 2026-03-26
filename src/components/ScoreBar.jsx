import { C } from "../data/constants";

export function ScoreBar({ score }) {
  const pct = (score / 45) * 100;
  const col =
    score >= 35
      ? C.lime
      : score >= 25
      ? C.gold
      : score >= 15
      ? C.accent
      : C.danger;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          flex: 1,
          height: 6,
          background: "var(--c-dark-border)",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: col,
            borderRadius: 99,
            transition: "width 0.5s",
          }}
        />
      </div>
      <span
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: col,
          minWidth: 36,
          textAlign: "right",
        }}
      >
        {score}
      </span>
    </div>
  );
}
