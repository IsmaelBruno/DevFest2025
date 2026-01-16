// Components/admin/NavBar/NavBar.jsx
import { useState, useRef, useEffect } from 'react';
import { Bell, User, Settings, LogOut, HelpCircle } from 'lucide-react';
import RotatingText from "../../RotatingText/RotatingText";
import './NavBar.scss';

const Header = ({ showProfileIcon = true }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const profileMenuRef = useRef(null);

  // Récupérer les données utilisateur réelles depuis localStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('authToken');
        
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserData({
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
            email: user.email,
            role: user.role || 'Utilisateur',
            avatar: getInitials(user.first_name, user.last_name, user.email),
            joinedDate: formatDate(user.created_at),
            lastLogin: 'À l\'instant'
          });
        } else if (token) {
          // Si on a un token mais pas d'infos utilisateur, essayer de récupérer
          fetchUserData(token);
        }
      } catch (error) {
        console.error('Erreur chargement données utilisateur:', error);
        setDefaultUserData();
      }
    };

    loadUserData();
  }, []);

  const getInitials = (firstName, lastName, email) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (email) {
      return email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Non spécifié';
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('user', JSON.stringify(user));
        setUserData({
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
          email: user.email,
          role: user.role || 'Utilisateur',
          avatar: getInitials(user.first_name, user.last_name, user.email),
          joinedDate: formatDate(user.created_at),
          lastLogin: 'À l\'instant'
        });
      } else {
        setDefaultUserData();
      }
    } catch (error) {
      console.error('Erreur récupération données:', error);
      setDefaultUserData();
    }
  };

  const setDefaultUserData = () => {
    const email = localStorage.getItem('userEmail') || 'utilisateur@madascan.com';
    const name = localStorage.getItem('userName') || email.split('@')[0];
    
    setUserData({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: email,
      role: localStorage.getItem('userRole') || 'Utilisateur',
      avatar: name.charAt(0).toUpperCase(),
      joinedDate: new Date().toLocaleDateString('fr-FR'),
      lastLogin: 'À l\'instant'
    });
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleViewProfile = () => {
    setShowAccountModal(true);
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/madascan-app/auth';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Données par défaut si l'utilisateur n'est pas encore chargé
  const displayUser = userData || {
    name: "Chargement...",
    email: "",
    role: "Utilisateur",
    avatar: "U",
    joinedDate: "",
    lastLogin: ""
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar__left">
          <div className="navbar__rotating-text">
            <RotatingText 
              texts={[
                "Détection IA en temps réel",
                "Analyse de deepfakes",
                "Sécurité multimédia",
                "Protection contre les contenus générés"
              ]}
              rotationSpeed={3000}
            />
          </div>
        </div>
        
        <div className="navbar__right">
          {showProfileIcon ? (
            <div className="navbar__profile" ref={profileMenuRef}>
              <button 
                className="profile-button"
                onClick={handleProfileClick}
              >
                <div className="profile-avatar">
                  {displayUser.avatar}
                </div>
                <span className="profile-name">{displayUser.name}</span>
                <User size={20} />
              </button>
              
              {showProfileMenu && (
                <div className="profile-menu">
                  <div className="profile-menu__header">
                    <div className="profile-menu__avatar">{displayUser.avatar}</div>
                    <div className="profile-menu__info">
                      <div className="profile-menu__name">{displayUser.name}</div>
                      <div className="profile-menu__email">{displayUser.email}</div>
                    </div>
                  </div>
                  
                  <button className="profile-menu__item logout" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="navbar__notification">
              <Bell size={22} />
              <span className="notification-badge">3</span>
            </button>
          )}
        </div>
      </header>

      {/* Modal A propos du compte */}
      {showAccountModal && (
        <div className="account-modal-overlay" onClick={() => setShowAccountModal(false)}>
          <div className="account-modal" onClick={(e) => e.stopPropagation()}>
            <div className="account-modal__header">
              <h3>Informations du compte</h3>
              <button 
                className="close-button"
                onClick={() => setShowAccountModal(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="account-modal__content">
              <div className="account-info">
                <div className="account-avatar-large">
                  {displayUser.avatar}
                </div>
                
                <div className="account-details">
                  <div className="account-detail">
                    <span className="detail-label">Nom complet:</span>
                    <span className="detail-value">{displayUser.name}</span>
                  </div>
                  
                  <div className="account-detail">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{displayUser.email}</span>
                  </div>
                  
                  <div className="account-detail">
                    <span className="detail-label">Rôle:</span>
                    <span className="detail-value role-badge">{displayUser.role}</span>
                  </div>
                  
                  <div className="account-detail">
                    <span className="detail-label">Membre depuis:</span>
                    <span className="detail-value">{displayUser.joinedDate}</span>
                  </div>
                  
                  <div className="account-detail">
                    <span className="detail-label">Dernière connexion:</span>
                    <span className="detail-value">{displayUser.lastLogin}</span>
                  </div>
                </div>
              </div>
              
              <div className="account-actions">
                <button className="account-action-btn primary">
                  <Settings size={18} />
                  Modifier le profil
                </button>
                <button className="account-action-btn secondary">
                  Modifier le mot de passe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;