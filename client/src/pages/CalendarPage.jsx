import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const { user, token } = useContext(AuthContext);
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        if (user && user.hood) {
            const fetchEvents = async () => {
                try {
                    const res = await axios.get('http://localhost:5000/api/events', config);
                    setEvents(res.data);
                } catch (error) {
                    console.error('Failed to fetch events', error);
                }
            };
            fetchEvents();
        }
    }, [user, token]);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/events', { title, description, date }, config);
            setEvents([...events, res.data].sort((a, b) => new Date(a.date) - new Date(b.date)));
            setTitle('');
            setDescription('');
            setDate('');
        } catch (error) {
            alert('Failed to create event.');
        }
    };

    if (!user?.hood) {
        return (
            <div>
                <h2>Hood Calendar</h2>
                <p>You need to join a hood to see its calendar.</p>
                <Link to="/hoods">Click here to find a hood to join.</Link>
            </div>
        );
    }

    return (
        <div>
            <h2>Hood Calendar</h2>
            <form onSubmit={handleCreateEvent} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <h3>Create a New Event</h3>
                <input type="text" placeholder="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ display: 'block', width: '50%', marginBottom: '10px' }} />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={{ display: 'block', width: '50%', marginBottom: '10px' }} />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" style={{ display: 'block', width: '50%', marginBottom: '10px' }}></textarea>
                <button type="submit">Add Event</button>
            </form>

            <hr />

            <h3>Upcoming Events</h3>
            <div>
                {events.map(event => (
                    <div key={event._id} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
                        <h4>{new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata' })}</h4>
                        <h3>{event.title}</h3>
                        <p>{event.description}</p>
                        <small>Posted by: {event.author.name}</small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarPage;