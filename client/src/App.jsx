import React, { useContext } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Import all the page components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HoodsPage from './pages/HoodsPage';

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      {/* Main Navigation Bar */}
      <nav>
        <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
        
        {/* Conditional links based on login status */}
        {!user ? (
          <>
            <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/hoods" style={{ marginRight: '10px' }}>Hoods</Link>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </nav>
      
      <hr />

      {/* Main Routing Logic */}
      <Routes>
        {/* If user is logged in, '/' goes to HomePage, otherwise redirects to /login */}
        <Route 
          path="/" 
          element={user ? <HomePage /> : <Navigate to="/login" />} 
        />
        
        {/* If user is logged in, they can access the /hoods page */}
        <Route 
          path="/hoods" 
          element={user ? <HoodsPage /> : <Navigate to="/login" />} 
        />
        
        {/* If user is not logged in, they can access login/register pages */}
        <Route 
          path="/login" 
          element={!user ? <LoginPage /> : <Navigate to="/" />} 
        />
        <Route 
          path="/register" 
          element={!user ? <RegisterPage /> : <Navigate to="/" />} 
        />
      </Routes>
    </>
  );
}

export default App;