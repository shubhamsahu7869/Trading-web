import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("finpulse_user") || "null"));
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2800);
  };

  const login = (payload) => {
    const nextUser = {
      id: String(Math.floor(10000000 + Math.random() * 900000000)),
      name: payload.name || "Maya Carter",
      email: payload.email,
      status: "Verified",
      joinDate: new Date().toLocaleDateString()
    };
    localStorage.setItem("finpulse_user", JSON.stringify(nextUser));
    setUser(nextUser);
    showToast("Welcome to FinPulse");
  };

  const logout = () => {
    localStorage.removeItem("finpulse_user");
    setUser(null);
    showToast("Signed out");
  };

  const value = useMemo(() => ({ user, login, logout, showToast, toast }), [user, toast]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
