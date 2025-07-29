import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MarketplacePage = () => {
    const [listings, setListings] = useState([]);
    const [newListing, setNewListing] = useState({ title: '', description: '', price: '', category: 'For Sale' });
    const { user, token } = useContext(AuthContext);
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        if (user && user.hood) {
            const fetchListings = async () => {
                try {
                    const res = await axios.get('http://localhost:5000/api/listings', config);
                    setListings(res.data);
                } catch (error) {
                    console.error('Failed to fetch listings', error);
                }
            };
            fetchListings();
        }
    }, [user, token]);

    const handleChange = (e) => {
        setNewListing({ ...newListing, [e.target.name]: e.target.value });
    };

    const handleCreateListing = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/listings', newListing, config);
            setListings([res.data, ...listings]);
            setNewListing({ title: '', description: '', price: '', category: 'For Sale' });
        } catch (error) {
            alert('Failed to create listing.');
        }
    };

    if (!user?.hood) {
        return (
            <div>
                <h2>Marketplace</h2>
                <p>You need to join a hood to access its marketplace.</p>
                <Link to="/hoods">Click here to find a hood to join.</Link>
            </div>
        );
    }

    return (
        <div>
            <h2>Buy / Sell / Rent Zone</h2>
            <form onSubmit={handleCreateListing} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <h3>Create a New Listing</h3>
                <input type="text" name="title" placeholder="Item Title" value={newListing.title} onChange={handleChange} required style={{ display: 'block', width: '50%', marginBottom: '10px' }} />
                <textarea name="description" placeholder="Description" value={newListing.description} onChange={handleChange} required rows="3" style={{ display: 'block', width: '50%', marginBottom: '10px' }}></textarea>
                <input type="number" name="price" placeholder="Price (₹)" value={newListing.price} onChange={handleChange} required style={{ display: 'block', width: '50%', marginBottom: '10px' }} />
                <select name="category" value={newListing.category} onChange={handleChange} style={{ display: 'block', width: '50%', marginBottom: '10px' }}>
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                    <option value="Wanted">Wanted</option>
                </select>
                <button type="submit">Create Listing</button>
            </form>

            <hr />

            <h3>Available Listings</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {listings.map(listing => (
                    <div key={listing._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px', width: '300px' }}>
                        <span style={{ background: '#007bff', color: 'white', padding: '3px 8px', borderRadius: '10px', fontSize: '0.8em' }}>{listing.category}</span>
                        <h3 style={{ marginTop: '10px', marginBottom: '5px' }}>{listing.title}</h3>
                        <h4 style={{ color: '#28a745', margin: '0 0 10px 0' }}>₹{listing.price.toLocaleString('en-IN')}</h4>
                        <p>{listing.description}</p>
                        <small>Listed by: {listing.author.name}</small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketplacePage;