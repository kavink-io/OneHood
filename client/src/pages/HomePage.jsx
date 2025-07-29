import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  // We can get the user's name from our context later
  const { user } = useContext(AuthContext);

  return (
    <div>
      {/* We use a placeholder name for now, but `user` is available */}
      <h2>Welcome back, {user?.name || 'User'}!</h2>
      <p>This is your authenticated home page.</p>
    </div>
  );
};

export default HomePage; // <-- This is the missing line