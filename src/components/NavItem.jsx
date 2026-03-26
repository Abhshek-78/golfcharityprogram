import { C } from "../data/constants";

export function NavItem({ label, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: active ? `${C.lime}18` : "transparent",
        color: active ? C.lime : "var(--c-text-muted)",
        border: active ? `1px solid ${C.lime}33` : "1px solid transparent",
        borderRadius: 10,
        padding: "10px 14px",
        cursor: "pointer",
        width: "100%",
        textAlign: "left",
        fontSize: 14,
        fontWeight: active ? 700 : 400,
        transition: "all 0.15s",
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      {label}
    </button>
  );
}
