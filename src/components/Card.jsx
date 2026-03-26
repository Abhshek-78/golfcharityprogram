import { useState } from "react";
import { C } from "../data/constants";

export function Card({ children, style, onClick, hover }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={`card ${hover ? "hoverable" : ""}`}
      onClick={onClick}
      onMouseEnter={() => hover && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
