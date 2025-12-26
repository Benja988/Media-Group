"use client";
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
};

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (u: User | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔹 Compute isAuthenticated based on user
  const isAuthenticated = useMemo(() => !!user, [user]);

  // 🔹 Fetch logged in user on app load
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          setUser(null);
        } else {
          const data = await res.json();
          setUser(data.data);
        }
      } catch (err) {
        console.error("❌ Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  // 🔹 Login
  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    setUser(data.data);
    // isAuthenticated updates automatically due to useMemo
    window.location.href = ROUTES.HOME;
  };

  // 🔹 Register
  const register = async (name: string, email: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");

    router.push(ROUTES.LOGIN);
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      setUser(null);
      window.location.href = ROUTES.HOME;
    } catch (err) {
      console.error("❌ Error logging out:", err);
      setUser(null);
      window.location.href = ROUTES.HOME;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, login, register, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
