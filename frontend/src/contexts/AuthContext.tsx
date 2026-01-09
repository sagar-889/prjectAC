import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, setAuthToken, clearAuthToken } from "@/lib/api";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  mobile_number: string | null;
  avatar_url: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string, mobileNumber?: string) => Promise<{ user: User | null; error: Error | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');

      // Only check auth if token exists
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await api.getMe();
        setUser(userData);
      } catch (error) {
        // Token is invalid or expired
        clearAuthToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { user: userData, token } = await api.signIn(email, password);
      setAuthToken(token);
      setUser(userData);
      return { user: userData, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string, mobileNumber?: string) => {
    try {
      const { user: userData, token } = await api.signUp(email, password, fullName, mobileNumber);
      setAuthToken(token);
      setUser(userData);
      return { user: userData, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  };

  const signOut = async () => {
    clearAuthToken();
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
