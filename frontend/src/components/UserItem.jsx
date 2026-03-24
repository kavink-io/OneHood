import { useState } from 'react';

function UserItem({ user, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [blockNo, setBlockNo] = useState(user.blockNo);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [isAdmin, setIsAdmin] = useState(user.isAdmin);

  const handleSave = () => {
    onUpdate(user._id, { name, blockNo, email, phone, isAdmin });
    setIsEditing(false);
  };

  return (
    <div className={`user-card ${user.isAdmin ? 'admin-user' : ''}`}>
      {isEditing ? (
        <div className="user-edit-form">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
          <input value={blockNo} onChange={e => setBlockNo(e.target.value)} placeholder="Block No" />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />
          <label className="admin-toggle">
            Admin: 
            <input type="checkbox" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)} />
          </label>
          <div className="user-actions">
            <button onClick={handleSave} className="save-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M20 6L9 17l-5-5"/></svg>
              Save Edit
            </button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="user-info">
          <div className="user-header">
            <h3>{user.name}</h3>
            {user.isAdmin && <span className="admin-pill">Admin</span>}
          </div>
          <p><strong>Block:</strong> {user.blockNo}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <div className="user-actions">
            <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Details</button>
            {!user.isAdmin && <button onClick={() => onDelete(user._id)} className="delete-btn">Delete User</button>}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserItem;
