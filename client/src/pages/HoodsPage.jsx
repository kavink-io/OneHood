import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const HoodsPage = () => {
  const [hoods, setHoods] = useState([]);
  const [hoodName, setHoodName] = useState('');
  const [message, setMessage] = useState('');
  const { user, token } = useContext(AuthContext);

  // Fetch all hoods when the component loads
  useEffect(() => {
    const fetchHoods = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/hoods');
        setHoods(res.data);
      } catch (error) {
        console.error('Failed to fetch hoods', error);
      }
    };
    fetchHoods();
  }, []);

  // Handler for the 'Create Hood' form submission
  const handleCreateHood = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
        setMessage("You must be logged in to create a hood.");
        return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/hoods', {
        name: hoodName,
        userId: user.id
      });
      // Add the newly created hood to the top of the list
      setHoods([res.data, ...hoods]);
      setHoodName(''); // Clear input field
      setMessage(`'${res.data.name}' created successfully!`);
    } catch (error) {
      setMessage('Failed to create hood. It might already exist.');
      console.error(error);
    }
  };

  // Handler for joining a hood
  const handleJoinHood = async (hoodId) => {
    try {
      // We must include the token to access a protected route
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const res = await axios.put('http://localhost:5000/api/users/join-hood', { hoodId }, config);
      
      setMessage(res.data.message);
    } catch (error) {
      setMessage('Failed to join hood.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Create or Select a Hood</h2>
      
      <form onSubmit={handleCreateHood}>
        <h3>Create a New Hood</h3>
        <input
          type="text"
          placeholder="Enter new hood name"
          value={hoodName}
          onChange={(e) => setHoodName(e.target.value)}
          required
        />
        <button type="submit">Create</button>
      </form>
      {message && <p>{message}</p>}

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