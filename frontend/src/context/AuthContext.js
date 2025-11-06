import React, { createContext, useContext, useReducer } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: false,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_SUCCESS':
      localStorage.setItem('user', JSON.stringify(action.payload));
      return { ...state, user: action.payload, loading: false, error: null };
    case 'AUTH_FAIL':
      return { ...state, user: null, loading: false, error: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('user');
      return { ...state, user: null, loading: false, error: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const readUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('users')) || [];
  } catch (e) {
    return [];
  }
};

const writeUsers = (users) => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Dummy register: stores user in localStorage users list and sets current user
  const register = async (name, email, password) => {
    try {
      const users = readUsers();
      const existing = users.find(u => u.email === email);
      if (!existing) {
        const user = {
          id: Date.now().toString(),
          name: name || email.split('@')[0],
          email,
          password: password || '',
          picture: null
        };
        users.push(user);
        writeUsers(users);
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
        toast.success('Registered and logged in (dummy account)');
        return { success: true, user };
      }
      // If already exists, just log in
      dispatch({ type: 'AUTH_SUCCESS', payload: existing });
      toast.info('Account exists — logged in (dummy)');
      return { success: true, user: existing };
    } catch (err) {
      dispatch({ type: 'AUTH_FAIL', payload: 'Registration failed' });
      toast.error('Registration failed');
      return { success: false, message: 'Registration failed' };
    }
  };

  // Dummy login: finds or creates a dummy user and stores in localStorage
  const login = async (email, password) => {
    try {
      const users = readUsers();
      let user = users.find(u => u.email === email);
      if (!user) {
        // auto-create dummy user for convenience
        user = {
          id: Date.now().toString(),
          name: email.split('@')[0],
          email,
          password: password || '',
          picture: null
        };
        users.push(user);
        writeUsers(users);
        toast.info('Dummy account created and logged in');
      }
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
      return { success: true, user };
    } catch (err) {
      dispatch({ type: 'AUTH_FAIL', payload: 'Login failed' });
      toast.error('Login failed');
      return { success: false, message: 'Login failed' };
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out');
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  const value = {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!state.user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};