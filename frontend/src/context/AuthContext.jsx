import React from 'react';
import api from '../services/api';

export const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        // Try to read user from localStorage (set on login)
        const stored = localStorage.getItem('user');
        if (stored) {
          try { 
            setUser(JSON.parse(stored));
            setLoading(false);
            return;
          }
          catch (err) { console.error('Failed to parse stored user:', err); }
        }

        // Fallback: decode JWT token from localStorage and fetch full profile
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const parts = token.split('.');
            if (parts.length === 3) {
              const decoded = JSON.parse(atob(parts[1]));
              // If we have an id, request full user profile so team and name are available
              if (decoded.id) {
                try {
                  const res = await api.get(`/users/${decoded.id}`);
                  setUser(res.data);
                  try { localStorage.setItem('user', JSON.stringify(res.data)); } catch (e) {}
                } catch (err) {
                  console.error('Failed to fetch user profile:', err);
                  // fallback to minimal info from token
                  setUser({ id: decoded.id, role: decoded.role });
                }
              } else {
                setUser({ id: decoded.id, role: decoded.role });
              }
            }
          } catch (err) {
            console.error('Failed to decode token:', err);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const handler = () => {
      const s = localStorage.getItem('user');
      if (s) {
        try { setUser(JSON.parse(s)); } 
        catch (e) { setUser(null); }
      } else setUser(null);
    };
    window.addEventListener('authChanged', handler);
    return () => window.removeEventListener('authChanged', handler);
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
