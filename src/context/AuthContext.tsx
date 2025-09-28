import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { tokenService } from '../api/tokenService';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  user: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedToken = tokenService.getToken();
    if (savedToken && tokenService.isAuthenticated()) {
      setToken(savedToken);
      setIsAuthenticated(true);
      const payload = tokenService.getTokenPayload();
      setUser(payload);
    }
  }, []);

  const login = (newToken: string) => {
    tokenService.setToken(newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    const payload = tokenService.getTokenPayload();
    setUser(payload);
  };

  const logout = () => {
    tokenService.removeToken();
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout, user }}>
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