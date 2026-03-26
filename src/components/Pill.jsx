import { C } from "../data/constants";

export function Pill({ children, color = C.lime, bg }) {
  return (
    <span
      className="pill"
      style={{
        background: bg || `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      {children}
    </span>
  );
}
