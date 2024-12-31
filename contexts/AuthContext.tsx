// contexts/AuthContext.tsx

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/authApi";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { setAuthCookie, getAuthCookie, removeAuthCookie } from "@/lib/cookieUtils"; // <--- import cookie helpers

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string, role: "user" | "agent") => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Check if we have a token in cookies
    const token = getAuthCookie();
    // If you want to restore user data from the server or from a separate cookie, do so here
    if (token) {
      setIsAuthenticated(true);
      // Optionally, fetch user info from the server or read from a separate user cookie
      // setUser(JSON.parse(userDataFromCookie));
    }
  }, []);

  const login = async (email: string, password: string, role: "user" | "agent"): Promise<boolean> => {
    try {
      // Adjust endpoint if needed
      const endpoint =
        role === "user"
          ? "http://localhost:4000/api/auth/login/user"
          : "/auth/login/agent";
      const response = await api.post(endpoint, { email, password });

      const { token, user: userInfo, agent: agentInfo } = response.data;
      // If user logs in, userInfo is returned
      // If agent logs in, agentInfo is returned
      // Adjust logic based on your actual response

      // Store token in cookie
      setAuthCookie(token);

      // Update state
      setIsAuthenticated(true);
      setUser(userInfo || agentInfo); // whichever object is returned

      return true;
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      return false;
    }
  };

  const logout = () => {
    // Remove cookie
    removeAuthCookie();
    // Clear state
    setIsAuthenticated(false);
    setUser(null);
    // Redirect to login
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
