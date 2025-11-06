import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, User, CheckSquare, Moon, Sun } from 'lucide-react';
import NotificationPanel from './NotificationPanel';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <header style={{
      background: isDarkMode 
        ? 'rgba(45, 45, 45, 0.95)' 
        : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      boxShadow: isDarkMode 
        ? '0 4px 20px rgba(0,0,0,0.3)' 
        : '0 4px 20px rgba(0,0,0,0.1)',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      border: isDarkMode 
        ? '1px solid rgba(64, 64, 64, 0.5)' 
        : '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'all 0.3s ease'
    }}>
      <div className="container d-flex justify-content-between align-items-center">
        <Link 
          to="/" 
          style={{
            textDecoration: 'none',
            color: '#007bff',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <CheckSquare size={28} />
          Task Manager
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="btn btn-sm"
            style={{
              background: 'none',
              border: `1px solid ${isDarkMode ? '#555' : '#e2e8f0'}`,
              color: isDarkMode ? '#ffffff' : '#666666',
              padding: '8px',
              borderRadius: '6px',
              transition: 'all 0.2s ease'
            }}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Notification Panel */}
          {isAuthenticated && <NotificationPanel />}

          {isAuthenticated ? (
            <>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                color: isDarkMode ? '#e2e8f0' : '#666'
              }}>
                <User size={18} />
                <span>Welcome, {user?.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem' 
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              {location.pathname !== '/login' && (
                <Link to="/login" className="btn btn-primary btn-sm">
                  Login
                </Link>
              )}
              {location.pathname !== '/register' && (
                <Link to="/register" className="btn btn-secondary btn-sm">
                  Register
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;