import { useState, useEffect } from "react";
import { C, CHARITIES } from "../data/constants";
import { Card } from "../components/Card";

export function LandingPage({ onEnter }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 80);
    return () => clearInterval(t);
  }, []);

  const stats = [
    { n: "12,847", l: "Active Members" },
    { n: "₹284,000", l: "Prize Pool" },
    { n: "₹142,000", l: "Charity Raised" },
    { n: "6", l: "Charities" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--c-dark)", color: "var(--c-text)", fontFamily: "var(--font-family)" }}>
      {/* Nav */}
      <nav style={{ padding: "1.25rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--c-dark-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "var(--c-lime)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 18 }}>⛳</span>
          </div>
          <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.03em", color: "var(--c-lime)" }}>DrawGolf</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => onEnter("login")} style={{ background: "none", border: "1px solid var(--c-dark-border)", color: "var(--c-text-muted)", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontSize: 14 }}>Sign In</button>
          <button onClick={() => onEnter("signup")} style={{ background: "var(--c-lime)", border: "none", color: "var(--c-dark)", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Join Now</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding: "5rem 2rem 3rem", maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${C.lime}15`, border: `1px solid ${C.lime}33`, borderRadius: 99, padding: "6px 16px", marginBottom: "2rem" }}>
          <div style={{ width: 8, height: 8, background: "var(--c-lime)", borderRadius: "50%", animation: "pulse 1.5s ease-in-out infinite" }} />
          <span style={{ fontSize: 13, color: "var(--c-lime)", fontWeight: 600 }}>Monthly draw now open · ₹142,000 jackpot</span>
        </div>

        <h1 style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05, margin: "0 0 1.5rem", color: "var(--c-text)" }}>
          Golf meets <span style={{ color: "var(--c-lime)" }}>generosity</span>.<br />Play with purpose.
        </h1>
        <p style={{ fontSize: 18, color: "var(--c-text-muted)", maxWidth: 580, margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
          Enter your Stableford scores, join monthly prize draws, and watch your game fund causes that matter. Every subscription, every point, every draw — counts.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => onEnter("signup")} style={{ background: "var(--c-lime)", color: "var(--c-dark)", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 16, fontWeight: 800, cursor: "pointer", letterSpacing: "-0.01em" }}>
            Start for ₹9.99/mo →
          </button>
          <button onClick={() => onEnter("login")} style={{ background: "none", color: "var(--c-text)", border: "1px solid var(--c-dark-border)", borderRadius: 12, padding: "14px 32px", fontSize: 16, cursor: "pointer" }}>
            See how it works
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 1, background: "var(--c-dark-border)", borderRadius: 20, overflow: "hidden", border: "1px solid var(--c-dark-border)" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: "var(--c-dark-card)", padding: "2rem 1.5rem", textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "var(--c-lime)", letterSpacing: "-0.03em" }}>{s.n}</div>
              <div style={{ fontSize: 13, color: "var(--c-text-muted)", marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: "4rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.03em", color: "var(--c-text)", marginBottom: "2.5rem", textAlign: "center" }}>
          Three things. One subscription.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
          {[
            { icon: "📊", title: "Track your game", desc: "Log your last 5 Stableford scores. Watch your trend. Compare against the draw." },
            { icon: "🎯", title: "Win every month", desc: "Match 3, 4, or 5 numbers in the monthly draw. Jackpot rolls over — it keeps growing." },
            { icon: "💚", title: "Give with every stroke", desc: "10–30% of your sub goes directly to your chosen charity. You control the split." },
          ].map((item, i) => (
            <Card key={i}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{item.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--c-text)", margin: "0 0 8px" }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: "var(--c-text-muted)", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Charities */}
      <div style={{ padding: "2rem 2rem 4rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--c-text)", margin: 0 }}>Supported charities</h2>
          <span style={{ fontSize: 13, color: "var(--c-text-dim)" }}>Choose one when you join</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
          {CHARITIES.map((c) => (
            <Card key={c.id} hover style={{ display: "flex", alignItems: "center", gap: 16, padding: "1rem 1.25rem" }}>
              <div style={{ width: 44, height: 44, background: `${c.color}22`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{c.img}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--c-text)" }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "var(--c-text-muted)" }}>{c.cause}</div>
                <div style={{ fontSize: 12, color: c.color, fontWeight: 700, marginTop: 2 }}>₹{c.raised.toLocaleString()} raised</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "3rem 2rem 5rem", textAlign: "center", borderTop: "1px solid var(--c-dark-border)" }}>
        <p style={{ fontSize: 13, color: "var(--c-text-muted)", marginBottom: 12 }}>Monthly · Yearly (2 months free) · Cancel anytime</p>
        <button onClick={() => onEnter("signup")} style={{ background: "var(--c-lime)", color: "var(--c-dark)", border: "none", borderRadius: 14, padding: "16px 40px", fontSize: 18, fontWeight: 900, cursor: "pointer", letterSpacing: "-0.02em" }}>
          Join DrawGolf Today →
        </button>
      </div>
    </div>
  );
}
