import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PollsPage = () => {
    const [polls, setPolls] = useState([]);
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']); // Start with two empty options
    const { user, token } = useContext(AuthContext);
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        if (user?.hood) {
            axios.get('http://localhost:5000/api/polls', config).then(res => setPolls(res.data));
        }
    }, [user, token]);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => setOptions([...options, '']);

    const handleCreatePoll = async (e) => {
        e.preventDefault();
        const validOptions = options.filter(opt => opt.trim() !== '');
        if (validOptions.length < 2) {
            alert('Please provide at least two valid options.');
            return;
        }
        try {
            const res = await axios.post('http://localhost:5000/api/polls', { question, options: validOptions }, config);
            setPolls([res.data, ...polls]);
            setQuestion('');
            setOptions(['', '']);
        } catch (error) { alert('Failed to create poll.'); }
    };

    const handleVote = async (pollId, optionId) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/polls/${pollId}/vote`, { optionId }, config);
            setPolls(polls.map(p => p._id === pollId ? res.data : p));
        } catch (error) { alert('Failed to vote.'); }
    };

    return (
        <div>
            <h2>Polls & Opinions</h2>
            {/* Create Poll Form */}
            <form onSubmit={handleCreatePoll} style={{ /* ... styles ... */ }}>
                <h3>Create a New Poll</h3>
                <input type="text" placeholder="Poll Question" value={question} onChange={(e) => setQuestion(e.target.value)} required />
                {options.map((option, index) => (
                    <input key={index} type="text" placeholder={`Option ${index + 1}`} value={option} onChange={(e) => handleOptionChange(index, e.target.value)} />
                ))}
                <button type="button" onClick={addOption}>Add Option</button>
                <button type="submit">Create Poll</button>
            </form>

            <hr />

            {/* Polls List */}
            <h3>Active Polls</h3>
            {polls.map(poll => (
                <div key={poll._id} style={{ border: '1px solid #ddd', padding: '15px', margin: '15px 0' }}>
                    <h4>{poll.question} <small>(by {poll.author.name})</small></h4>
                    {poll.options.map(option => {
                        const hasVoted = option.votes.includes(user.id);
                        return (
                            <button key={option._id} onClick={() => handleVote(poll._id, option._id)} disabled={poll.options.some(opt => opt.votes.includes(user.id))}>
                                {option.text} ({option.votes.length}) {hasVoted ? '✓' : ''}
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default PollsPage;