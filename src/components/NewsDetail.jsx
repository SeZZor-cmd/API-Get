import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const NewsDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://hn.algolia.com/api/v1/items/${id}`);
        setPost(response.data);
      } catch (error) {
        setError('Error fetching post');
        console.error("Error fetching post", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return (
    <div>
      <h1>Post Details</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {post && <pre>{JSON.stringify(post, null, 2)}</pre>}
    </div>
  );
};

export default NewsDetail;
