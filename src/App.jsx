import { useState, useEffect } from "react";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { UserDashboard } from "./pages/UserDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { useAuth } from "./contexts/AuthContext";

export default function App() {
  const { user, logout } = useAuth();

  const [page, setPage] = useState("landing");
  const [authMode, setAuthMode] = useState("login");

  // Auto-route based on auth state
  useEffect(() => {
    if (user) {
      if (user.role === "admin") setPage("admin");
      else setPage("user");
    } else {
      // Only go to landing if we were on a protected page
      if (page === "admin" || page === "user") setPage("landing");
    }
  }, [user]);

  const handleEnter = (mode) => {
    setAuthMode(mode);
    setPage("auth");
  };

  // ─── Routing & Authorization Guards ────────────────────────────────────

  if (page === "auth")
    return (
      <AuthPage
        mode={authMode}
        onSwitch={() => setAuthMode((m) => (m === "login" ? "signup" : "login"))}
      />
    );

  if (page === "admin") {
    if (!user || user.role !== "admin") {
      return (
        <div className="auth-guard-page">
          <div className="auth-guard-icon">🔒</div>
          <h1>403 — Forbidden</h1>
          <p>You do not have administrative privileges to view this page.</p>
          <button className="auth-guard-btn" onClick={() => setPage(user ? "user" : "landing")}>
            Go Back
          </button>
        </div>
      );
    }
    return <AdminDashboard />;
  }

  if (page === "user") {
    if (!user) {
      return (
        <div className="auth-guard-page">
          <div className="auth-guard-icon">🔐</div>
          <h1>401 — Unauthorized</h1>
          <p>Please log in to view your dashboard.</p>
          <button className="auth-guard-btn" onClick={() => setPage("landing")}>
            Go to Login
          </button>
        </div>
      );
    }
    return <UserDashboard />;
  }

  return <LandingPage onEnter={handleEnter} />;
}
