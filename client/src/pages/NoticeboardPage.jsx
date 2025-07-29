import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

let socket;

const NoticeboardPage = () => {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { user, token } = useContext(AuthContext);
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    // --- WebSocket Connection ---
    // Connect to the server
    socket = io('http://localhost:5000');

    // Join the hood's room once connected
    if (user && user.hood) {
      socket.emit('join-hood', user.hood);
    }

    // Listen for new notices from the server
    socket.on('new-notice', (newNotice) => {
      // Add the new notice to the state in real-time
      setNotices((prevNotices) => [newNotice, ...prevNotices]);
    });

    // --- Initial Data Fetch ---
    const fetchNotices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/notices', config);
        setNotices(res.data);
      } catch (error) {
        console.error('Failed to fetch notices', error);
      }
    };
    fetchNotices();

    // --- Cleanup on component unmount ---
    return () => {
      socket.disconnect();
    };
  }, [user, token]);

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    try {
        // The notice is sent via API, and the server broadcasts it via WebSocket
        await axios.post('http://localhost:5000/api/notices', { title, content }, config);
        setTitle('');
        setContent('');
    } catch (error) {
        alert('Failed to create notice.');
    }
  };

  return (
    <div>
      <h2>Live Noticeboard</h2>
      <form onSubmit={handleCreateNotice} style={{ marginBottom: '20px' }}>
        <h3>Post a New Notice</h3>
        <input 
          type="text" 
          placeholder="Title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)} 
          required 
          style={{ display: 'block', width: '50%', marginBottom: '10px' }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows="4"
          style={{ display: 'block', width: '50%', marginBottom: '10px' }}
        ></textarea>
        <button type="submit">Post Notice</button>
      </form>

      <hr/>

      <div id="notice-list">
        {notices.map(notice => (
          <div key={notice._id} style={{ border: '1px solid #007bff', padding: '15px', margin: '15px 0', borderRadius: '5px' }}>
            <h3>{notice.title}</h3>
            <p>{notice.content}</p>
            <small>Posted by {notice.author.name} on {new Date(notice.createdAt).toLocaleDateString('en-IN')}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeboardPage;