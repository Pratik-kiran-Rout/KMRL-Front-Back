import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithApple: () => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('dochub-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, this would be an API call
    if (email === 'admin@kmrl.co.in' && password === 'admin123') {
      const userData = {
        id: '1',
        name: 'Rajesh Kumar',
        email: 'admin@kmrl.co.in',
        role: 'Chief Safety Officer',
        department: 'Operations & Safety'
      };
      setUser(userData);
      localStorage.setItem('dochub-user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate Google OAuth
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const userData = {
      id: '2',
      name: 'Google User',
      email: 'user@gmail.com',
      role: 'Operations Manager',
      department: 'Technical Services'
    };
    setUser(userData);
    localStorage.setItem('dochub-user', JSON.stringify(userData));
    setIsLoading(false);
    return true;
  };

  const loginWithApple = async (): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate Apple OAuth
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const userData = {
      id: '3',
      name: 'Apple User',
      email: 'user@icloud.com',
      role: 'Safety Inspector',
      department: 'Quality Assurance'
    };
    setUser(userData);
    localStorage.setItem('dochub-user', JSON.stringify(userData));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dochub-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, loginWithApple, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};