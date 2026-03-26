import { useState } from "react";
import { C, CHARITIES, DRAW_NUMBERS } from "../data/constants";
import { Card } from "../components/Card";
import { Modal } from "../components/Modal";
import { Pill } from "../components/Pill";
import { Stat } from "../components/Stat";
import { ScoreBar } from "../components/ScoreBar";
import { NumberBall } from "../components/NumberBall";
import { NavItem } from "../components/NavItem";
import { useAuth } from "../contexts/AuthContext";

export function UserDashboard() {
  const { user, allUsers, setAllUsers, logout: onLogout } = useAuth();
  const [tab, setTab] = useState("overview");
  const [scoreModal, setScoreModal] = useState(false);
  const [newScore, setNewScore] = useState({
    v: "",
    d: new Date().toISOString().split("T")[0],
  });
  const [drawNumbers] = useState(DRAW_NUMBERS);

  const userFull = allUsers.find((u) => u.id === user.id) || {
    ...user,
    scores: [],
    charityPct: 10,
  };

  const addScore = () => {
    const v = parseInt(newScore.v);
    if (!v || v < 1 || v > 45) return;
    const entry = { v, d: newScore.d };
    const scores = [entry, ...(userFull.scores || [])].slice(0, 5);
    const updated = allUsers.map((u) =>
      u.id === user.id ? { ...u, scores } : u
    );
    setAllUsers(updated);
    setNewScore({ v: "", d: new Date().toISOString().split("T")[0] });
    setScoreModal(false);
  };

  const charity =
    CHARITIES.find((c) => c.id === userFull.charity) || CHARITIES[0];
  const sub = userFull.plan === "yearly" ? 89.99 : 9.99;
  const charityAmt = ((sub * (userFull.charityPct || 10)) / 100).toFixed(2);

  const userScoreVals = (userFull.scores || []).map((s) => s.v);
  const matchCount = userScoreVals.filter((v) => drawNumbers.includes(v)).length;
  const matchTier =
    matchCount >= 5
      ? "🏆 JACKPOT!"
      : matchCount >= 4
      ? "🥇 4-Match!"
      : matchCount >= 3
      ? "🥈 3-Match!"
      : null;

  const nav = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "scores", icon: "🏌️", label: "My Scores" },
    { id: "draw", icon: "🎯", label: "Draw" },
    { id: "charity", icon: "💚", label: "My Charity" },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: "1.5rem",
            padding: "0 4px",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              background: "var(--c-lime)",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            ⛳
          </div>
          <span
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: "var(--c-lime)",
              letterSpacing: "-0.02em",
            }}
          >
            DrawGolf
          </span>
        </div>
        {nav.map((n) => (
          <NavItem
            key={n.id}
            {...n}
            active={tab === n.id}
            onClick={() => setTab(n.id)}
          />
        ))}
        <div style={{ marginTop: "auto" }}>
          <div
            style={{
              padding: "10px 14px",
              borderTop: "1px solid var(--c-dark-border)",
              paddingTop: 16,
              marginTop: 8,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--c-text)",
              }}
            >
              {userFull.name}
            </div>
            <div style={{ fontSize: 12, color: "var(--c-text-muted)" }}>
              {userFull.email}
            </div>
            <Pill
              color={userFull.active !== false ? "var(--c-accent)" : "var(--c-danger)"}
              bg={userFull.active !== false ? `${C.accent}22` : `${C.danger}22`}
            >
              {userFull.active !== false ? "Active" : "Inactive"}
            </Pill>
          </div>
          <button
            onClick={onLogout}
            style={{
              background: "none",
              border: "none",
              color: "var(--c-text-dim)",
              cursor: "pointer",
              fontSize: 13,
              padding: "8px 14px",
              width: "100%",
              textAlign: "left",
            }}
          >
            ← Sign out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="dashboard-main">
        {tab === "overview" && (
          <div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                margin: "0 0 1.5rem",
              }}
            >
              Welcome back, {userFull.name.split(" ")[0]} 👋
            </h1>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                gap: 12,
                marginBottom: 24,
              }}
            >
              <Card>
                <Stat
                  label="Subscription"
                  value={userFull.plan === "yearly" ? "Yearly" : "Monthly"}
                  sub={
                    userFull.plan === "yearly" ? "₹89.99/yr" : "₹9.99/mo"
                  }
                  color={C.lime}
                />
              </Card>
              <Card>
                <Stat
                  label="Scores Logged"
                  value={(userFull.scores || []).length}
                  sub="of 5 max"
                  color={C.accent}
                />
              </Card>
              <Card>
                <Stat
                  label="Charity %"
                  value={`${userFull.charityPct || 10}%`}
                  sub={`₹${charityAmt}/period`}
                  color={C.gold}
                />
              </Card>
              <Card>
                <Stat
                  label="Draw Match"
                  value={matchCount}
                  sub={matchTier || "Numbers matched"}
                  color={matchTier ? C.lime : "var(--c-text-muted)"}
                />
              </Card>
            </div>
            {matchTier && (
              <Card
                style={{
                  border: `1px solid ${C.lime}66`,
                  marginBottom: 20,
                  background: `${C.lime}0A`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontSize: 32 }}>🎉</span>
                  <div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 18,
                        color: "var(--c-lime)",
                      }}
                    >
                      {matchTier}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: "var(--c-text-muted)",
                      }}
                    >
                      You matched {matchCount} numbers in this month's draw!
                    </div>
                  </div>
                </div>
              </Card>
            )}
            <Card style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 16 }}>
                  Recent Scores
                </span>
                <button
                  onClick={() => setTab("scores")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--c-lime)",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  See all →
                </button>
              </div>
              {(userFull.scores || []).length === 0 ? (
                <p style={{ color: "var(--c-text-muted)", fontSize: 14 }}>
                  No scores yet. Add your first score!
                </p>
              ) : (
                (userFull.scores || []).slice(0, 3).map((s, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--c-text-muted)",
                        }}
                      >
                        {s.d}
                      </span>
                    </div>
                    <ScoreBar score={s.v} />
                  </div>
                ))
              )}
            </Card>
          </div>
        )}

        {tab === "scores" && (
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Card style={{ marginBottom: 20 }}>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--c-text-muted)",
                    margin: "0 0 16px",
                  }}
                >
                  Stableford format · Range: 1–45 · Last 5 retained
                </p>
                {(userFull.scores || []).length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "var(--c-text-muted)",
                    }}
                  >
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🏌️</div>
                    <p>No scores yet. Add your first score to participate.</p>
                  </div>
                ) : (
                  (userFull.scores || []).map((s, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "12px 0",
                        borderBottom:
                          i < (userFull.scores || []).length - 1
                            ? "1px solid var(--c-dark-border)"
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            color: "var(--c-text-muted)",
                          }}
                        >
                          {s.d}
                        </span>
                        {i === 0 && <Pill color={C.lime}>Latest</Pill>}
                      </div>
                      <ScoreBar score={s.v} />
                    </div>
                  ))
                )}
                <button
                  onClick={() => setScoreModal(true)}
                  style={{
                    width: "100%",
                    background: "var(--c-lime-deep)",
                    color: "var(--c-dark)",
                    border: "none",
                    borderRadius: 10,
                    padding: "12px",
                    fontWeight: 800,
                    cursor: "pointer",
                    fontSize: 15,
                    marginTop: 16,
                  }}
                >
                  Add Score
                </button>
              </Card>
            </div>
            <Modal
              open={scoreModal}
              onClose={() => setScoreModal(false)}
              title="Add New Score"
            >
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: "var(--c-text-muted)",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  Stableford Score (1–45)
                </label>
                <input
                  type="number"
                  min={1}
                  max={45}
                  value={newScore.v}
                  onChange={(e) =>
                    setNewScore((s) => ({ ...s, v: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    background: "var(--c-dark-mid)",
                    border: "1px solid var(--c-dark-border)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    color: "var(--c-text)",
                    fontSize: 20,
                    fontWeight: 800,
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: "var(--c-text-muted)",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  Date Played
                </label>
                <input
                  type="date"
                  value={newScore.d}
                  onChange={(e) =>
                    setNewScore((s) => ({ ...s, d: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    background: "var(--c-dark-mid)",
                    border: "1px solid var(--c-dark-border)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    color: "var(--c-text)",
                    fontSize: 15,
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <button
                onClick={addScore}
                style={{
                  width: "100%",
                  background: "var(--c-lime)",
                  color: "var(--c-dark)",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontSize: 15,
                }}
              >
                Save Score
              </button>
            </Modal>
          </div>
        )}

        {tab === "draw" && (
          <div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                margin: "0 0 6px",
              }}
            >
              Monthly Draw
            </h1>
            <p
              style={{
                color: "var(--c-text-muted)",
                fontSize: 14,
                marginBottom: "1.5rem",
              }}
            >
              March 2026 · Results published 31st
            </p>
            <Card style={{ marginBottom: 20 }}>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--c-text-muted)",
                  marginBottom: 16,
                }}
              >
                This month's draw numbers
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  marginBottom: 20,
                }}
              >
                {drawNumbers.map((n, i) => (
                  <NumberBall
                    key={i}
                    n={n}
                    matched={userScoreVals.includes(n)}
                  />
                ))}
              </div>
              <div
                style={{
                  borderTop: "1px solid var(--c-dark-border)",
                  paddingTop: 16,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--c-text-muted)",
                    marginBottom: 12,
                  }}
                >
                  Your scores vs draw
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {userScoreVals.length === 0 ? (
                    <span
                      style={{
                        color: "var(--c-text-muted)",
                        fontSize: 14,
                      }}
                    >
                      No scores entered yet
                    </span>
                  ) : (
                    userScoreVals.map((v, i) => (
                      <NumberBall
                        key={i}
                        n={v}
                        matched={drawNumbers.includes(v)}
                      />
                    ))
                  )}
                </div>
                {matchCount > 0 && (
                  <div
                    style={{
                      marginTop: 16,
                      padding: 12,
                      background: `${C.lime}10`,
                      border: `1px solid ${C.lime}33`,
                      borderRadius: 10,
                    }}
                  >
                    <span style={{ color: "var(--c-lime)", fontWeight: 700 }}>
                      🎯 {matchCount} match{matchCount > 1 ? "es" : ""}!
                    </span>
                    {matchTier && (
                      <span style={{ color: "var(--c-text)", marginLeft: 8 }}>
                        {matchTier}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Card>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                gap: 12,
              }}
            >
              {[
                {
                  tier: "5-Match",
                  pct: "40%",
                  label: "Jackpot",
                  prize: "₹56,800",
                  roll: true,
                  color: C.lime,
                },
                {
                  tier: "4-Match",
                  pct: "35%",
                  label: "Major",
                  prize: "₹49,700",
                  roll: false,
                  color: C.gold,
                },
                {
                  tier: "3-Match",
                  pct: "25%",
                  label: "Minor",
                  prize: "₹35,500",
                  roll: false,
                  color: C.accent,
                },
              ].map((p, i) => (
                <Card key={i} style={{ border: `1px solid ${p.color}33` }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: p.color,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      marginBottom: 8,
                    }}
                  >
                    {p.tier} · {p.pct}
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 900,
                      color: "var(--c-text)",
                    }}
                  >
                    {p.prize}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--c-text-muted)",
                      marginTop: 4,
                    }}
                  >
                    {p.roll
                      ? "Jackpot rolls over if unclaimed"
                      : "Split between winners"}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {tab === "charity" && (
          <div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                margin: "0 0 1.5rem",
              }}
            >
              My Charity
            </h1>
            <Card
              style={{
                marginBottom: 20,
                border: `1px solid ${charity.color}44`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    background: `${charity.color}22`,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                  }}
                >
                  {charity.img}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 18,
                      color: "var(--c-text)",
                    }}
                  >
                    {charity.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--c-text-muted)",
                    }}
                  >
                    {charity.cause}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: 12, color: "var(--c-text-muted)" }}>
                    Your contribution
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: charity.color,
                    }}
                  >
                    {userFull.charityPct || 10}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "var(--c-text-muted)" }}>
                    Per period
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: "var(--c-text)",
                    }}
                  >
                    ₹{charityAmt}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "var(--c-text-muted)" }}>
                    Total raised
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: "var(--c-text)",
                    }}
                  >
                    ₹{charity.raised.toLocaleString()}
                  </div>
                </div>
              </div>
            </Card>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>
              All Charities
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                gap: 12,
              }}
            >
              {CHARITIES.map((c) => (
                <Card
                  key={c.id}
                  hover
                  style={{
                    opacity: c.id !== charity.id ? 0.7 : 1,
                    position: "relative",
                  }}
                >
                  {c.id === charity.id && (
                    <div style={{ position: "absolute", top: 12, right: 12 }}>
                      <Pill color={C.lime}>Your charity</Pill>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        background: `${c.color}22`,
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                      }}
                    >
                      {c.img}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--c-text)" }}>
                        {c.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: c.color,
                          fontWeight: 700,
                        }}
                      >
                        ₹{c.raised.toLocaleString()} raised
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
