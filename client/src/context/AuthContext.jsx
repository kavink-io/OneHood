import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken.user);
      } catch (error) {
        console.error("Invalid or expired token", error);
        logout();
      }
    }
  }, [token]);

  const login = async (formData) => {
    try {
      const response = await axios.post('/api/auth/login', formData); // Using relative path
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      const decodedToken = jwtDecode(token);
      setUser(decodedToken.user);
      setToken(token);
      
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // The new function to update the user object in the global state
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
  };

  // Provide the new updateUser function to the rest of the app
  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };