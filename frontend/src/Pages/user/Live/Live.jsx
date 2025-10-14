import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Heart, MessageCircle, Share, Send, MoreHorizontal, User } from 'lucide-react';
import './Live.scss';

function Live() {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const containerRef = useRef(null);
  const commentsEndRef = useRef(null);

  // Récupérer des vidéos depuis l'API YouTube
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search`,
          {
            params: {
              part: 'snippet',
              maxResults: 10,
              key: 'AIzaSyCDZXehB1gnGImiXZ-51JeERE-NBq7NuFM',
              q: 'short',
              type: 'video'
            }
          }
        );
        
        const videosData = response.data.items.map(item => ({
          id: item.id.videoId,
          url: `https://www.youtube.com/embed/${item.id.videoId}?autoplay=1&mute=1`,
          title: item.snippet.title,
          likes: Math.floor(Math.random() * 10000) + 1000,
          comments: Math.floor(Math.random() * 500) + 50,
          shares: Math.floor(Math.random() * 200) + 10
        }));
        
        setVideos(videosData);
        
        // Initialiser les commentaires pour chaque vidéo
        const initialComments = {};
        videosData.forEach(video => {
          initialComments[video.id] = [
            {
              id: 1,
              user: 'Alexandre',
              text: 'Super contenu ! Très inspirant 👍',
              time: '2 min',
              likes: 12
            },
            {
              id: 2,
              user: 'Sophie',
              text: 'J\'adore cette créativité !',
              time: '5 min',
              likes: 8
            }
          ];
        });
        setComments(initialComments);
        
        // Simuler des utilisateurs actifs
        setActiveUsers([
          { id: 1, name: 'Marie', isLive: true },
          { id: 2, name: 'Thomas', isLive: false },
          { id: 3, name: 'Julie', isLive: true },
          { id: 4, name: 'David', isLive: false }
        ]);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  // Scroll vers le bas des commentaires
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleScroll = (e) => {
    const container = containerRef.current;
    const scrollPosition = container.scrollTop;
    const windowHeight = window.innerHeight;
    const newIndex = Math.round(scrollPosition / windowHeight);
    
    if (newIndex !== currentVideo) {
      setCurrentVideo(newIndex);
    }
  };

  const handleAddComment = (videoId) => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        user: 'Vous',
        text: newComment,
        time: 'Maintenant',
        likes: 0
      };
      
      setComments(prev => ({
        ...prev,
        [videoId]: [...(prev[videoId] || []), comment]
      }));
      setNewComment('');
    }
  };

  const handleLikeComment = (videoId, commentId) => {
    setComments(prev => ({
      ...prev,
      [videoId]: prev[videoId].map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    }));
  };

  const currentVideoData = videos[currentVideo];

  return (
    <div className="live-page">
      <div className="live-main-container">
        {/* Section Vidéos à gauche */}
        <div className="videos-section">
          <div 
            className="live-container" 
            ref={containerRef}
            onScroll={handleScroll}
          >
            {videos.map((video, index) => (
              <div 
                key={video.id} 
                className={`video-item ${index === currentVideo ? 'active' : ''}`}
              >
                <div className="video-wrapper">
                  <iframe
                    title={video.title}
                    src={index === currentVideo ? video.url : ''}
                    allow="autoplay; encrypted-media"
                    frameBorder="0"
                    allowFullScreen
                  />
                  <div className="video-overlay">
                    <div className="user-info">
                      <div className="avatar">
                        <User size={20} />
                      </div>
                      <div className="username">Creator_{index + 1}</div>
                      <button className="follow-btn">Suivre</button>
                    </div>
                    <div className="video-actions">
                      <button className="action-button">
                        <Heart className="icon" />
                        <span>{video.likes.toLocaleString()}</span>
                      </button>
                      <button className="action-button">
                        <MessageCircle className="icon" />
                        <span>{video.comments}</span>
                      </button>
                      <button className="action-button">
                        <Share className="icon" />
                        <span>{video.shares}</span>
                      </button>
                      <button className="action-button">
                        <MoreHorizontal className="icon" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Discussion à droite */}
        <div className="discussion-section">
          <div className="discussion-header">
            <h3>Discussion en direct</h3>
            <div className="live-indicator">
              <div className="live-dot"></div>
              <span>En direct</span>
            </div>
          </div>

          {/* Utilisateurs actifs */}
          <div className="active-users">
            <h4>Utilisateurs actifs</h4>
            <div className="users-list">
              {activeUsers.map(user => (
                <div key={user.id} className="user-item">
                  <div className="user-avatar">
                    <User size={16} />
                    {user.isLive && <div className="live-badge"></div>}
                  </div>
                  <span className="user-name">{user.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Commentaires */}
          <div className="comments-container">
            <div className="comments-list">
              {currentVideoData && comments[currentVideoData.id]?.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-avatar">
                    <User size={16} />
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-user">{comment.user}</span>
                      <span className="comment-time">{comment.time}</span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                    <div className="comment-actions">
                      <button 
                        className="like-btn"
                        onClick={() => handleLikeComment(currentVideoData.id, comment.id)}
                      >
                        <Heart size={14} />
                        <span>{comment.likes}</span>
                      </button>
                      <button className="reply-btn">Répondre</button>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={commentsEndRef} />
            </div>

            {/* Input pour nouveau commentaire */}
            {currentVideoData && (
              <div className="comment-input-container">
                <input
                  type="text"
                  placeholder="Ajouter un commentaire..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment(currentVideoData.id)}
                  className="comment-input"
                />
                <button 
                  onClick={() => handleAddComment(currentVideoData.id)}
                  className="send-button"
                  disabled={!newComment.trim()}
                >
                  <Send size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Live;