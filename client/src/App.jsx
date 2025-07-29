import React, { useContext } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';

// Import all the page components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HoodsPage from './pages/HoodsPage';
import NoticeboardPage from './pages/NoticeboardPage';
import CalendarPage from './pages/CalendarPage';
import MarketplacePage from './pages/MarketplacePage';
import PollsPage from './pages/PollsPage'; // Import the new Polls page

function App() {
  // Use both authentication and theme contexts
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <>
      {/* Main Navigation Bar */}
      <nav style={{ padding: '10px 20px', backgroundColor: 'var(--nav-background)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', transition: 'background-color 0.3s' }}>
        <div style={{ flexGrow: 1 }}>
          <Link to="/" style={{ marginRight: '15px', textDecoration: 'none', fontWeight: 'bold' }}>OneHood</Link>
          
          {/* Links for logged-in users */}
          {user && (
            <>
              <Link to="/hoods" style={{ marginRight: '15px', textDecoration: 'none' }}>Hoods</Link>
              <Link to="/noticeboard" style={{ marginRight: '15px', textDecoration: 'none' }}>Noticeboard</Link>
              <Link to="/calendar" style={{ marginRight: '15px', textDecoration: 'none' }}>Calendar</Link>
              <Link to="/marketplace" style={{ marginRight: '15px', textDecoration: 'none' }}>Marketplace</Link>
              <Link to="/polls" style={{ marginRight: '15px', textDecoration: 'none' }}>Polls</Link>
            </>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Theme Toggle Button */}
          <button onClick={toggleTheme} style={{ marginRight: '15px' }}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>

          {/* Conditional links for login/logout */}
          {!user ? (
            <>
              <Link to="/login" style={{ marginRight: '15px', textDecoration: 'none' }}>Login</Link>
              <Link to="/register" style={{ textDecoration: 'none' }}>Register</Link>
            </>
          ) : (
            <button onClick={logout}>Logout</button>
          )}
        </div>
      </nav>
      
      <main style={{ padding: '20px' }}>
        {/* Main Routing Logic */}
        <Routes>
          {/* If user is logged in, '/' goes to HomePage, otherwise redirects to /login */}
          <Route 
            path="/" 
            element={user ? <HomePage /> : <Navigate to="/login" />} 
          />
          
          {/* Routes accessible only when logged in */}
          <Route path="/hoods" element={user ? <HoodsPage /> : <Navigate to="/login" />} />
          <Route path="/noticeboard" element={user ? <NoticeboardPage /> : <Navigate to="/login" />} />
          <Route path="/calendar" element={user ? <CalendarPage /> : <Navigate to="/login" />} />
          <Route path="/marketplace" element={user ? <MarketplacePage /> : <Navigate to="/login" />} />
          <Route path="/polls" element={user ? <PollsPage /> : <Navigate to="/login" />} />
          
          {/* Routes accessible only when logged OUT */}
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}

export default App;