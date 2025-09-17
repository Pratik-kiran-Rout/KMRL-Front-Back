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
    
    try {
      console.log('Attempting login with:', email);
      // Real API call to backend
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('Login response status:', response.status);
      
      if (response.ok) {
        const { access_token } = await response.json();
        console.log('Got access token');
        
        // Get user profile with token
        const profileResponse = await fetch('http://localhost:8000/api/v1/auth/profile', {
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        });
        
        if (profileResponse.ok) {
          const userData = await profileResponse.json();
          console.log('Got user data:', userData);
          setUser({
            id: userData.id.toString(),
            name: userData.name,
            email: userData.email,
            role: userData.role,
            department: userData.department
          });
          localStorage.setItem('dochub-user', JSON.stringify(userData));
          localStorage.setItem('dochub-token', access_token);
          setIsLoading(false);
          return true;
        } else {
          console.error('Profile fetch failed:', profileResponse.status);
        }
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
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