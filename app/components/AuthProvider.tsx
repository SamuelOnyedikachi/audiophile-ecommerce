'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  name: string;
  email: string;
  role: 'client' | 'admin';
};

type AuthContextType = {
  user: User | null;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'ae_users';
const CURRENT_USER = 'ae_user';

function readUsers(): Array<{
  name: string;
  email: string;
  password: string;
  role: string;
}> {
  try {
    const raw = localStorage.getItem(USERS_KEY) || '[]';
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(CURRENT_USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const router = useRouter();

  const persistUser = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(CURRENT_USER, JSON.stringify(u));
    else localStorage.removeItem(CURRENT_USER);
  };

  const signup = async ({
    name,
    email,
    password,
    role = 'client',
  }: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    // Simple demo signup stored in localStorage. DO NOT use in production.
    const users = readUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'User already exists' };
    }
    users.push({ name, email, password, role });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const newUser: User = {
      name,
      email,
      role: role === 'admin' ? 'admin' : 'client',
    };
    persistUser(newUser);
    return { success: true };
  };

  const login = async (email: string, password: string) => {
    const users = readUsers();
    const match = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!match) return { success: false, message: 'Invalid credentials' };
    const u: User = {
      name: match.name,
      email: match.email,
      role: match.role === 'admin' ? 'admin' : 'client',
    };
    persistUser(u);
    return { success: true };
  };

  const logout = () => {
    persistUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthProvider;
