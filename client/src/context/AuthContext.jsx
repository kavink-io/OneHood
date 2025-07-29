import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      // If we have a token, we should verify it with the backend
      // For now, we'll just assume it's valid if it exists.
      // A full implementation would decode the token to get user info.
      setUser({ name: 'User' }); // Placeholder user
    }
  }, [token]);

  const login = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser({ name: 'User' }); // Update user state
      return true; // Indicate success
    } catch (error) {
      console.error("Login failed:", error);
      return false; // Indicate failure
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };