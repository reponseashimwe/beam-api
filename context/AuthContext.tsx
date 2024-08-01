// context/AuthContext.tsx
"use client"; // Ensures this component runs in the client

import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/axiosInstance";
import {
  User,
  UserBooking,
  UserVerification,
  Verification,
} from "@prisma/client";
import { toast } from "react-toastify";

interface UserType extends User {
  bookings: UserBooking[];
  events: Event[];
  verifications: UserVerification[];
}

interface AuthContextType {
  user: UserType | null;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: (redirectOnFalse: boolean, redirectIfNotAdmin?: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const router = useRouter();

  const fetchUser = async (
    redirectOnFalse: boolean,
    redirectIfNotAdmin: boolean = false
  ) => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      try {
        const response = await apiClient.get("/auth/me");
        if (redirectIfNotAdmin && !response.data.isAdmin) {
          router.push("/events");
        }
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
        if (redirectOnFalse) router.push("/sign-in");
      }
    } else {
      if (redirectOnFalse) router.push("/sign-in");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await apiClient.post("/auth/sign-up", { name, email, password });
      toast.success("Successfully registered! Pleave verify your email");

      // Redirect or handle successful registration
      router.push("/verify-email");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/auth/sign-in", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      toast.success("Login successful! Redirecting...");
      router.push("/dashboard");
    } catch (error: any) {
      if (error.response.status == 403) {
        router.push("/verify-email");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, fetchUser }}>
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
