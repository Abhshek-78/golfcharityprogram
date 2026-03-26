import { useState } from "react";
import { C, CHARITIES } from "../data/constants";
import { Card } from "../components/Card";
import { useAuth } from "../contexts/AuthContext";

export function AuthPage({ mode, onSwitch }) {
  const { login, register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    plan: "monthly",
    charity: 1,
    charityPct: 10,
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    // Clear field error on edit
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setGeneralError("");
  };

  // ─── Client-side validation ─────────────────────────────────────────────
  const validate = () => {
    const errs = {};

    if (mode === "signup") {
      if (!form.name.trim()) errs.name = "Full name is required";
      else if (form.name.trim().length < 2) errs.name = "Name must be at least 2 characters";
    }

    if (!form.email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address";

    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    else if (mode === "signup" && !/[A-Z]/.test(form.password))
      errs.password = "Must contain at least one uppercase letter";
    else if (mode === "signup" && !/[0-9]/.test(form.password))
      errs.password = "Must contain at least one number";

    if (mode === "signup") {
      if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password";
      else if (form.password !== form.confirmPassword)
        errs.confirmPassword = "Passwords do not match";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ─── Submit handler ─────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e?.preventDefault();
    setGeneralError("");

    if (!validate()) return;

    setLoading(true);
    // Simulate network delay for a polished feel
    setTimeout(() => {
      let res;

      if (mode === "login") {
        res = login(form.email, form.password);
      } else {
        res = register({
          name: form.name.trim(),
          email: form.email,
          password: form.password,
          plan: form.plan,
          charity: parseInt(form.charity),
          charityPct: parseInt(form.charityPct),
          role: "user",
        });
      }

      if (!res.success) {
        setGeneralError(res.error);
      }
      setLoading(false);
    }, 400);
  };

  // ─── Password strength meter ────────────────────────────────────────────
  const getPasswordStrength = () => {
    const p = form.password;
    if (!p) return { level: 0, label: "", color: "transparent" };
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;

    if (score <= 2) return { level: score, label: "Weak", color: C.danger };
    if (score <= 3) return { level: score, label: "Fair", color: C.gold };
    return { level: score, label: "Strong", color: C.accent };
  };

  const strength = getPasswordStrength();

  const renderInput = (label, key, type = "text", placeholder = "") => (
    <div style={{ marginBottom: 16 }}>
      <label className="auth-label">{label}</label>
      <div style={{ position: "relative" }}>
        <input
          className={`auth-input ${errors[key] ? "auth-input-error" : ""}`}
          type={key === "password" || key === "confirmPassword" ? (showPassword ? "text" : "password") : type}
          value={form[key]}
          onChange={updateField(key)}
          placeholder={placeholder}
          autoComplete={key === "password" ? "current-password" : key === "confirmPassword" ? "new-password" : key === "email" ? "email" : ""}
        />
        {(key === "password" || key === "confirmPassword") && form[key] && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", color: "var(--c-text-muted)",
              cursor: "pointer", fontSize: 14, padding: 0,
            }}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        )}
      </div>
      {errors[key] && (
        <div style={{ color: C.danger, fontSize: 12, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
          ⚠ {errors[key]}
        </div>
      )}
      {key === "password" && form.password && mode === "signup" && (
        <div style={{ marginTop: 6 }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: i <= strength.level ? strength.color : "var(--c-dark-border)",
                transition: "background 0.3s",
              }} />
            ))}
          </div>
          <span style={{ fontSize: 11, color: strength.color, fontWeight: 600 }}>
            {strength.label}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: "var(--c-lime)", letterSpacing: "-0.03em" }}>
            DrawGolf
          </div>
          <p style={{ color: "var(--c-text-muted)", fontSize: 15, marginTop: 4 }}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            {/* General error banner */}
            {generalError && (
              <div style={{
                background: `${C.danger}15`, border: `1px solid ${C.danger}44`, borderRadius: 10,
                padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 18 }}>🚫</span>
                <span style={{ color: C.danger, fontSize: 13, fontWeight: 600 }}>{generalError}</span>
              </div>
            )}

            {mode === "signup" && renderInput("Full Name", "name", "text", "Your full name")}
            {renderInput("Email", "email", "email", "you@example.com")}
            {renderInput("Password", "password", "password", "••••••••")}
            {mode === "signup" && renderInput("Confirm Password", "confirmPassword", "password", "••••••••")}

            {mode === "signup" && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <label className="auth-label">Subscription Plan</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {["monthly", "yearly"].map((p) => (
                      <div
                        key={p}
                        onClick={() => setForm((f) => ({ ...f, plan: p }))}
                        style={{
                          background: form.plan === p ? `${C.lime}18` : "var(--c-dark-mid)",
                          border: `1px solid ${form.plan === p ? "var(--c-lime)" : "var(--c-dark-border)"}`,
                          borderRadius: 10, padding: "12px", cursor: "pointer", textAlign: "center",
                          transition: "all 0.2s",
                        }}
                      >
                        <div style={{ fontWeight: 700, color: form.plan === p ? "var(--c-lime)" : "var(--c-text)", textTransform: "capitalize" }}>
                          {p}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--c-text-muted)" }}>
                          {p === "monthly" ? "₹9.99/mo" : "₹89.99/yr · save 25%"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label className="auth-label">Choose Your Charity</label>
                  <select
                    value={form.charity}
                    onChange={updateField("charity")}
                    style={{
                      width: "100%", background: "var(--c-dark-mid)",
                      border: "1px solid var(--c-dark-border)", borderRadius: 10,
                      padding: "10px 14px", color: "var(--c-text)", fontSize: 15,
                    }}
                  >
                    {CHARITIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.img} {c.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{
                    display: "flex", justifyContent: "space-between", fontSize: 12,
                    color: "var(--c-text-muted)", marginBottom: 6, textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}>
                    <span>Charity Contribution</span>
                    <span style={{ color: "var(--c-accent)" }}>{form.charityPct}%</span>
                  </label>
                  <input
                    type="range" min={10} max={30} value={form.charityPct}
                    onChange={updateField("charityPct")}
                    style={{ width: "100%", accentColor: "var(--c-lime)" }}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1, position: "relative" }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span className="auth-spinner" />
                  {mode === "login" ? "Signing In..." : "Creating Account..."}
                </span>
              ) : (
                mode === "login" ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "var(--c-text-muted)" }}>
            {mode === "login" ? "No account? " : "Have an account? "}
            <span
              onClick={onSwitch}
              style={{ color: "var(--c-lime)", cursor: "pointer", fontWeight: 600 }}
            >
              {mode === "login" ? "Sign up free" : "Sign in"}
            </span>
          </p>

          {mode === "login" && (
            <div style={{
              marginTop: 12, padding: "10px 14px",
              background: `${C.purple}10`, border: `1px solid ${C.purple}33`,
              borderRadius: 10, textAlign: "center",
            }}>
              <div style={{ fontSize: 11, color: "var(--c-text-muted)", marginBottom: 4 }}>
                Admin access
              </div>
              <div style={{ fontSize: 12, color: "var(--c-purple)", fontWeight: 600 }}>
                admin@drawgolf.com · Admin@123
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
