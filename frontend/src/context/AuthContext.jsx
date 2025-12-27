import React from 'react';

export const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // Try to read user from localStorage (set on login)
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); }
      catch (err) { console.error('Failed to parse stored user:', err); }
      return;
    }

    // Fallback: decode JWT token from localStorage and extract user role/info
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const decoded = JSON.parse(atob(parts[1]));
          // Store role and id from token
          setUser({ id: decoded.id, role: decoded.role });
        }
      } catch (err) {
        console.error('Failed to decode token:', err);
      }
    }
    const handler = () => {
      const s = localStorage.getItem('user');
      if (s) setUser(JSON.parse(s)); else setUser(null);
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
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
