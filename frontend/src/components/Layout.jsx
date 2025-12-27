import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logout } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }){
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const location = useLocation();

  // Role-based navigation
  let navItems = [];
  if (user?.role === 'user' || user?.role === 'employee') {
    navItems = [
      { label: 'My Requests', icon: '📋', href: '/my-requests' },
      { label: 'Create Request', icon: '➕', href: '/user-create-request' }
    ];
  } else if (user?.role === 'technician') {
    navItems = [
      { label: 'My Tasks', icon: '⚙️', href: '/kanban' },
      { label: 'Requests', icon: '📋', href: '/requests' }
    ];
  } else if (user?.role === 'manager') {
    navItems = [
      { label: 'Calendar', icon: '📅', href: '/manager-calendar' },
      { label: 'Schedule', icon: '📝', href: '/manager-create-preventive' }
    ];
  } else {
    // Admin/default
    navItems = [
      { label: 'Dashboard', icon: '📊', href: '/' },
      { label: 'Equipment', icon: '⚙️', href: '/equipment' },
      { label: 'Requests', icon: '📋', href: '/requests' },
      { label: 'Kanban', icon: '📈', href: '/kanban' },
      { label: 'Calendar', icon: '📅', href: '/calendar' }
    ];
  }

  const layoutStyle = {
    display: 'flex',
    height: '100vh',
    background: '#f8f9fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const sidebarStyle = {
    width: sidebarOpen ? '280px' : '70px',
    background: '#1a1a2e',
    color: '#fff',
    transition: 'width 0.3s ease',
    boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };

  const logoStyle = {
    padding: '24px 16px',
    fontSize: '24px',
    fontWeight: 700,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    whiteSpace: 'nowrap'
  };

  const navStyle = {
    flex: 1,
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const navItemStyle = (href) => ({
    padding: '12px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#b0b0b0',
    transition: 'all 0.2s',
    borderLeft: location.pathname === href ? '4px solid #00d4ff' : '4px solid transparent',
    background: location.pathname === href ? 'rgba(0,212,255,0.1)' : 'transparent'
  });

  const mainStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  const headerStyle = {
    background: '#fff',
    borderBottom: '1px solid #e0e0e0',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  };

  const searchStyle = {
    flex: '0 1 300px',
    padding: '10px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px'
  };

  const profileStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const contentStyle = {
    flex: 1,
    overflow: 'auto',
    padding: '32px'
  };

  return (
    <div style={layoutStyle}>
      <div style={sidebarStyle}>
        <div style={logoStyle}>
          {sidebarOpen ? '🔧 GearGuard' : '🔧'}
        </div>
        <div style={navStyle}>
          {localStorage.getItem('token') && !loading ? (
            navItems.map((item, idx) => (
              <Link key={idx} to={item.href} style={{textDecoration:'none'}}>
                <div style={navItemStyle(item.href)}>
                  <span style={{fontSize:'20px'}}>{item.icon}</span>
                  {sidebarOpen && <span>{item.label}</span>}
                </div>
              </Link>
            ))
          ) : loading ? (
            <div style={{padding:'16px',color:'#9aa0a6',fontSize:14}}>Loading...</div>
          ) : (
            <div style={{padding:'16px',color:'#9aa0a6',fontSize:14}}>Please login to access navigation</div>
          )}
        </div>
        <div style={{padding:'16px',borderTop:'1px solid rgba(255,255,255,0.1)',textAlign:'center'}}>
          <button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{background:'none',border:'none',color:'#b0b0b0',cursor:'pointer',fontSize:'16px'}}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
      </div>

      <div style={mainStyle}>
        <div style={headerStyle}>
          <input type="text" placeholder="Search equipment, requests..." style={searchStyle} />
          <div style={profileStyle}>
            {localStorage.getItem('token') ? (
              <>
                <span style={{fontSize:13,color:'#666'}}>
                  👤 {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                </span>
                <button onClick={()=>{ logout(); navigate('/login'); }} style={{background:'#ff6b6b',color:'#fff',border:'none',padding:'8px 16px',borderRadius:'6px',cursor:'pointer'}}>Logout</button>
              </>
            ) : (
              <>
                <button onClick={()=>navigate('/login')} style={{background:'#0077ff',color:'#fff',border:'none',padding:'8px 16px',borderRadius:'6px',cursor:'pointer',marginRight:8}}>Login</button>
                <button onClick={()=>navigate('/register')} style={{background:'#22c55e',color:'#fff',border:'none',padding:'8px 16px',borderRadius:'6px',cursor:'pointer'}}>Register</button>
              </>
            )}
          </div>
        </div>

        <div style={contentStyle}>
          {children}
        </div>
      </div>
    </div>
  );
}
