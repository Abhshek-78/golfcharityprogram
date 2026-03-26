import { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_USERS } from "../data/constants";

const AuthContext = createContext();

// ─── Admin credentials ───────────────────────────────────────────────────────
const ADMIN_EMAIL = "admin@drawgolf.com";
const ADMIN_PASSWORD = "Admin@123";

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [allUsers, setAllUsers] = useState(() => {
    const saved = localStorage.getItem("drawgolf_users");
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("drawgolf_session");
    return saved ? JSON.parse(saved) : null;
  });

  // Persist users DB to localStorage
  useEffect(() => {
    localStorage.setItem("drawgolf_users", JSON.stringify(allUsers));
  }, [allUsers]);

  // Persist session to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("drawgolf_session", JSON.stringify(user));
    } else {
      localStorage.removeItem("drawgolf_session");
    }
  }, [user]);

  // ─── Validation helpers ──────────────────────────────────────────────────

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address";
    return null;
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(password)) return "Must contain at least one uppercase letter";
    if (!/[0-9]/.test(password)) return "Must contain at least one number";
    return null;
  };

  const validateName = (name) => {
    if (!name || !name.trim()) return "Full name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return null;
  };

  // ─── Login ───────────────────────────────────────────────────────────────

  const login = (email, password) => {
    const emailErr = validateEmail(email);
    if (emailErr) return { success: false, error: emailErr };

    if (!password) return { success: false, error: "Password is required" };

    // Admin login
    if (email === ADMIN_EMAIL) {
      if (password !== ADMIN_PASSWORD) {
        return { success: false, error: "Invalid admin password" };
      }
      const adminUser = { role: "admin", name: "Admin", email };
      setUser(adminUser);
      return { success: true, user: adminUser };
    }

    // Regular user login
    const found = allUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      setUser(found);
      return { success: true, user: found };
    }
    return { success: false, error: "Invalid email or password" };
  };

  // ─── Register ────────────────────────────────────────────────────────────

  const register = (userData) => {
    const nameErr = validateName(userData.name);
    if (nameErr) return { success: false, error: nameErr };

    const emailErr = validateEmail(userData.email);
    if (emailErr) return { success: false, error: emailErr };

    const pwErr = validatePassword(userData.password);
    if (pwErr) return { success: false, error: pwErr };

    if (userData.email === ADMIN_EMAIL) {
      return { success: false, error: "Cannot register with this email" };
    }

    const exists = allUsers.find((u) => u.email === userData.email);
    if (exists) {
      return { success: false, error: "Account with this email already exists" };
    }

    const newUser = {
      ...userData,
      id: Date.now(),
      active: true,
      scores: [],
      joined: new Date().toISOString().split("T")[0],
    };

    setAllUsers((us) => [...us, newUser]);
    setUser(newUser);
    return { success: true, user: newUser };
  };

  // ─── Logout ──────────────────────────────────────────────────────────────

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    setUser,
    allUsers,
    setAllUsers,
    login,
    register,
    logout,
    validateEmail,
    validatePassword,
    validateName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
