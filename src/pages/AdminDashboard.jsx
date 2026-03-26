import { useState } from "react";
import { C, CHARITIES, DRAW_NUMBERS, genDraw } from "../data/constants";
import { Card } from "../components/Card";
import { Stat } from "../components/Stat";
import { NumberBall } from "../components/NumberBall";
import { NavItem } from "../components/NavItem";
import { Pill } from "../components/Pill";
import { Modal } from "../components/Modal";
import { useAuth } from "../contexts/AuthContext";

export function AdminDashboard() {
  const { allUsers, setAllUsers, logout: onLogout } = useAuth();
  const [tab, setTab] = useState("overview");
  const [drawNumbers, setDrawNumbers] = useState(DRAW_NUMBERS);
  const [simNumbers, setSimNumbers] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [charityList, setCharityList] = useState(CHARITIES);
  const [addCharityModal, setAddCharityModal] = useState(false);
  const [newCharity, setNewCharity] = useState({ name: "", cause: "", img: "⛳" });

  const totalSubs = allUsers.reduce(
    (a, u) => a + (u.plan === "yearly" ? 89.99 : 9.99),
    0
  );
  const prizePool = totalSubs * 0.55;
  const charityTotal = allUsers.reduce(
    (a, u) => a + (u.plan === "yearly" ? 89.99 : 9.99) * ((u.charityPct || 10) / 100),
    0
  );
  const activeCount = allUsers.filter((u) => u.active).length;

  const nav = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "users", icon: "👥", label: "Users" },
    { id: "draw", icon: "🎯", label: "Draw Engine" },
    { id: "charities", icon: "💚", label: "Charities" },
    { id: "winners", icon: "🏆", label: "Winners" },
  ];

  const runSim = () => setSimNumbers(genDraw());
  const publishDraw = () => {
    if (simNumbers) setDrawNumbers(simNumbers);
    setSimNumbers(null);
  };

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
              background: "var(--c-purple)",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            ⚙️
          </div>
          <span
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: "var(--c-purple)",
              letterSpacing: "-0.02em",
            }}
          >
            Admin
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
              Admin Overview
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
                  label="Total Users"
                  value={allUsers.length}
                  sub={`${activeCount} active`}
                  color={C.lime}
                />
              </Card>
              <Card>
                <Stat
                  label="Monthly Revenue"
                  value={`₹${totalSubs.toFixed(0)}`}
                  sub="this month"
                  color={C.accent}
                />
              </Card>
              <Card>
                <Stat
                  label="Prize Pool"
                  value={`₹${prizePool.toFixed(0)}`}
                  sub="distributed"
                  color={C.gold}
                />
              </Card>
              <Card>
                <Stat
                  label="Charity Total"
                  value={`₹${charityTotal.toFixed(0)}`}
                  sub="contributed"
                  color={C.purple}
                />
              </Card>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Card>
                <h3
                  style={{
                    fontWeight: 800,
                    fontSize: 16,
                    margin: "0 0 16px",
                  }}
                >
                  Subscription Mix
                </h3>
                {["monthly", "yearly"].map((p) => {
                  const count = allUsers.filter((u) => u.plan === p).length;
                  const pct = Math.round((count / allUsers.length) * 100);
                  return (
                    <div key={p} style={{ marginBottom: 12 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            textTransform: "capitalize",
                            color: "var(--c-text)",
                          }}
                        >
                          {p}
                        </span>
                        <span style={{ fontSize: 13, color: "var(--c-text-muted)" }}>
                          {count} · {pct}%
                        </span>
                      </div>
                      <div
                        style={{
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
                            background:
                              p === "yearly" ? "var(--c-lime)" : "var(--c-accent)",
                            borderRadius: 99,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </Card>
              <Card>
                <h3
                  style={{
                    fontWeight: 800,
                    fontSize: 16,
                    margin: "0 0 16px",
                  }}
                >
                  Charity Distribution
                </h3>
                {charityList.slice(0, 4).map((c) => {
                  const count = allUsers.filter((u) => u.charity === c.id).length;
                  const pct = Math.round((count / allUsers.length) * 100) || 0;
                  return (
                    <div key={c.id} style={{ marginBottom: 12 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <span style={{ fontSize: 13, color: "var(--c-text)" }}>
                          {c.img} {c.name.split(" ")[0]}
                        </span>
                        <span style={{ fontSize: 13, color: "var(--c-text-muted)" }}>
                          {count} users
                        </span>
                      </div>
                      <div
                        style={{
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
                            background: c.color,
                            borderRadius: 99,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </Card>
            </div>
          </div>
        )}

        {tab === "users" && (
          <div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                margin: "0 0 1.5rem",
              }}
            >
              User Management
            </h1>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {allUsers.map((u) => (
                <Card
                  key={u.id}
                  hover
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "1rem 1.25rem",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: `${C.lime}22`,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 14,
                      color: "var(--c-lime)",
                      flexShrink: 0,
                    }}
                  >
                    {u.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: "var(--c-text)",
                      }}
                    >
                      {u.name}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--c-text-muted)" }}>
                      {u.email} · joined {u.joined}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Pill color={u.plan === "yearly" ? C.lime : C.accent}>
                      {u.plan}
                    </Pill>
                    <Pill color={u.active ? C.accent : C.danger}>
                      {u.active ? "Active" : "Inactive"}
                    </Pill>
                    <button
                      onClick={() => setEditUser(u)}
                      style={{
                        background: `${C.purple}22`,
                        border: `1px solid ${C.purple}44`,
                        color: "var(--c-purple)",
                        borderRadius: 8,
                        padding: "5px 12px",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </Card>
              ))}
            </div>
            <Modal
              open={!!editUser}
              onClose={() => setEditUser(null)}
              title={`Edit: ${editUser?.name}`}
            >
              {editUser && (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        color: "var(--c-text-muted)",
                        marginBottom: 6,
                      }}
                    >
                      STATUS
                    </label>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 8,
                      }}
                    >
                      {[true, false].map((v) => (
                        <div
                          key={String(v)}
                          onClick={() => setEditUser((u) => ({ ...u, active: v }))}
                          style={{
                            background:
                              editUser.active === v
                                ? `${v ? C.accent : C.danger}22`
                                : "var(--c-dark-mid)",
                            border: `1px solid ${
                              editUser.active === v
                                ? v
                                  ? "var(--c-accent)"
                                  : "var(--c-danger)"
                                : "var(--c-dark-border)"
                            }`,
                            borderRadius: 8,
                            padding: "10px",
                            cursor: "pointer",
                            textAlign: "center",
                            fontSize: 13,
                            fontWeight: 700,
                            color:
                              editUser.active === v
                                ? v
                                  ? "var(--c-accent)"
                                  : "var(--c-danger)"
                                : "var(--c-text-muted)",
                          }}
                        >
                          {v ? "Active" : "Inactive"}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        color: "var(--c-text-muted)",
                        marginBottom: 6,
                      }}
                    >
                      PLAN
                    </label>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 8,
                      }}
                    >
                      {["monthly", "yearly"].map((p) => (
                        <div
                          key={p}
                          onClick={() => setEditUser((u) => ({ ...u, plan: p }))}
                          style={{
                            background:
                              editUser.plan === p
                                ? `${C.lime}18`
                                : "var(--c-dark-mid)",
                            border: `1px solid ${
                              editUser.plan === p
                                ? "var(--c-lime)"
                                : "var(--c-dark-border)"
                            }`,
                            borderRadius: 8,
                            padding: "10px",
                            cursor: "pointer",
                            textAlign: "center",
                            fontSize: 13,
                            fontWeight: 700,
                            color:
                              editUser.plan === p
                                ? "var(--c-lime)"
                                : "var(--c-text-muted)",
                            textTransform: "capitalize",
                          }}
                        >
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setAllUsers((us) =>
                        us.map((u) => (u.id === editUser.id ? editUser : u))
                      );
                      setEditUser(null);
                    }}
                    style={{
                      width: "100%",
                      background: "var(--c-lime)",
                      color: "var(--c-dark)",
                      border: "none",
                      borderRadius: 10,
                      padding: "12px",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              )}
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
              Draw Engine
            </h1>
            <p
              style={{
                color: "var(--c-text-muted)",
                fontSize: 14,
                marginBottom: "1.5rem",
              }}
            >
              Manage and publish monthly draws
            </p>

            <Card style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 16 }}>
                  Current Published Draw — March 2026
                </span>
                <Pill color={C.lime}>Live</Pill>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {drawNumbers.map((n, i) => (
                  <NumberBall key={i} n={n} matched={false} />
                ))}
              </div>
            </Card>

            <Card style={{ marginBottom: 16 }}>
              <h3
                style={{
                  fontWeight: 800,
                  fontSize: 16,
                  margin: "0 0 16px",
                }}
              >
                Simulation
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--c-text-muted)",
                  marginBottom: 16,
                }}
              >
                Run a simulation before publishing official draw results.
              </p>
              <button
                onClick={runSim}
                style={{
                  background: "var(--c-purple-soft)",
                  border: `1px solid ${C.purple}44`,
                  color: "var(--c-purple)",
                  borderRadius: 10,
                  padding: "10px 20px",
                  fontWeight: 700,
                  cursor: "pointer",
                  marginRight: 10,
                }}
              >
                🎲 Run Simulation
              </button>
              {simNumbers && (
                <div
                  style={{
                    marginTop: 16,
                    padding: 16,
                    background: "var(--c-dark-mid)",
                    borderRadius: 12,
                    border: "1px solid var(--c-dark-border)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--c-text-muted)",
                      marginBottom: 12,
                    }}
                  >
                    Simulated numbers:
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      marginBottom: 16,
                    }}
                  >
                    {simNumbers.map((n, i) => (
                      <NumberBall key={i} n={n} matched={false} />
                    ))}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--c-text-muted)",
                      marginBottom: 12,
                    }}
                  >
                    Winners with these numbers:
                    {allUsers.map((u) => {
                      const matches = (u.scores || []).filter((s) =>
                        simNumbers.includes(s.v)
                      ).length;
                      if (matches >= 3)
                        return (
                          <div
                            key={u.id}
                            style={{ color: "var(--c-lime)", marginTop: 4 }}
                          >
                            {u.name}: {matches}-match{" "}
                            {matches >= 5 ? "🏆" : matches >= 4 ? "🥇" : "🥈"}
                          </div>
                        );
                      return null;
                    })}
                  </div>
                  <button
                    onClick={publishDraw}
                    style={{
                      background: "var(--c-lime)",
                      color: "var(--c-dark)",
                      border: "none",
                      borderRadius: 10,
                      padding: "10px 20px",
                      fontWeight: 800,
                      cursor: "pointer",
                      marginTop: 10,
                    }}
                  >
                    ✓ Publish as Official Draw
                  </button>
                </div>
              )}
            </Card>
          </div>
        )}

        {tab === "charities" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h1
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  margin: 0,
                }}
              >
                Charities
              </h1>
              <button
                onClick={() => setAddCharityModal(true)}
                style={{
                  background: "var(--c-lime)",
                  color: "var(--c-dark)",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 20px",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                + Add Charity
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                gap: 12,
              }}
            >
              {charityList.map((c) => (
                <Card key={c.id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          background: `${c.color}22`,
                          borderRadius: 12,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 24,
                        }}
                      >
                        {c.img}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--c-text)" }}>
                          {c.name}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--c-text-muted)" }}>
                          {c.cause}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setCharityList((cl) => cl.filter((x) => x.id !== c.id))
                      }
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--c-danger)",
                        cursor: "pointer",
                        fontSize: 16,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: 12,
                      borderTop: "1px solid var(--c-dark-border)",
                    }}
                  >
                    <span style={{ fontSize: 13, color: "var(--c-text-muted)" }}>
                      Total raised
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: c.color,
                      }}
                    >
                      ₹{c.raised.toLocaleString()}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
            <Modal
              open={addCharityModal}
              onClose={() => setAddCharityModal(false)}
              title="Add Charity"
            >
              {["name", "cause"].map((k) => (
                <div key={k} style={{ marginBottom: 16 }}>
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
                    {k}
                  </label>
                  <input
                    value={newCharity[k]}
                    onChange={(e) =>
                      setNewCharity((c) => ({ ...c, [k]: e.target.value }))
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
              ))}
              <button
                onClick={() => {
                  if (!newCharity.name) return;
                  setCharityList((cl) => [
                    ...cl,
                    {
                      id: Date.now(),
                      ...newCharity,
                      raised: 0,
                      color: C.lime,
                    },
                  ]);
                  setNewCharity({ name: "", cause: "", img: "⛳" });
                  setAddCharityModal(false);
                }}
                style={{
                  width: "100%",
                  background: "var(--c-lime)",
                  color: "var(--c-dark)",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Add Charity
              </button>
            </Modal>
          </div>
        )}

        {tab === "winners" && (
          <div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                margin: "0 0 1.5rem",
              }}
            >
              Winners
            </h1>
            {allUsers.filter((u) => {
              const matches = (u.scores || []).filter((s) =>
                drawNumbers.includes(s.v)
              ).length;
              return matches >= 3;
            }).length === 0 ? (
              <Card>
                <p
                  style={{
                    color: "var(--c-text-muted)",
                    textAlign: "center",
                    padding: "2rem",
                  }}
                >
                  No winners for the current draw yet.
                </p>
              </Card>
            ) : (
              allUsers
                .filter((u) => {
                  const matches = (u.scores || []).filter((s) =>
                    drawNumbers.includes(s.v)
                  ).length;
                  return matches >= 3;
                })
                .map((u) => {
                  const matches = (u.scores || []).filter((s) =>
                    drawNumbers.includes(s.v)
                  ).length;
                  const tier =
                    matches >= 5
                      ? "Jackpot"
                      : matches >= 4
                      ? "4-Match"
                      : "3-Match";
                  const color =
                    matches >= 5 ? C.lime : matches >= 4 ? C.gold : C.accent;
                  const prize =
                    matches >= 5
                      ? "₹56,800"
                      : matches >= 4
                      ? "₹49,700"
                      : "₹35,500";
                  return (
                    <Card
                      key={u.id}
                      style={{ marginBottom: 12, border: `1px solid ${color}44` }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                          }}
                        >
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              background: `${color}22`,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 800,
                              color,
                            }}
                          >
                            {u.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <div
                              style={{ fontWeight: 700, color: "var(--c-text)" }}
                            >
                              {u.name}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: "var(--c-text-muted)",
                              }}
                            >
                              {tier} · {matches} matched numbers
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{ fontSize: 20, fontWeight: 900, color }}
                          >
                            {prize}
                          </div>
                          <Pill color={C.gold}>Pending Verification</Pill>
                        </div>
                      </div>
                    </Card>
                  );
                })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
