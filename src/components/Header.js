import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTheme, setTheme } from '../utils/storage';

const Header = ({ onAuthClick }) => {
  const { user, logout } = useAuth();
  const [theme, setThemeState] = React.useState(getTheme());

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setThemeState(newTheme);
  };

  return (
    <header style={{ 
      padding: '16px 32px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '32px' }}>🏆</span>
        <h1 style={{ fontSize: '24px', fontWeight: '700', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Sports Management
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={toggleTheme} className="btn btn-secondary" style={{ padding: '8px 16px' }}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {user ? (
          <>
            <span style={{ fontSize: '14px', opacity: '0.8' }}>
              {user.firstName} {user.lastName} <span className="badge badge-primary">{user.role}</span>
            </span>
            <button onClick={logout} className="btn btn-danger" style={{ padding: '8px 16px' }}>
              Logout
            </button>
          </>
        ) : (
          <button onClick={onAuthClick} className="btn btn-primary">
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
