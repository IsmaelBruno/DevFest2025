// components/Live/Live.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Heart, MessageCircle, Share, Send, MoreHorizontal, User, 
  Flame, Eye, Clock, Zap, Users, ThumbsUp, Reply
} from 'lucide-react';
import './Live.scss';

function Live() {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [liveMessages, setLiveMessages] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [viewerCount, setViewerCount] = useState(1247);
  const [isLiked, setIsLiked] = useState(false);
  const messagesEndRef = useRef(null);

  // Messages simulés
  const simulatedMessages = [
    { user: 'AI_Researcher', text: 'Les imperfections dans les yeux sont souvent un bon indicateur 👁️' },
    { user: 'Tech_Sleuth', text: 'Regardez les reflets dans les lunettes ! 🕶️' },
    { user: 'Digital_Forensic', text: 'Les mains générées par IA ont souvent 6 doigts 🤚' },
    { user: 'Security_Expert', text: 'Les deepfakes audio ont des respirations trop parfaites 🎤' },
    { user: 'AI_Analyst', text: 'Checkez les métadonnées EXIF des images 📸' },
  ];

  useEffect(() => {
    fetchVideos();
    
    // Simuler de nouveaux messages
    const interval = setInterval(() => {
      const randomMsg = simulatedMessages[Math.floor(Math.random() * simulatedMessages.length)];
      const newMsg = {
        id: Date.now(),
        user: randomMsg.user,
        text: randomMsg.text,
        time: 'À l\'instant',
        likes: 0,
      };
      
      setLiveMessages(prev => [...prev.slice(-15), newMsg]);
      setViewerCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveMessages]);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: 'snippet',
            maxResults: 10,
            key: 'AIzaSyCDZXehB1gnGImiXZ-51JeERE-NBq7NuFM',
            q: 'tutoriel détection IA deepfake',
            type: 'video',
            order: 'relevance',
            relevanceLanguage: 'fr'
          }
        }
      );
      
      const videosData = response.data.items.map(item => ({
        id: item.id.videoId,
        url: `https://www.youtube.com/embed/${item.id.videoId}?autoplay=1&mute=0&controls=1`,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high.url,
        likes: Math.floor(Math.random() * 1000) + 100,
        comments: Math.floor(Math.random() * 200) + 20,
        shares: Math.floor(Math.random() * 100) + 10,
        views: Math.floor(Math.random() * 50000) + 5000
      }));
      
      setVideos(videosData);
      
      // Messages initiaux
      setLiveMessages([
        { 
          id: 1, 
          user: 'AI_Detective', 
          text: 'Quels sont les signes les plus évidents d\'une image générée par IA ?', 
          time: '2 min', 
          likes: 12 
        },
        { 
          id: 2, 
          user: 'Tech_Guardian', 
          text: 'Les deepfakes audio sont de plus en plus réalistes !', 
          time: '5 min', 
          likes: 5 
        },
        { 
          id: 3, 
          user: 'Digital_Expert', 
          text: 'Quels outils recommandez-vous pour la détection ?', 
          time: '8 min', 
          likes: 8 
        }
      ]);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleAddMessage = () => {
    if (newComment.trim()) {
      const message = {
        id: Date.now(),
        user: 'Vous',
        text: newComment,
        time: 'À l\'instant',
        likes: 0,
      };
      
      setLiveMessages(prev => [...prev, message]);
      setNewComment('');
    }
  };

  const handleLikeMessage = (msgId) => {
    setLiveMessages(prev => prev.map(msg => 
      msg.id === msgId 
        ? { ...msg, likes: msg.likes + 1 }
        : msg
    ));
  };

  const handleLikeVideo = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="live-page">
      <div className="live-container">
        {/* Section Vidéos */}
        <div className="videos-section">
          <div className="section-header">
            <Flame className="header-icon" />
            <h2>Live IA - Tutoriels</h2>
            <div className="live-badge">
              <div className="live-dot"></div>
              <span>{viewerCount} spectateurs</span>
            </div>
          </div>

          {videos.length > 0 ? (
            <div className="video-player-container">
              <div className="video-wrapper">
                <iframe
                  title={videos[currentVideo]?.title}
                  src={videos[currentVideo]?.url}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
              
              <div className="video-info">
                <h3 className="video-title">{videos[currentVideo]?.title}</h3>
                <p className="video-channel">{videos[currentVideo]?.channel}</p>
                
                <div className="video-stats">
                  <div className="stat">
                    <Eye size={16} />
                    <span>{videos[currentVideo]?.views?.toLocaleString()} vues</span>
                  </div>
                </div>
                
                <div className="video-actions">
                  <button 
                    className={`action-btn ${isLiked ? 'liked' : ''}`}
                    onClick={handleLikeVideo}
                  >
                    <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                    <span>{isLiked ? 'Aimé' : 'Like'}</span>
                  </button>
                  
                  <button className="action-btn">
                    <MessageCircle size={20} />
                    <span>Commenter</span>
                  </button>
                  
                  <button className="action-btn">
                    <Share size={20} />
                    <span>Partager</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="loading-videos">Chargement des vidéos...</div>
          )}
          
          {/* Miniatures des autres vidéos */}
          <div className="video-thumbnails">
            {videos.slice(1, 4).map((video, index) => (
              <div 
                key={video.id} 
                className="thumbnail"
                onClick={() => setCurrentVideo(index + 1)}
              >
                <img src={video.thumbnail} alt={video.title} />
                <div className="thumbnail-info">
                  <p className="thumbnail-title">{video.title.substring(0, 50)}...</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Chat */}
        <div className="chat-section">
          <div className="chat-header">
            <Zap className="chat-icon" />
            <h3>Chat Live</h3>
            <div className="online-count">
              <div className="online-dot"></div>
              <span>En ligne</span>
            </div>
          </div>

          <div className="messages-container">
            {liveMessages.map(message => (
              <div key={message.id} className="message">
                <div className="message-avatar">
                  <User size={16} />
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-user">{message.user}</span>
                    <span className="message-time">
                      <Clock size={12} />
                      {message.time}
                    </span>
                  </div>
                  <p className="message-text">{message.text}</p>
                  <div className="message-actions">
                    <button 
                      className="message-action"
                      onClick={() => handleLikeMessage(message.id)}
                    >
                      <ThumbsUp size={14} />
                      {message.likes > 0 && <span>{message.likes}</span>}
                    </button>
                    <button className="message-action">
                      <Reply size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input message */}
          <div className="message-input-area">
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Écrivez votre message..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddMessage()}
              />
              <button 
                onClick={handleAddMessage}
                className="send-btn"
                disabled={!newComment.trim()}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Live;