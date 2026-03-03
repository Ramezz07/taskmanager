import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  nav: {
    background: '#fff',
    borderBottom: '1px solid #e2e8f0',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '60px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  logo: {
    fontWeight: '700',
    fontSize: '1.2rem',
    color: '#6366f1',
    letterSpacing: '-0.02em',
  },
  links: { display: 'flex', gap: '4px', alignItems: 'center' },
  link: (active) => ({
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: active ? '#6366f1' : '#64748b',
    background: active ? '#eef2ff' : 'transparent',
    transition: 'all 0.15s',
    textDecoration: 'none',
  }),
  right: { display: 'flex', alignItems: 'center', gap: '12px' },
  user: { fontSize: '0.85rem', color: '#64748b', fontWeight: '500' },
  logoutBtn: {
    background: 'none',
    border: '1px solid #e2e8f0',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    color: '#ef4444',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <span style={styles.logo}>✅ TaskManager</span>
      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link(location.pathname === '/dashboard')}>Dashboard</Link>
        <Link to="/tasks" style={styles.link(location.pathname === '/tasks')}>My Tasks</Link>
      </div>
      <div style={styles.right}>
        <span style={styles.user}>👤 {user?.name}</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
