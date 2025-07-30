import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ResourcesPage = () => {
    const [resources, setResources] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');
    const { user, token } = useContext(AuthContext);

    useEffect(() => {
        if (user?.hood) {
            const fetchResources = async () => {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                try {
                    const res = await axios.get('http://localhost:5000/api/resources', config);
                    setResources(res.data);
                } catch (error) { console.error('Failed to fetch resources', error); }
            };
            fetchResources();
        }
    }, [user, token]);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setMessage('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('resourceFile', selectedFile);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            };
            const res = await axios.post('http://localhost:5000/api/resources/upload', formData, config);
            setResources([res.data, ...resources]);
            setMessage('File uploaded successfully!');
            setSelectedFile(null); // Clear the input
        } catch (error) {
            setMessage('File upload failed.');
        }
    };

    if (!user?.hood) {
        return (
            <div>
                <h2>Shared Resources</h2>
                <p>You need to join a hood to access its resources.</p>
                <Link to="/hoods">Click here to find a hood to join.</Link>
            </div>
        );
    }

    return (
        <div>
            <h2>Shared Resources</h2>
            <form onSubmit={handleUpload} style={{ /* ... styles ... */ }}>
                <h3>Upload a New Resource</h3>
                <input type="file" onChange={handleFileChange} />
                <button type="submit" disabled={!selectedFile}>Upload</button>
            </form>
            {message && <p>{message}</p>}

            <hr />

            <h3>Available Documents</h3>
            <ul>
                {resources.map(resource => (
                    <li key={resource._id}>
                        <a href={`http://localhost:5000/api/resources/download/${resource._id}`} download>
                            {resource.originalName}
                        </a>
                        <small> (Uploaded by {resource.uploader.name})</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ResourcesPage;