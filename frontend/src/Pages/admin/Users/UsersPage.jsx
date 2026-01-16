import { useState, useEffect } from 'react';
import { Search, Filter, UserPlus, Download, MoreVertical, Edit, Trash2, Eye, Loader, AlertCircle } from 'lucide-react';
import ApiUser from '../../../services/ApiUser';
import './UsersPage.scss';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Charger les utilisateurs et statistiques au démarrage
  useEffect(() => {
    fetchUsers();
    fetchStatistics();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await ApiUser.getAllUsers({
        page: 1,
        limit: 50,
        search: searchTerm
      });
      
      if (result.success) {
        setUsers(result.data.users || []);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
      console.error('Erreur fetchUsers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const result = await ApiUser.getUserStatistics();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Erreur fetchStatistics:', error);
    }
  };

  // Recharger les utilisateurs quand la recherche change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== '' || users.length > 0) {
        fetchUsers();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ?`)) {
      try {
        const result = await ApiUser.deleteUser(userId);
        if (result.success) {
          alert('Utilisateur supprimé avec succès');
          fetchUsers(); // Rafraîchir la liste
          fetchStatistics(); // Rafraîchir les stats
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert('Erreur lors de la suppression');
        console.error('Erreur deleteUser:', error);
      }
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const result = await ApiUser.getUserById(userId);
      if (result.success) {
        setSelectedUser(result.data);
        setShowUserModal(true);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Erreur lors du chargement des détails');
      console.error('Erreur getUserById:', error);
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      const result = await ApiUser.updateUser(userId, userData);
      if (result.success) {
        alert('Utilisateur mis à jour avec succès');
        fetchUsers(); // Rafraîchir la liste
        setShowUserModal(false);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Erreur lors de la mise à jour');
      console.error('Erreur updateUser:', error);
    }
  };

  const handleExportUsers = () => {
    // Exporter les utilisateurs au format CSV
    const csvContent = [
      ['Nom', 'Email', 'Rôle', 'Statut', 'Date inscription', 'Analyses'].join(','),
      ...users.map(user => [
        `${user.first_name} ${user.last_name}`,
        user.email,
        user.role,
        user.is_active ? 'Actif' : 'Inactif',
        new Date(user.created_at).toLocaleDateString('fr-FR'),
        user.analyses_count || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `utilisateurs-madascan-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Actif': return '#10b981';
      case 'Inactif': return '#f59e0b';
      case 'En attente': return '#6366f1';
      case 'Suspendu': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const getRoleBadgeClass = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin': return 'role-admin';
      case 'moderator': return 'role-moderator';
      case 'modérateur': return 'role-moderator';
      default: return 'role-user';
    }
  };

  const getStatusBadge = (user) => {
    if (!user.is_active && user.otpVerification) {
      return { text: 'En attente', color: '#6366f1' };
    } else if (user.is_active) {
      return { text: 'Actif', color: '#10b981' };
    } else if (!user.otpVerification) {
      return { text: 'Email non vérifié', color: '#f59e0b' };
    } else {
      return { text: 'Inactif', color: '#94a3b8' };
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="users-page loading">
        <div className="loading-spinner">
          <Loader size={48} className="spinner" />
          <p>Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Gestion des utilisateurs</h1>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleExportUsers}>
            <Download size={18} />
            Exporter CSV
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.href = '/admin/users/new'}
          >
            <UserPlus size={18} />
            Nouvel utilisateur
          </button>
        </div>
      </div>

      <div className="page-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou rôle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-actions">
          <button className="filter-btn" onClick={fetchUsers}>
            <Filter size={18} />
            Actualiser
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={fetchUsers}>Réessayer</button>
        </div>
      )}

      <div className="page-stats">
        <div className="stat-card">
          <div className="stat-value">{stats?.total || 0}</div>
          <div className="stat-label">Utilisateurs total</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.active || 0}</div>
          <div className="stat-label">Actifs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.pending || 0}</div>
          <div className="stat-label">En attente</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {stats?.byRole?.admin || 0}
          </div>
          <div className="stat-label">Administrateurs</div>
        </div>
      </div>

      <div className="users-table-container">
        {users.length === 0 ? (
          <div className="empty-state">
            <UserPlus size={48} />
            <h3>Aucun utilisateur trouvé</h3>
            <p>{searchTerm ? 'Aucun résultat pour votre recherche' : 'Commencez par ajouter des utilisateurs'}</p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Date d'inscription</th>
                <th>Dernière connexion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                const status = getStatusBadge(user);
                return (
                  <tr key={user._id || user.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.first_name?.[0]?.toUpperCase() || ''}{user.last_name?.[0]?.toUpperCase() || ''}
                        </div>
                        <div className="user-details">
                          <div className="user-name">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                        {user.role || 'Utilisateur'}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="status-badge" 
                        style={{ backgroundColor: status.color }}
                      >
                        {status.text}
                      </span>
                    </td>
                    <td>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                    </td>
                    <td>
                      {user.last_login ? new Date(user.last_login).toLocaleDateString('fr-FR') : 'Jamais'}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn view" 
                          onClick={() => handleViewUser(user._id || user.id)}
                          title="Voir détails"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="action-btn edit" 
                          onClick={() => setShowUserModal(true)}
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="action-btn delete" 
                          onClick={() => handleDeleteUser(user._id || user.id, `${user.first_name} ${user.last_name}`)}
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de détail utilisateur */}
      {showUserModal && selectedUser && (
        <div className="user-modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Détails de l'utilisateur</h2>
              <button className="close-btn" onClick={() => setShowUserModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="user-profile">
                <div className="profile-avatar-large">
                  {selectedUser.first_name?.[0]?.toUpperCase() || ''}{selectedUser.last_name?.[0]?.toUpperCase() || ''}
                </div>
                <div className="profile-info">
                  <h3>{selectedUser.first_name} {selectedUser.last_name}</h3>
                  <p className="profile-email">{selectedUser.email}</p>
                  <div className="profile-meta">
                    <span className="meta-item">
                      <strong>Rôle:</strong> {selectedUser.role}
                    </span>
                    <span className="meta-item">
                      <strong>Inscrit le:</strong> {new Date(selectedUser.created_at).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="meta-item">
                      <strong>Statut:</strong> {getStatusBadge(selectedUser).text}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="user-actions">
                <button className="btn btn-secondary" onClick={() => setShowUserModal(false)}>
                  Fermer
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    // Logique pour modifier l'utilisateur
                    const newRole = prompt('Nouveau rôle (admin/user/moderator):', selectedUser.role);
                    if (newRole) {
                      handleUpdateUser(selectedUser._id, { role: newRole });
                    }
                  }}
                >
                  Modifier le rôle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;