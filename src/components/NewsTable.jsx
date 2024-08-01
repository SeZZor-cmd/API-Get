import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; 

const NewsTable = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchPosts = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${page}&hitsPerPage=15`);
      setPosts(prevPosts => {
        const existingIds = new Set(prevPosts.map(post => post.objectID));
        const newPosts = response.data.hits.filter(post => !existingIds.has(post.objectID));
        return [...prevPosts, ...newPosts];
      });
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      setError('Error fetching posts');
      console.error("Error fetching posts", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading]);

  
  useEffect(() => {
    intervalRef.current = setInterval(fetchPosts, 10000); 

    
    return () => clearInterval(intervalRef.current);
  }, [fetchPosts]);

  
  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    fetchPosts();
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchPosts]);

  return (
    <div className="container">
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>URL</th>
            <th>Created At</th>
            <th>Author</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post.objectID}>
              <td><Link to={`/post/${post.objectID}`}>{post.title}</Link></td>
              <td>{post.url ? <a href={post.url} target="_blank" rel="noopener noreferrer">{post.url}</a> : 'No URL'}</td>
              <td>{new Date(post.created_at).toLocaleString()}</td>
              <td>{post.author}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <p>Loading more posts...</p>}
    </div>
  );
};

export default NewsTable;
