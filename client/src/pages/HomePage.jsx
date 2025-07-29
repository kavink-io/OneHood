import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState({});
  const { user, token } = useContext(AuthContext);
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Effect to fetch the main feed
  useEffect(() => {
    if (user && user.hood) {
      const fetchPosts = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/posts/feed', config);
          setPosts(res.data);
        } catch (error) {
          console.error('Failed to fetch posts', error);
        }
      };
      fetchPosts();
    }
  }, [user, token]);

  // Handler for creating a new post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/posts', { content: newPostContent }, config);
      setPosts([res.data, ...posts]);
      setNewPostContent('');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // Handler for creating a new comment
  const handleCreateComment = async (e, postId) => {
    e.preventDefault();
    const content = commentInputs[postId];
    if (!content) return;
    try {
      const res = await axios.post(`http://localhost:5000/api/posts/${postId}/comments`, { content }, config);
      const updatedPosts = posts.map(post =>
        post._id === postId ? { ...post, comments: [...post.comments, res.data] } : post
      );
      setPosts(updatedPosts);
      handleCommentInputChange(postId, '');
    } catch (error) {
      alert('Failed to add comment.');
    }
  };
  
  // Handler for comment input changes
  const handleCommentInputChange = (postId, value) => {
    setCommentInputs({ ...commentInputs, [postId]: value });
  };

  // Handler for liking or unliking a post
  const handleLikePost = async (postId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/posts/${postId}/like`, {}, config);
      // Update the specific post in our local state with the new likes array
      setPosts(posts.map(post =>
        post._id === postId ? { ...post, likes: res.data } : post
      ));
    } catch (error) {
      console.error('Failed to like post', error);
      alert('Could not update like status.');
    }
  };

  // Render a prompt if the user hasn't joined a hood
  if (!user?.hood) {
    return (
      <div>
        <h2>Welcome, {user.name}!</h2>
        <p>You need to join a hood to see the feed and start posting.</p>
        <Link to="/hoods">Click here to find a hood to join.</Link>
      </div>
    );
  }

  // Render the main feed
  return (
    <div>
      <h2>Hood Feed - Chennai</h2>
      <form onSubmit={handleCreatePost}>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="What's happening in the hood?"
          rows="3"
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          required
        ></textarea>
        <button type="submit" style={{ marginTop: '10px' }}>Post</button>
      </form>

      <hr style={{ margin: '20px 0' }} />

      <div>
        {posts.map((post) => (
          <div key={post._id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '5px' }}>
            <p><strong>{post.author.name}</strong> <span style={{color: 'gray', fontSize: '0.8em'}}>
              at {new Date(post.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
            </span></p>
            <p>{post.content}</p>

            {/* Like Button and Karma Count */}
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => handleLikePost(post._id)}>
                {post.likes.includes(user.id) ? 'Unlike' : 'Like'} 👍
              </button>
              <span style={{ marginLeft: '10px' }}>
                {post.likes.length} Likes
              </span>
            </div>

            {/* Comments Section */}
            <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
              <strong>Comments ({post.comments.length}):</strong>
              {post.comments && post.comments.map(comment => (
                <div key={comment._id} style={{ backgroundColor: '#f9f9f9', padding: '8px', marginTop: '5px', borderRadius: '5px' }}>
                  <p style={{ margin: 0 }}><strong>{comment.author.name}:</strong> {comment.content}</p>
                </div>
              ))}
              <form onSubmit={(e) => handleCreateComment(e, post._id)} style={{ marginTop: '10px', display: 'flex' }}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInputs[post._id] || ''}
                  onChange={(e) => handleCommentInputChange(post._id, e.target.value)}
                  style={{ flexGrow: 1, padding: '5px' }}
                />
                <button type="submit" style={{ marginLeft: '10px' }}>Submit</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;