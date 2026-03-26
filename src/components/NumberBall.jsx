import { C } from "../data/constants";

export function NumberBall({ n, matched }) {
  return (
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: "50%",
        background: matched ? C.lime : "var(--c-dark-border)",
        color: matched ? C.dark : "var(--c-text-muted)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 15,
        fontWeight: 800,
        border: `2px solid ${matched ? C.lime : "var(--c-dark-border)"}`,
        transition: "all 0.3s",
        boxShadow: matched ? `0 0 12px ${C.lime}55` : "none",
      }}
    >
      {n}
    </div>
  );
}
