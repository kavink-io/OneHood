import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
const AuthProvider = ({ children }) => {
  // State to hold the authenticated user object
  const [user, setUser] = useState(null);
  // State to hold the JWT, initialized from localStorage for session persistence
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // This effect runs when the component mounts or when the token changes.
  // Its job is to keep the user state in sync with the token in localStorage.
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // The payload from our backend JWT includes a 'user' object
        setUser(decodedToken.user);
      } catch (error) {
        console.error("Invalid or expired token", error);
        // If token is invalid, clear it
        logout();
      }
    }
  }, [token]);

  // Function to handle user login
  const login = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token } = response.data;
      
      // Store the token in localStorage
      localStorage.setItem('token', token);
      
      // Decode the token to get user info
      const decodedToken = jwtDecode(token);
      
      // Update state
      setUser(decodedToken.user);
      setToken(token);
      
      return true; // Indicate login success
    } catch (error) {
      console.error("Login failed:", error);
      return false; // Indicate login failure
    }
  };

  // Function to handle user logout
  const logout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    // Clear the state
    setToken(null);
    setUser(null);
  };

  // Provide the user, token, and auth functions to the rest of the app
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };