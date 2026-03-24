import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import UserItem from './UserItem';
import './Users.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // New user state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newBlock, setNewBlock] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newIsAdmin, setNewIsAdmin] = useState(false);

  const { token, isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/all', {
        headers: {
          'x-auth-token': token
        }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      // We use the regular register endpoint but it won't set isAdmin.
      // For now, let's use the register endpoint and then if isAdmin is needed, 
      // we'd need a dedicated admin creation route or update it after.
      // BUT, since we have PUT /api/users/:id, we can create then update, 
      // OR better, let's assume the register route is enough for basic creation.
      // Actually, I'll just use the register endpoint for now as it handles hashing.
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newName, 
          email: newEmail, 
          password: newPassword, 
          blockNo: newBlock, 
          phone: newPhone 
        })
      });

      if (response.ok) {
        // Clear form and reload
        setIsCreating(false);
        setNewName(''); setNewEmail(''); setNewPassword(''); setNewBlock(''); setNewPhone('');
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.msg || 'Creation failed');
      }
    } catch (err) {
      alert('Error creating user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });
      if (response.ok) {
        setUsers(users.filter(u => u._id !== id));
      } else {
        const data = await response.json();
        alert(data.msg || 'Failed to delete user');
      }
    } catch (err) {
      alert('Error deleting user');
    }
  };

  const handleUpdateUser = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(updatedData)
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(u => u._id === id ? updatedUser : u));
      } else {
        const data = await response.json();
        alert(data.msg || 'Update failed');
      }
    } catch (err) {
      alert('Error updating user');
    }
  };

  if (!isAdmin) return <div className="users-container"><h1>Access Denied</h1></div>;
  if (loading) return <div className="users-container"><p>Loading users...</p></div>;

  return (
    <div className="users-container">
      <div className="users-header">
        <h1>Community Members</h1>
        <button className="create-user-toggle" onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? 'Cancel' : '+ Add New Member'}
        </button>
      </div>

      {isCreating && (
        <form className="create-user-form" onSubmit={handleCreateUser}>
          <h3>Create New Member</h3>
          <div className="form-grid">
            <input placeholder="Full Name" value={newName} onChange={e => setNewName(e.target.value)} required />
            <input placeholder="Email" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required />
            <input placeholder="Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            <input placeholder="Block Number" value={newBlock} onChange={e => setNewBlock(e.target.value)} required />
            <input placeholder="Phone (10 digits)" value={newPhone} onChange={e => setNewPhone(e.target.value)} required />
          </div>
          <button type="submit" className="save-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M20 6L9 17l-5-5"/></svg>
            Create Member
          </button>
        </form>
      )}

      {error && <p className="error">{error}</p>}
      <div className="users-grid">
        {users.map(u => (
          <UserItem 
            key={u._id} 
            user={u} 
            onDelete={handleDeleteUser} 
            onUpdate={handleUpdateUser}
          />
        ))}
      </div>
    </div>
  );
}

export default Users;
