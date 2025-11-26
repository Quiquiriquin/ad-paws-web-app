/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_DATA_KEY } from "@/lib/auth";
import { apolloClient } from "@/lib/api/apolloClient";
import { USER_QUERY } from "@/lib/api/user.api";

// Types
export interface User {
  id?: string;
  email?: string;
  name?: string;
  // Add more user properties as needed
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokens: AuthTokens, userData?: User) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
  refetchUser: () => Promise<void>;
}

// Create Context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Provider Props
interface AuthProviderProps {
  children: React.ReactNode;
}

// Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data from API
  const fetchUserData = useCallback(async () => {
    try {
      const { data } = await apolloClient.query<{
        user: { id: string; email: string; name: string };
      }>({
        query: USER_QUERY,
        fetchPolicy: "network-only", // Always fetch fresh data
      });

      if (data?.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
        };

        // Update state and localStorage
        setUser(userData);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));

        return userData;
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      // If fetch fails (e.g., token expired), clear auth data
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      setUser(null);
      throw error;
    }
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

        if (accessToken && refreshToken) {
          // Fetch user data from API
          await fetchUserData();
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        // Already handled in fetchUserData
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [fetchUserData]);

  // Login function
  const login = useCallback(
    async (tokens: AuthTokens, userData?: User) => {
      try {
        // Store tokens
        localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);

        // If user data is provided, use it
        if (userData) {
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
          setUser(userData);
        } else {
          // Otherwise, fetch user data from API
          await fetchUserData();
        }
      } catch (error) {
        console.error("Failed to save auth data:", error);
        // If fetching user data fails, clear tokens
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        throw error;
      }
    },
    [fetchUserData]
  );

  // Logout function
  const logout = useCallback(() => {
    // Clear storage
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);

    // Clear state
    setUser(null);
  }, []);

  // Update user function
  const updateUser = useCallback((userData: User) => {
    try {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  }, []);

  // Refetch user data (useful after profile updates)
  const refetchUser = useCallback(async () => {
    try {
      await fetchUserData();
    } catch (error) {
      console.error("Failed to refetch user data:", error);
    }
  }, [fetchUserData]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
    updateUser,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
