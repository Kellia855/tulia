import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  created_at: string;
  last_login?: string | null;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';
const envApiUrl = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_URL;
const API_BASE_URL = envApiUrl || 'http://localhost:8001/api';

const getStoredToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

const clearStoredSession = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

const storeSession = (authData: AuthResponse) => {
  localStorage.setItem(AUTH_TOKEN_KEY, authData.access_token);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(authData.user));
};

const parseApiError = async (response: Response) => {
  try {
    const data = await response.json();

    if (typeof data?.detail === 'string') {
      return data.detail;
    }

    if (Array.isArray(data?.detail)) {
      return data.detail
        .map((issue: { msg?: string }) => issue.msg)
        .filter(Boolean)
        .join(' ');
    }
  } catch {
    return null;
  }

  return null;
};

const apiRequest = async <T,>(path: string, options: RequestInit = {}, token?: string): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error('Unable to reach the server. Make sure the backend is running.');
  }

  if (!response.ok) {
    const apiMessage = await parseApiError(response);
    throw new Error(apiMessage || 'Something went wrong. Please try again.');
  }

  return response.json() as Promise<T>;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getStoredToken();
      if (token) {
        try {
          const currentUser = await apiRequest<User>('/auth/me', { method: 'GET' }, token);
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(currentUser));
          setUser(currentUser);
        } catch {
          clearStoredSession();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const authData = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    storeSession(authData);
    setUser(authData.user);
  };

  const register = async (username: string, password: string) => {
    const authData = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    storeSession(authData);
    setUser(authData.user);
  };

  const logout = () => {
    clearStoredSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
