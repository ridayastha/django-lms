"use client";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";


import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  bio: string | null;
  profile_picture: string | null;
  phone_number: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
  async function loadUser() {
    const token = localStorage.getItem("access");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("me/");

      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Unable to load user", error);

      logout();
    } finally {
      setLoading(false);
    }
  }

  loadUser();
}, []);

  function login(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  }

  async function logout() {
  try {
    const refresh = localStorage.getItem("refresh");

    if (refresh) {
      await api.post("logout/", {
        refresh,
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    setUser(null);

    router.replace("/login");
  }
}

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}