import './Navbar.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

function Navbar() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand"><h2>OneHood</h2></Link>
      <div className="navbar-links">
        <Link to="/">Feed</Link>
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/calendar">Calendar</Link>
        {isAdmin && <Link to="/users">Members</Link>}
        
        {user ? (
          <>
            <ThemeToggle />
            <span>
              Welcome, {user.name}!
              {isAdmin && <span className="admin-badge">Admin</span>}
            </span>
            <button onClick={logout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <ThemeToggle />
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;