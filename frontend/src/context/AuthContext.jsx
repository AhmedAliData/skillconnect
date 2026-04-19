import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";

const AuthContext = createContext(null);
const API_BASE = "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("skillconnect_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("skillconnect_token") || null;
  });

  const [loading, setLoading] = useState(false);

  // keep localStorage + axios header in sync
  useEffect(() => {
    if (user) {
      localStorage.setItem("skillconnect_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("skillconnect_user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("skillconnect_token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("skillconnect_token");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });

      const { user, token } = res.data;
      setUser(user);
      setToken(token);

      // IMPORTANT: return user so Login.jsx can see role
      return { ok: true, user };
    } catch (err) {
      console.error(err);
      return {
        ok: false,
        message:
          err.response?.data?.message || "Login failed. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, payload);
      const { user, token } = res.data;
      setUser(user);
      setToken(token);
      return { ok: true, user };
    } catch (err) {
      console.error(err);
      return {
        ok: false,
        message:
          err.response?.data?.message || "Registration failed. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = { user, token, loading, login, register, logout };
  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
