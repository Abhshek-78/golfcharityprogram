import { useState, useEffect, useRef } from "react";

// ─── Design Tokens ───────────────────────────────────────────────────────────
const C = {
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

// ─── Mock Data ────────────────────────────────────────────────────────────────
const CHARITIES = [
  { id: 1, name: "Golf4Good Foundation", cause: "Youth development", raised: 48200, img: "⛳", color: C.lime },
  { id: 2, name: "Fairway for All", cause: "Disability access", raised: 31500, img: "🤝", color: C.accent },
  { id: 3, name: "Green Futures", cause: "Environmental", raised: 22100, img: "🌿", color: "#4AE8C0" },
  { id: 4, name: "Caddie Scholars", cause: "Education", raised: 18800, img: "📚", color: C.gold },
  { id: 5, name: "Stroke of Hope", cause: "Medical research", raised: 14200, img: "❤️", color: C.danger },
  { id: 6, name: "Eagle Eye Vision", cause: "Eye health", raised: 9600, img: "👁️", color: C.purple },
];

const INITIAL_USERS = [
  { id: 1, name: "James Whitmore", email: "james@example.com", plan: "yearly", charity: 1, charityPct: 15, active: true, scores: [{v:34,d:"2026-03-10"},{v:29,d:"2026-02-22"},{v:31,d:"2026-02-05"},{v:28,d:"2026-01-18"},{v:36,d:"2025-12-30"}], joined: "2025-09-01" },
  { id: 2, name: "Sarah Chen", email: "sarah@example.com", plan: "monthly", charity: 3, charityPct: 10, active: true, scores: [{v:22,d:"2026-03-12"},{v:25,d:"2026-02-28"},{v:19,d:"2026-02-10"},{v:27,d:"2026-01-25"},{v:21,d:"2026-01-08"}], joined: "2025-11-14" },
  { id: 3, name: "Marcus Reid", email: "marcus@example.com", plan: "monthly", charity: 2, charityPct: 20, active: true, scores: [{v:38,d:"2026-03-08"},{v:41,d:"2026-02-20"},{v:35,d:"2026-02-02"},{v:39,d:"2026-01-16"},{v:33,d:"2025-12-28"}], joined: "2026-01-03" },
  { id: 4, name: "Priya Nair", email: "priya@example.com", plan: "yearly", charity: 4, charityPct: 10, active: false, scores: [{v:27,d:"2026-02-14"},{v:30,d:"2026-01-30"},{v:24,d:"2026-01-10"},{v:29,d:"2025-12-20"},{v:26,d:"2025-12-01"}], joined: "2025-08-22" },
  { id: 5, name: "Tom Gallagher", email: "tom@example.com", plan: "yearly", charity: 1, charityPct: 25, active: true, scores: [{v:44,d:"2026-03-15"},{v:42,d:"2026-02-25"},{v:45,d:"2026-02-08"},{v:40,d:"2026-01-22"},{v:43,d:"2026-01-05"}], joined: "2025-07-10" },
];

const DRAW_NUMBERS = [18, 24, 31, 38, 42];

function genDraw() {
  const pool = Array.from({ length: 5 }, () => Math.floor(Math.random() * 44) + 1);
  return [...new Set(pool)].slice(0, 5);
}

// ─── Components ──────────────────────────────────────────────────────────────
function Pill({ children, color = C.lime, bg }) {
  return (
    <span style={{
      background: bg || `${color}22`,
      color,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      padding: "3px 10px",
      borderRadius: 99,
      border: `1px solid ${color}44`,
      whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function Card({ children, style, onClick, hover }) {
  const [h, setH] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h ? C.darkMid : C.darkCard,
        border: `1px solid ${h ? C.lime + "44" : C.darkBorder}`,
        borderRadius: 16,
        padding: "1.5rem",
        transition: "all 0.2s",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >{children}</div>
  );
}

function Stat({ label, value, sub, color = C.lime }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
      <span style={{ fontSize:12, color: C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</span>
      <span style={{ fontSize:28, fontWeight:800, color, lineHeight:1 }}>{value}</span>
      {sub && <span style={{ fontSize:12, color: C.textDim }}>{sub}</span>}
    </div>
  );
}

function ScoreBar({ score }) {
  const pct = (score / 45) * 100;
  const col = score >= 35 ? C.lime : score >= 25 ? C.gold : score >= 15 ? C.accent : C.danger;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
      <div style={{ flex:1, height:6, background: C.darkBorder, borderRadius:99, overflow:"hidden" }}>
        <div style={{ width:`${pct}%`, height:"100%", background:col, borderRadius:99, transition:"width 0.5s" }} />
      </div>
      <span style={{ fontSize:18, fontWeight:800, color:col, minWidth:36, textAlign:"right" }}>{score}</span>
    </div>
  );
}

function NumberBall({ n, matched }) {
  return (
  <div style={{
      width:42, height:42, borderRadius:"50%",
      background: matched ? C.lime : C.darkBorder,
      color: matched ? C.dark : C.textMuted,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:15, fontWeight:800,
      border: `2px solid ${matched ? C.lime : C.darkBorder}`,
      transition:"all 0.3s",
      boxShadow: matched ? `0 0 12px ${C.lime}55` : "none",
    }}>{n}</div>
  );
}

function NavItem({ label, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        display:"flex", alignItems:"center", gap:10,
        background: active ? `${C.lime}18` : "transparent",
        color: active ? C.lime : C.textMuted,
        border: active ? `1px solid ${C.lime}33` : "1px solid transparent",
        borderRadius:10, padding:"10px 14px",
        cursor:"pointer", width:"100%", textAlign:"left",
        fontSize:14, fontWeight: active ? 700 : 400,
        transition:"all 0.15s",
      }}
    >
      <span style={{fontSize:16}}>{icon}</span>
      {label}
    </button>
  );
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.75)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:1000, padding:20,
    }}>
      <div style={{
        background: C.darkCard, border:`1px solid ${C.darkBorder}`,
        borderRadius:20, padding:"2rem", maxWidth:500, width:"100%",
        maxHeight:"80vh", overflowY:"auto",
      }}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem"}}>
          <h2 style={{color:C.text, fontSize:20, fontWeight:800, margin:0}}>{title}</h2>
          <button onClick={onClose} style={{background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:20}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────
function LandingPage({ onEnter }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 80);
    return () => clearInterval(t);
  }, []);

  const stats = [
    { n: "12,847", l: "Active Members" },
    { n: "£284,000", l: "Prize Pool" },
    { n: "£142,000", l: "Charity Raised" },
    { n: "6", l: "Charities" },
  ];

  return (
    <div style={{ minHeight:"100vh", background: C.dark, color: C.text, fontFamily:"'Clash Display', system-ui, sans-serif" }}>
      {/* Nav */}
      <nav style={{ padding:"1.25rem 2rem", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${C.darkBorder}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, background:C.lime, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:18 }}>⛳</span>
          </div>
          <span style={{ fontSize:18, fontWeight:900, letterSpacing:"-0.03em", color:C.lime }}>DrawGolf</span>
        </div>
        <div style={{ display:"flex", gap:12 }}>
          <button onClick={() => onEnter("login")} style={{ background:"none", border:`1px solid ${C.darkBorder}`, color:C.textMuted, borderRadius:8, padding:"8px 18px", cursor:"pointer", fontSize:14 }}>Sign In</button>
          <button onClick={() => onEnter("signup")} style={{ background:C.lime, border:"none", color:C.dark, borderRadius:8, padding:"8px 18px", cursor:"pointer", fontSize:14, fontWeight:700 }}>Join Now</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding:"5rem 2rem 3rem", maxWidth:1100, margin:"0 auto", textAlign:"center" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:`${C.lime}15`, border:`1px solid ${C.lime}33`, borderRadius:99, padding:"6px 16px", marginBottom:"2rem" }}>
          <div style={{ width:8, height:8, background:C.lime, borderRadius:"50%", animation:"pulse 1.5s ease-in-out infinite" }} />
          <span style={{ fontSize:13, color:C.lime, fontWeight:600 }}>Monthly draw now open · £142,000 jackpot</span>
        </div>

        <h1 style={{ fontSize:"clamp(2.5rem, 7vw, 5.5rem)", fontWeight:900, letterSpacing:"-0.04em", lineHeight:1.05, margin:"0 0 1.5rem", color:C.text }}>
          Golf meets <span style={{ color:C.lime }}>generosity</span>.<br />Play with purpose.
        </h1>
        <p style={{ fontSize:18, color:C.textMuted, maxWidth:580, margin:"0 auto 2.5rem", lineHeight:1.7 }}>
          Enter your Stableford scores, join monthly prize draws, and watch your game fund causes that matter. Every subscription, every point, every draw — counts.
        </p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <button onClick={() => onEnter("signup")} style={{ background:C.lime, color:C.dark, border:"none", borderRadius:12, padding:"14px 32px", fontSize:16, fontWeight:800, cursor:"pointer", letterSpacing:"-0.01em" }}>
            Start for £9.99/mo →
          </button>
          <button onClick={() => onEnter("login")} style={{ background:"none", color:C.text, border:`1px solid ${C.darkBorder}`, borderRadius:12, padding:"14px 32px", fontSize:16, cursor:"pointer" }}>
            See how it works
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding:"2rem", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:1, background:C.darkBorder, borderRadius:20, overflow:"hidden", border:`1px solid ${C.darkBorder}` }}>
          {stats.map((s,i) => (
            <div key={i} style={{ background:C.darkCard, padding:"2rem 1.5rem", textAlign:"center" }}>
              <div style={{ fontSize:28, fontWeight:900, color:C.lime, letterSpacing:"-0.03em" }}>{s.n}</div>
              <div style={{ fontSize:13, color:C.textMuted, marginTop:4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding:"4rem 2rem", maxWidth:1100, margin:"0 auto" }}>
        <h2 style={{ fontSize:32, fontWeight:900, letterSpacing:"-0.03em", color:C.text, marginBottom:"2.5rem", textAlign:"center" }}>
          Three things. One subscription.
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
          {[
            { icon:"📊", title:"Track your game", desc:"Log your last 5 Stableford scores. Watch your trend. Compare against the draw." },
            { icon:"🎯", title:"Win every month", desc:"Match 3, 4, or 5 numbers in the monthly draw. Jackpot rolls over — it keeps growing." },
            { icon:"💚", title:"Give with every stroke", desc:"10–30% of your sub goes directly to your chosen charity. You control the split." },
          ].map((item,i) => (
            <Card key={i}>
              <div style={{ fontSize:32, marginBottom:16 }}>{item.icon}</div>
              <h3 style={{ fontSize:18, fontWeight:800, color:C.text, margin:"0 0 8px" }}>{item.title}</h3>
              <p style={{ fontSize:14, color:C.textMuted, lineHeight:1.7, margin:0 }}>{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Charities */}
      <div style={{ padding:"2rem 2rem 4rem", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:"1.5rem" }}>
          <h2 style={{ fontSize:24, fontWeight:800, color:C.text, margin:0 }}>Supported charities</h2>
          <span style={{ fontSize:13, color:C.textDim }}>Choose one when you join</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:12 }}>
          {CHARITIES.map(c => (
            <Card key={c.id} hover style={{ display:"flex", alignItems:"center", gap:16, padding:"1rem 1.25rem" }}>
              <div style={{ width:44, height:44, background:`${c.color}22`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{c.img}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:C.text }}>{c.name}</div>
                <div style={{ fontSize:12, color:C.textMuted }}>{c.cause}</div>
                <div style={{ fontSize:12, color:c.color, fontWeight:700, marginTop:2 }}>£{c.raised.toLocaleString()} raised</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding:"3rem 2rem 5rem", textAlign:"center", borderTop:`1px solid ${C.darkBorder}` }}>
        <p style={{ fontSize:13, color:C.textMuted, marginBottom:12 }}>Monthly · Yearly (2 months free) · Cancel anytime</p>
        <button onClick={() => onEnter("signup")} style={{ background:C.lime, color:C.dark, border:"none", borderRadius:14, padding:"16px 40px", fontSize:18, fontWeight:900, cursor:"pointer", letterSpacing:"-0.02em" }}>
          Join DrawGolf Today →
        </button>
      </div>
    </div>
  );
}

function AuthPage({ mode, onAuth, onSwitch }) {
  const [form, setForm] = useState({ name:"", email:"", password:"", plan:"monthly", charity:1, charityPct:10 });
  const upd = k => e => setForm(f => ({...f, [k]:e.target.value}));

  const input = (label, key, type="text", placeholder="") => (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:"block", fontSize:12, color:C.textMuted, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.07em" }}>{label}</label>
      <input type={type} value={form[key]} onChange={upd(key)} placeholder={placeholder}
        style={{ width:"100%", background:C.darkMid, border:`1px solid ${C.darkBorder}`, borderRadius:10, padding:"10px 14px", color:C.text, fontSize:15, boxSizing:"border-box", outline:"none" }} />
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.dark, display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem", fontFamily:"system-ui, sans-serif" }}>
      <div style={{ width:"100%", maxWidth:440 }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ fontSize:36, fontWeight:900, color:C.lime, letterSpacing:"-0.03em" }}>DrawGolf</div>
          <p style={{ color:C.textMuted, fontSize:15, marginTop:4 }}>{mode === "login" ? "Welcome back" : "Start your journey"}</p>
        </div>
        <Card>
          {mode === "signup" && input("Full Name", "name", "text", "Your name")}
          {input("Email", "email", "email", "you@example.com")}
          {input("Password", "password", "password", "••••••••")}
          {mode === "signup" && (
            <>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:"block", fontSize:12, color:C.textMuted, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.07em" }}>Subscription Plan</label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  {["monthly","yearly"].map(p => (
                    <div key={p} onClick={() => setForm(f=>({...f,plan:p}))}
                      style={{ background: form.plan===p ? `${C.lime}18` : C.darkMid, border:`1px solid ${form.plan===p ? C.lime : C.darkBorder}`, borderRadius:10, padding:"12px", cursor:"pointer", textAlign:"center" }}>
                      <div style={{ fontWeight:700, color: form.plan===p ? C.lime : C.text, textTransform:"capitalize" }}>{p}</div>
                      <div style={{ fontSize:12, color:C.textMuted }}>{p==="monthly"?"£9.99/mo":"£89.99/yr"}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:"block", fontSize:12, color:C.textMuted, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.07em" }}>Choose Your Charity</label>
                <select value={form.charity} onChange={upd("charity")}
                  style={{ width:"100%", background:C.darkMid, border:`1px solid ${C.darkBorder}`, borderRadius:10, padding:"10px 14px", color:C.text, fontSize:15 }}>
                  {CHARITIES.map(c => <option key={c.id} value={c.id}>{c.img} {c.name}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.textMuted, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                  <span>Charity Contribution</span>
                  <span style={{ color:C.accent }}>{form.charityPct}%</span>
                </label>
                <input type="range" min={10} max={30} value={form.charityPct} onChange={upd("charityPct")}
                  style={{ width:"100%", accentColor:C.lime }} />
              </div>
            </>
          )}
          <button
            onClick={() => {
              if (mode === "admin") { onAuth({ role:"admin", name:"Admin" }); return; }
              const newUser = mode === "signup" ? {
                id: Date.now(), name: form.name || "New User", email: form.email,
                plan: form.plan, charity: parseInt(form.charity), charityPct: parseInt(form.charityPct),
                active: true, scores: [], joined: new Date().toISOString().split("T")[0], role: "user"
              } : { role:"user", name: form.email.split("@")[0] || "User", email: form.email };
              onAuth(newUser);
            }}
            style={{ width:"100%", background:C.lime, color:C.dark, border:"none", borderRadius:10, padding:"12px", fontSize:15, fontWeight:800, cursor:"pointer" }}>
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
          <p style={{ textAlign:"center", marginTop:16, fontSize:13, color:C.textMuted }}>
            {mode === "login" ? "No account? " : "Have an account? "}
            <span onClick={onSwitch} style={{ color:C.lime, cursor:"pointer", fontWeight:600 }}>
              {mode === "login" ? "Sign up free" : "Sign in"}
            </span>
          </p>
          {mode === "login" && (
            <p style={{ textAlign:"center", marginTop:4, fontSize:12, color:C.textDim }}>
              Demo admin?{" "}
              <span onClick={() => onAuth({ role:"admin", name:"Admin", email:"admin@drawgolf.com" })} style={{ color:C.accent, cursor:"pointer" }}>
                Enter as admin
              </span>
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}

function UserDashboard({ user, setUser, allUsers, setAllUsers, onLogout }) {
  const [tab, setTab] = useState("overview");
  const [scoreModal, setScoreModal] = useState(false);
  const [newScore, setNewScore] = useState({ v: "", d: new Date().toISOString().split("T")[0] });
  const [drawNumbers] = useState(DRAW_NUMBERS);

  const userFull = allUsers.find(u => u.id === user.id) || { ...user, scores: [], charityPct: 10 };

  const addScore = () => {
    const v = parseInt(newScore.v);
    if (!v || v < 1 || v > 45) return;
    const entry = { v, d: newScore.d };
    const scores = [entry, ...(userFull.scores || [])].slice(0, 5);
    const updated = allUsers.map(u => u.id === user.id ? { ...u, scores } : u);
    setAllUsers(updated);
    setNewScore({ v: "", d: new Date().toISOString().split("T")[0] });
    setScoreModal(false);
  };

  const charity = CHARITIES.find(c => c.id === userFull.charity) || CHARITIES[0];
  const sub = userFull.plan === "yearly" ? 89.99 : 9.99;
  const charityAmt = (sub * (userFull.charityPct || 10) / 100).toFixed(2);

  const userScoreVals = (userFull.scores || []).map(s => s.v);
  const matchCount = userScoreVals.filter(v => drawNumbers.includes(v)).length;
  const matchTier = matchCount >= 5 ? "🏆 JACKPOT!" : matchCount >= 4 ? "🥇 4-Match!" : matchCount >= 3 ? "🥈 3-Match!" : null;

  const nav = [
    { id:"overview", icon:"📊", label:"Overview" },
    { id:"scores", icon:"🏌️", label:"My Scores" },
    { id:"draw", icon:"🎯", label:"Draw" },
    { id:"charity", icon:"💚", label:"My Charity" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.dark, color:C.text, fontFamily:"system-ui, sans-serif", display:"flex" }}>
      {/* Sidebar */}
      <div style={{ width:220, borderRight:`1px solid ${C.darkBorder}`, padding:"1.5rem 1rem", display:"flex", flexDirection:"column", gap:4, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1.5rem", padding:"0 4px" }}>
          <div style={{ width:28, height:28, background:C.lime, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>⛳</div>
          <span style={{ fontSize:16, fontWeight:900, color:C.lime, letterSpacing:"-0.02em" }}>DrawGolf</span>
        </div>
        {nav.map(n => <NavItem key={n.id} {...n} active={tab===n.id} onClick={() => setTab(n.id)} />)}
        <div style={{ marginTop:"auto" }}>
          <div style={{ padding:"10px 14px", borderTop:`1px solid ${C.darkBorder}`, paddingTop:16, marginTop:8 }}>
            <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{userFull.name}</div>
            <div style={{ fontSize:12, color:C.textMuted }}>{userFull.email}</div>
            <Pill color={userFull.active !== false ? C.accent : C.danger} style={{ marginTop:8 }}>
              {userFull.active !== false ? "Active" : "Inactive"}
            </Pill>
          </div>
          <button onClick={onLogout} style={{ background:"none", border:"none", color:C.textDim, cursor:"pointer", fontSize:13, padding:"8px 14px", width:"100%", textAlign:"left" }}>← Sign out</button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, padding:"2rem", overflowY:"auto" }}>
        {tab === "overview" && (
          <div>
            <h1 style={{ fontSize:26, fontWeight:900, letterSpacing:"-0.03em", margin:"0 0 1.5rem" }}>Welcome back, {userFull.name.split(" ")[0]} 👋</h1>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12, marginBottom:24 }}>
              <Card><Stat label="Subscription" value={userFull.plan === "yearly" ? "Yearly" : "Monthly"} sub={userFull.plan === "yearly" ? "£89.99/yr" : "£9.99/mo"} color={C.lime} /></Card>
              <Card><Stat label="Scores Logged" value={(userFull.scores||[]).length} sub="of 5 max" color={C.accent} /></Card>
              <Card><Stat label="Charity %" value={`${userFull.charityPct||10}%`} sub={`£${charityAmt}/period`} color={C.gold} /></Card>
              <Card><Stat label="Draw Match" value={matchCount} sub={matchTier || "Numbers matched"} color={matchTier ? C.lime : C.textMuted} /></Card>
            </div>
            {matchTier && (
              <Card style={{ border:`1px solid ${C.lime}66`, marginBottom:20, background:`${C.lime}0A` }}>
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <span style={{ fontSize:32 }}>🎉</span>
                  <div>
                    <div style={{ fontWeight:800, fontSize:18, color:C.lime }}>{matchTier}</div>
                    <div style={{ fontSize:14, color:C.textMuted }}>You matched {matchCount} numbers in this month's draw!</div>
                  </div>
                </div>
              </Card>
            )}
            <Card style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <span style={{ fontWeight:700, fontSize:16 }}>Recent Scores</span>
                <button onClick={() => setTab("scores")} style={{ background:"none", border:"none", color:C.lime, cursor:"pointer", fontSize:13 }}>See all →</button>
              </div>
              {(userFull.scores||[]).length === 0 ? (
                <p style={{ color:C.textMuted, fontSize:14 }}>No scores yet. Add your first score!</p>
              ) : (
                (userFull.scores||[]).slice(0,3).map((s,i) => (
                  <div key={i} style={{ marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:12, color:C.textMuted }}>{s.d}</span>
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
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <Card style={{ marginBottom:20 }}>
                <p style={{ fontSize:13, color:C.textMuted, margin:"0 0 16px" }}>Stableford format · Range: 1–45 · Last 5 retained</p>
                {(userFull.scores||[]).length === 0 ? (
                  <div style={{ textAlign:"center", padding:"2rem", color:C.textMuted }}>
                    <div style={{ fontSize:40, marginBottom:12 }}>🏌️</div>
                    <p>No scores yet. Add your first score to participate in draws.</p>
                  </div>
                ) : (
                  (userFull.scores||[]).map((s,i) => (
                    <div key={i} style={{ padding:"12px 0", borderBottom: i < (userFull.scores||[]).length-1 ? `1px solid ${C.darkBorder}` : "none" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                        <span style={{ fontSize:13, color:C.textMuted }}>{s.d}</span>
                        {i===0 && <Pill color={C.lime}>Latest</Pill>}
                      </div>
                      <ScoreBar score={s.v} />
                    </div>
                  ))
                )}
              </Card>
            </div>
            <Modal open={scoreModal} onClose={() => setScoreModal(false)} title="Add New Score">
              <div style={{ marginBottom:16 }}>
                <label style={{ display:"block", fontSize:12, color:C.textMuted, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.07em" }}>Stableford Score (1–45)</label>
                <input type="number" min={1} max={45} value={newScore.v} onChange={e => setNewScore(s=>({...s,v:e.target.value}))}
                  style={{ width:"100%", background:C.darkMid, border:`1px solid ${C.darkBorder}`, borderRadius:10, padding:"10px 14px", color:C.text, fontSize:20, fontWeight:800, boxSizing:"border-box" }} />
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:12, color:C.textMuted, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.07em" }}>Date Played</label>
                <input type="date" value={newScore.d} onChange={e => setNewScore(s=>({...s,d:e.target.value}))}
                  style={{ width:"100%", background:C.darkMid, border:`1px solid ${C.darkBorder}`, borderRadius:10, padding:"10px 14px", color:C.text, fontSize:15, boxSizing:"border-box" }} />
              </div>
              <button onClick={addScore} style={{ width:"100%", background:C.lime, color:C.dark, border:"none", borderRadius:10, padding:"12px", fontWeight:800, cursor:"pointer", fontSize:15 }}>
                Save Score
              </button>
            </Modal>
          </div>
        )}

        {tab === "draw" && (
          <div>
            <h1 style={{ fontSize:26, fontWeight:900, letterSpacing:"-0.03em", margin:"0 0 6px" }}>Monthly Draw</h1>
            <p style={{ color:C.textMuted, fontSize:14, marginBottom:"1.5rem" }}>March 2026 · Results published 31st</p>
            <Card style={{ marginBottom:20 }}>
              <p style={{ fontSize:13, color:C.textMuted, marginBottom:16 }}>This month's draw numbers</p>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:20 }}>
                {drawNumbers.map((n,i) => <NumberBall key={i} n={n} matched={userScoreVals.includes(n)} />)}
              </div>
              <div style={{ borderTop:`1px solid ${C.darkBorder}`, paddingTop:16 }}>
                <p style={{ fontSize:13, color:C.textMuted, marginBottom:12 }}>Your scores vs draw</p>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  {userScoreVals.length === 0 ? (
                    <span style={{ color:C.textMuted, fontSize:14 }}>No scores entered yet</span>
                  ) : (
                    userScoreVals.map((v,i) => <NumberBall key={i} n={v} matched={drawNumbers.includes(v)} />)
                  )}
                </div>
                {matchCount > 0 && (
                  <div style={{ marginTop:16, padding:12, background:`${C.lime}10`, border:`1px solid ${C.lime}33`, borderRadius:10 }}>
                    <span style={{ color:C.lime, fontWeight:700 }}>🎯 {matchCount} match{matchCount>1?"es":""}!</span>
                    {matchTier && <span style={{ color:C.text, marginLeft:8 }}>{matchTier}</span>}
                  </div>
                )}
              </div>
            </Card>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
              {[
                { tier:"5-Match", pct:"40%", label:"Jackpot", prize:"£56,800", roll:true, color:C.lime },
                { tier:"4-Match", pct:"35%", label:"Major", prize:"£49,700", roll:false, color:C.gold },
                { tier:"3-Match", pct:"25%", label:"Minor", prize:"£35,500", roll:false, color:C.accent },
              ].map((p,i) => (
                <Card key={i} style={{ border:`1px solid ${p.color}33` }}>
                  <div style={{ fontSize:12, color:p.color, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>{p.tier} · {p.pct}</div>
                  <div style={{ fontSize:22, fontWeight:900, color:C.text }}>{p.prize}</div>
                  <div style={{ fontSize:12, color:C.textMuted, marginTop:4 }}>{p.roll ? "Jackpot rolls over if unclaimed" : "Split between winners"}</div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {tab === "charity" && (
          <div>
            <h1 style={{ fontSize:26, fontWeight:900, letterSpacing:"-0.03em", margin:"0 0 1.5rem" }}>My Charity</h1>
            <Card style={{ marginBottom:20, border:`1px solid ${charity.color}44` }}>
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
                <div style={{ width:56, height:56, background:`${charity.color}22`, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>{charity.img}</div>
                <div>
                  <div style={{ fontWeight:800, fontSize:18, color:C.text }}>{charity.name}</div>
                  <div style={{ fontSize:13, color:C.textMuted }}>{charity.cause}</div>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                <div><div style={{ fontSize:12, color:C.textMuted }}>Your contribution</div><div style={{ fontSize:20, fontWeight:800, color:charity.color }}>{userFull.charityPct||10}%</div></div>
                <div><div style={{ fontSize:12, color:C.textMuted }}>Per period</div><div style={{ fontSize:20, fontWeight:800, color:C.text }}>£{charityAmt}</div></div>
                <div><div style={{ fontSize:12, color:C.textMuted }}>Total raised</div><div style={{ fontSize:20, fontWeight:800, color:C.text }}>£{charity.raised.toLocaleString()}</div></div>
              </div>
            </Card>
            <h2 style={{ fontSize:18, fontWeight:800, marginBottom:12 }}>All Charities</h2>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:12 }}>
              {CHARITIES.map(c => (
                <Card key={c.id} hover style={{ opacity: c.id !== charity.id ? 0.7 : 1, position:"relative" }}>
                  {c.id === charity.id && (
                    <div style={{ position:"absolute", top:12, right:12 }}>
                      <Pill color={C.lime}>Your charity</Pill>
                    </div>
                  )}
                  <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                    <div style={{ width:44, height:44, background:`${c.color}22`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{c.img}</div>
                    <div>
                      <div style={{ fontWeight:700, color:C.text }}>{c.name}</div>
                      <div style={{ fontSize:12, color:c.color, fontWeight:700 }}>£{c.raised.toLocaleString()} raised</div>
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

function AdminDashboard({ onLogout, allUsers, setAllUsers }) {
  const [tab, setTab] = useState("overview");
  const [drawNumbers, setDrawNumbers] = useState(DRAW_NUMBERS);
  const [simNumbers, setSimNumbers] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [charityList, setCharityList] = useState(CHARITIES);
  const [addCharityModal, setAddCharityModal] = useState(false);
  const [newCharity, setNewCharity] = useState({ name:"", cause:"", img:"⛳" });

  const totalSubs = allUsers.reduce((a,u) => a + (u.plan==="yearly" ? 89.99 : 9.99), 0);
  const prizePool = totalSubs * 0.55;
  const charityTotal = allUsers.reduce((a,u) => a + ((u.plan==="yearly"?89.99:9.99) * ((u.charityPct||10)/100)), 0);
  const activeCount = allUsers.filter(u=>u.active).length;

  const nav = [
    { id:"overview", icon:"📊", label:"Overview" },
    { id:"users", icon:"👥", label:"Users" },
    { id:"draw", icon:"🎯", label:"Draw Engine" },
    { id:"charities", icon:"💚", label:"Charities" },
    { id:"winners", icon:"🏆", label:"Winners" },
  ];

  const runSim = () => setSimNumbers(genDraw());
  const publishDraw = () => { if(simNumbers) setDrawNumbers(simNumbers); setSimNumbers(null); };

  return (
    <div style={{ minHeight:"100vh", background:C.dark, color:C.text, fontFamily:"system-ui, sans-serif", display:"flex" }}>
      {/* Sidebar */}
      <div style={{ width:220, borderRight:`1px solid ${C.darkBorder}`, padding:"1.5rem 1rem", display:"flex", flexDirection:"column", gap:4, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1.5rem", padding:"0 4px" }}>
          <div style={{ width:28, height:28, background:C.purple, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>⚙️</div>
          <span style={{ fontSize:16, fontWeight:900, color:C.purple, letterSpacing:"-0.02em" }}>Admin</span>
        </div>
        {nav.map(n => <NavItem key={n.id} {...n} active={tab===n.id} onClick={() => setTab(n.id)} />)}
        <div style={{ marginTop:"auto" }}>
          <button onClick={onLogout} style={{ background:"none", border:"none", color:C.textDim, cursor:"pointer", fontSize:13, padding:"8px 14px", width:"100%", textAlign:"left" }}>← Sign out</button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, padding:"2rem", overflowY:"auto" }}>
        {tab === "overview" && (
          <div>
            <h1 style={{ fontSize:26, fontWeight:900, letterSpacing:"-0.03em", margin:"0 0 1.5rem" }}>Admin Overview</h1>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12, marginBottom:24 }}>
              <Card><Stat label="Total Users" value={allUsers.length} sub={`${activeCount} active`} color={C.lime} /></Card>
              <Card><Stat label="Monthly Revenue" value={`£${totalSubs.toFixed(0)}`} sub="this month" color={C.accent} /></Card>
              <Card><Stat label="Prize Pool" value={`£${prizePool.toFixed(0)}`} sub="distributed" color={C.gold} /></Card>
              <Card><Stat label="Charity Total" value={`£${charityTotal.toFixed(0)}`} sub="contributed" color={C.purple} /></Card>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <Card>
                <h3 style={{ fontWeight:800, fontSize:16, margin:"0 0 16px" }}>Subscription Mix</h3>
                { ["monthly","yearly"].map(p => {
                  const count = allUsers.filter(u=>u.plan===p).length;
                  const pct = Math.round((count/allUsers.length)*100);
                  return (
                    <div key={p} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:13, textTransform:"capitalize", color:C.text }}>{p}</span>
                        <span style={{ fontSize:13, color:C.textMuted }}>{count} · {pct}%</span>
                      </div>
                      <div style={{ height:6, background:C.darkBorder, borderRadius:99, overflow:"hidden" }}>
                        <div style={{ width:`${pct}%`, height:"100%", background: p==="yearly" ? C.lime : C.accent, borderRadius:99 }} />
                      </div>
                    </div>
                  );
                }) }
              </Card>
              <Card>
                <h3 style={{ fontWeight:800, fontSize:16, margin:"0 0 16px" }}>Charity Distribution</h3>
                {charityList.slice(0,4).map(c => {
                  const count = allUsers.filter(u=>u.charity===c.id).length;
                  const pct = Math.round((count/allUsers.length)*100)||0;
                  return (
                    <div key={c.id} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:13, color:C.text }}>{c.img} {c.name.split(" ")[0]}</span>
                        <span style={{ fontSize:13, color:C.textMuted }}>{count} users</span>
                      </div>
                      <div style={{ height:6, background:C.darkBorder, borderRadius:99, overflow:"hidden" }}>
                        <div style={{ width:`${pct}%`, height:"100%", background:c.color, borderRadius:99 }} />
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
            <h1 style={{ fontSize:26, fontWeight:900, letterSpacing:"-0.03em", margin:"0 0 1.5rem" }}>User Management</h1>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {allUsers.map(u => (
                <Card key={u.id} hover style={{ display:"flex", alignItems:"center", gap:16, padding:"1rem 1.25rem" }}>
                  <div style={{ width:40, height:40, background:`${C.lime}22`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14, color:C.lime, flexShrink:0 }}>
                    {u.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:14, color:C.text }}>{u.name}</div>
                    <div style={{ fontSize:12, color:C.textMuted }}>{u.email} · joined {u.joined}</div>
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <Pill color={u.plan==="yearly"?C.lime:C.accent}>{u.plan}</Pill>
                    <Pill color={u.active?C.accent:C.danger}>{u.active?"Active":"Inactive"}</Pill>
                    <button onClick={() => setEditUser(u)} style={{ background:`${C.purple}22`, border:`1px solid ${C.purple}44`, color:C.purple, borderRadius:8, padding:"5px 12px", cursor:"pointer", fontSize:12, fontWeight:700 }}>Edit</button>
                  </div>
                </Card>
              ))}
            </div>
            <Modal open={!!editUser} onClose={() => setEditUser(null)} title={`Edit: ${editUser?.name}`}>
              {editUser && (
                <div>
                  <div style={{ marginBottom:16 }}>
                    <label style={{ display:"block", fontSize:12, color:C.textMuted, marginBottom:6 }}>STATUS</label>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                      {[true, false].map(v => (
                        <div key={String(v)} onClick={() => setEditUser(u => ({...u, active:v}))}
                          style={{ background: editUser.active===v ? `${v?C.accent:C.danger}22` : C.darkMid, border:`1px solid ${editUser.active===v ? (v?C.accent:C.danger) : C.darkBorder}`, borderRadius:8, padding:"10px", cursor:"pointer", textAlign:"center", fontSize:13, fontWeight:700, color: editUser.active===v ? (v?C.accent:C.danger) : C.textMuted }}>
                          {v ? "Active" : "Inactive"}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom:16 }}>
                    <label style={{ display:"block", fontSize:12, color:C.textMuted, marginBottom:6 }}>PLAN</label>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                      {["monthly","yearly"].map(p => (
                        <div key={p} onClick={() => setEditUser(u => ({...u, plan:p}))}
                          style={{ background: editUser.plan===p ? `${C.lime}18` : C.darkMid, border:`1px solid ${editUser.plan===p?C.lime:C.darkBorder}`, borderRadius:8, padding:"10px", cursor:"pointer", textAlign:"center", fontSize:13, fontWeight:700, color: editUser.plan===p?C.lime:C.textMuted, textTransform:"capitalize" }}>
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => { setAllUsers(us => us.map(u => u.id===editUser.id ? editUser : u)); setEditUser(null); }}
                    style={{ width:"100%", background:C.lime, color:C.dark, border:"none", borderRadius:10, padding:"12px", fontWeight:800, cursor:"pointer" }}>
                    Save Changes
                  </button>
                </div>
              )}
            </Modal>
          </div>
        )}

        {tab === "draw" && (
          <div>
            <h1 style={{ fontSize:26, fontWeight:900, letterSpacing:"-0.03em", margin:"0 0 6px" }}>Draw Engine</h1>
            <p style={{ color:C.textMuted, fontSize:14, marginBottom:"1.5rem" }}>Manage and publish monthly draws</p>

            <Card style={{ marginBottom:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <span style={{ fontWeight:700, fontSize:16 }}>Current Published Draw — March 2026</span>
                <Pill color={C.lime}>Live</Pill>
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {drawNumbers.map((n,i) => <NumberBall key={i} n={n} matched={false} />)}
              </div>
            </Card>

            <Card style={{ marginBottom:16 }}>
              <h3 style={{ fontWeight:800, fontSize:16, margin:"0 0 16px" }}>Simulation</h3>
              <p style={{ fontSize:13, color:C.textMuted, marginBottom:16 }}>Run a simulation before publishing official draw results.</p>
              <button onClick={runSim}
                style={{ background:C.purpleSoft, border:`1px solid ${C.purple}44`, color:C.purple, borderRadius:10, padding:"10px 20px", fontWeight:700, cursor:"pointer", marginRight:10 }}>
                🎲 Run Simulation
              </button>
              {simNumbers && (
                <div style={{ marginTop:16, padding:16, background:C.darkMid, borderRadius:12, border:`1px solid ${C.darkBorder}` }}>
                  <div style={{ fontSize:13, color:C.textMuted, marginBottom:12 }}>Simulated numbers:</div>
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:16 }}>
                    {simNumbers.map((n,i) => <NumberBall key={i} n={n} matched={false} />)}
                  </div>
                  <div style={{ fontSize:13, color:C.textMuted, marginBottom:12 }}>
                    Winners with these numbers:
                    {allUsers.map(u => {
                      const matches = (u.scores||[]).filter(s => simNumbers.includes(s.v)).length;
                      if (matches >= 3) return <div key={u.id} style={{ color:C.lime, marginTop:4 }}>{u.name}: {matches}-match {matches>=5?"🏆":matches>=4?"🥇":"🥈"}</div>;
                      return null;
                    })}
                  </div>
                  <button onClick={publishDraw}
                    style={{ background:C.lime, color:C.dark, border:"none", borderRadius:10, padding:"10px 20px", fontWeight:800, cursor:"pointer" }}>
                    ✓ Publish as Official Draw
                  </button>
                </div>
              )}
            </Card>
          </div>
        )}

        {tab === "charities" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
              <h1 style={{ fontSize:26, fontWeight:900, letterSpacing:"-0.03em", margin:0 }}>Charities</h1>
              <button onClick={() => setAddCharityModal(true)}
                style={{ background:C.lime, color:C.dark, border:"none", borderRadius:10, padding:"10px 20px", fontWeight:800, cursor:"pointer", fontSize:14 }}>
                + Add Charity
              </button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:12 }}>
              {charityList.map(c => (
                <Card key={c.id}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:44, height:44, background:`${c.color}22`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{c.img}</div>
                      <div>
                        <div style={{ fontWeight:700, color:C.text }}>{c.name}</div>
                        <div style={{ fontSize:12, color:C.textMuted }}>{c.cause}</div>
                      </div>
                    </div>
                    <button onClick={() => setCharityList(cl => cl.filter(x => x.id !== c.id))}
                      style={{ background:"none", border:"none", color:C.danger, cursor:"pointer", fontSize:16 }}>✕</button>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", paddingTop:12, borderTop:`1px solid ${C.darkBorder}` }}>
                    <span style={{ fontSize:13, color:C.textMuted }}>Total raised</span>
                    <span style={{ fontSize:14, fontWeight:700, color:c.color }}>£{c.raised.toLocaleString()}</span>
                  </div>
                </Card>
              ))}
            </div>
            <Modal open={addCharityModal} onClose={() => setAddCharityModal(false)} title="Add Charity">
              { ["name","cause"].map(k => (
                <div key={k} style={{ marginBottom:16 }}>
                  <label style={{ display:"block", fontSize:12, color:C.textMuted, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.07em" }}>{k}</label>
                  <input value={newCharity[k]} onChange={e => setNewCharity(c=>({...c,[k]:e.target.value}))}
                    style={{ width:"100%", background:C.darkMid, border:`1px solid ${C.darkBorder}`, borderRadius:10, padding:"10px 14px", color:C.text, fontSize:15, boxSizing:"border-box" }} />
                </div>
              )) }
              <button onClick={() => {
                if (!newCharity.name) return;
                setCharityList(cl => [...cl, { id:Date.now(), ...newCharity, raised:0, color:C.lime }]);
                setNewCharity({name:"",cause:"",img:"⛳"});
                setAddCharityModal(false);
              }} style={{ width:"100%", background:C.lime, color:C.dark, border:"none", borderRadius:10, padding:"12px", fontWeight:800, cursor:"pointer" }}>
                Add Charity
              </button>
            </Modal>
          </div>
        )}

        {tab === "winners" && (
          <div>
            <h1 style={{ fontSize:26, fontWeight:900, letterSpacing:"-0.03em", margin:"0 0 1.5rem" }}>Winners</h1>
            {allUsers.filter(u => { const matches = (u.scores||[]).filter(s => drawNumbers.includes(s.v)).length; return matches >= 3; }).length === 0 ? (
              <Card>
                <p style={{ color:C.textMuted, textAlign:"center", padding:"2rem" }}>No winners for the current draw yet.</p>
              </Card>
            ) : (
              allUsers.filter(u => { const matches = (u.scores||[]).filter(s => drawNumbers.includes(s.v)).length; return matches >= 3; }).map(u => {
                const matches = (u.scores||[]).filter(s => drawNumbers.includes(s.v)).length;
                const tier = matches>=5?"Jackpot":matches>=4?"4-Match":"3-Match";
                const color = matches>=5?C.lime:matches>=4?C.gold:C.accent;
                const prize = matches>=5?"£56,800":matches>=4?"£49,700":"£35,500";
                return (
                  <Card key={u.id} style={{ marginBottom:12, border:`1px solid ${color}44` }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                        <div style={{ width:44, height:44, background:`${color}22`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color }}>
                          {u.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                        </div>
                        <div>
                          <div style={{ fontWeight:700, color:C.text }}>{u.name}</div>
                          <div style={{ fontSize:12, color:C.textMuted }}>{tier} · {matches} matched numbers</div>
                        </div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:20, fontWeight:900, color }}>{prize}</div>
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

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState(INITIAL_USERS);

  const handleEnter = (mode) => {
    setAuthMode(mode);
    setPage("auth");
  };

  const handleAuth = (u) => {
    if (u.role === "admin") {
      setUser({ ...u, role:"admin" });
      setPage("admin");
    } else {
      const found = allUsers.find(x => x.email === u.email);
      if (found) {
        setUser(found);
        setPage("user");
      } else {
        const newUser = { ...u, id: Date.now(), active: true, scores: [], joined: new Date().toISOString().split("T")[0] };
        setAllUsers(us => [...us, newUser]);
        setUser(newUser);
        setPage("user");
      }
    }
  };

  const handleLogout = () => { setUser(null); setPage("landing"); };

  if (page === "landing") return <LandingPage onEnter={handleEnter} />;
  if (page === "auth") return (
    <AuthPage
      mode={authMode}
      onAuth={handleAuth}
      onSwitch={() => setAuthMode(m => m==="login"?"signup":"login")}
    />
  );
  if (page === "admin") return <AdminDashboard onLogout={handleLogout} allUsers={allUsers} setAllUsers={setAllUsers} />;
  if (page === "user") return (
    <UserDashboard
      user={user}
      setUser={setUser}
      allUsers={allUsers}
      setAllUsers={setAllUsers}
      onLogout={handleLogout}
    />
  );
  return null;
}
