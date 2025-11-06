import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Apply theme to document
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const themes = {
    light: {
      primary: '#007bff',
      secondary: '#6c757d',
      success: '#28a745',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#333333',
      textMuted: '#6c757d',
      border: '#e9ecef',
      shadow: 'rgba(0, 0, 0, 0.1)'
    },
    dark: {
      primary: '#0d6efd',
      secondary: '#6c757d',
      success: '#198754',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#0dcaf0',
      background: '#1a1a1a',
      surface: '#2d2d2d',
      text: '#ffffff',
      textMuted: '#adb5bd',
      border: '#404040',
      shadow: 'rgba(0, 0, 0, 0.3)'
    }
  };

  const currentTheme = isDarkMode ? themes.dark : themes.light;

  const value = {
    isDarkMode,
    toggleTheme,
    theme: currentTheme,
    themes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};