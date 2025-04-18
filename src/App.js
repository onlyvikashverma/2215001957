import React, { useEffect, useState } from "react";
import axios from "axios";
import './App.css';

const API_BASE = "http://20.204.56.144/evaluation-service";

function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, postRes, commentRes] = await Promise.all([
          axios.get(${API_BASE}/users),
          axios.get(${API_BASE}/posts),
          axios.get(${API_BASE}/comments)
        ]);

        setUsers(userRes.data);
        setPosts(postRes.data);
        setComments(commentRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Top users by most commented posts
  const getTopUsers = () => {
    const commentCount = {};
    comments.forEach(comment => {
      const post = posts.find(p => p.id === comment.postId);
      if (post) {
        commentCount[post.userId] = (commentCount[post.userId] || 0) + 1;
      }
    });

    const sortedUsers = users
      .map(user => ({
        ...user,
        commentCount: commentCount[user.id] || 0
      }))
      .sort((a, b) => b.commentCount - a.commentCount)
      .slice(0, 5);

    return sortedUsers;
  };

  // Trending posts by number of comments
  const getTrendingPosts = () => {
    const postCommentCount = {};
    comments.forEach(comment => {
      postCommentCount[comment.postId] = (postCommentCount[comment.postId] || 0) + 1;
    });

    return posts
      .map(post => ({
        ...post,
        commentCount: postCommentCount[post.id] || 0
      }))
      .sort((a, b) => b.commentCount - a.commentCount)
      .slice(0, 5);
  };

  // Latest posts feed
  const getLatestFeed = () => {
    return [...posts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
  };

  return (
    <div className="App">
      <h1>📊 Social Media Analytics Dashboard</h1>

      <section>
        <h2>🔥 Top Users</h2>
        <ul>
          {getTopUsers().map(user => (
            <li key={user.id}>{user.name} - {user.commentCount} comments</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>📈 Trending Posts</h2>
        <ul>
          {getTrendingPosts().map(post => (
            <li key={post.id}>{post.title} - {post.commentCount} comments</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>📰 Latest Feed</h2>
        <ul>
          {getLatestFeed().map(post => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;