import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HoodsPage = () => {
  const [hoods, setHoods] = useState([]);
  const [hoodName, setHoodName] = useState('');
  const [message, setMessage] = useState('');
  const { user, token, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch hoods if the user's token is available
    if (token) {
      const fetchHoods = async () => {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
          const res = await axios.get('/api/hoods', config);
          // Defensive Check: Only update state if the API returns an array
          if (Array.isArray(res.data)) {
            setHoods(res.data);
          } else {
            console.error("API did not return an array for hoods:", res.data);
            setHoods([]); // Reset to an empty array on failure
          }
        } catch (error) {
          console.error('Failed to fetch hoods', error);
          setHoods([]); // Reset to an empty array on failure
        }
      };
      fetchHoods();
    }
  }, [token]);

  // Handler for creating a new hood
  const handleCreateHood = async (e) => {
    e.preventDefault();
    // Robust check to ensure user and user.id exist before proceeding
    if (!user || !user.id) {
        setMessage("User data not loaded. Please wait a moment and try again.");
        return;
    }
    
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const res = await axios.post('/api/hoods', { name: hoodName, userId: user.id }, config);
      setHoods([res.data, ...hoods]);
      setHoodName('');
      setMessage(`'${res.data.name}' created successfully!`);
    } catch (error) {
      setMessage('Failed to create hood. It might already exist.');
    }
  };
      
  // Handler for joining a hood
  const handleJoinHood = async (hoodId) => {
    if (!user || !token) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.put('/api/users/join-hood', { hoodId }, config);
      
      const updatedUser = { ...user, hood: res.data.hood };
      updateUser(updatedUser);

      setMessage(res.data.message);
      
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error) {
      setMessage('Failed to join hood.');
    }
  };

  return (
    <div>
      <h2>Create or Select a Hood</h2>
      
      <form onSubmit={handleCreateHood} style={{ marginBottom: '20px' }}>
        <h3>Create a New Hood</h3>
        <input
          type="text"
          placeholder="Enter new hood name"
          value={hoodName}
          onChange={(e) => setHoodName(e.target.value)}
          required
        />
        <button type="submit" style={{ marginLeft: '10px' }}>Create</button>
      </form>
      {message && <p style={{ color: '#28a745', fontWeight: 'bold' }}>{message}</p>}

      <hr style={{margin: '20px 0'}}/>

      <h3>Available Hoods</h3>
      <ul>
        {hoods.map((hood) => (
          <li key={hood._id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '15px' }}>{hood.name}</span>
            <button onClick={() => handleJoinHood(hood._id)}>
              Join
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HoodsPage;