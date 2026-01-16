// Components/admin/SideBar/SideBar.jsx
import { NavLink } from 'react-router-dom';
import { BarChart3, Users, Folder, LogOut } from 'lucide-react';
import './SideBar.scss';

const Sidebar = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/madascan-app/auth';
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar__nav">
        <NavLink 
          to="/madascan-app/admin/dashboard" 
          className={({ isActive }) => 
            `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`
          }
        >
          <BarChart3 size={20} />
          <span className="sidebar__tooltip">Tableau de bord</span>
        </NavLink>
        
        <NavLink 
          to="/madascan-app/admin/users" 
          className={({ isActive }) => 
            `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`
          }
        >
          <Users size={20} />
          <span className="sidebar__tooltip">Utilisateurs</span>
        </NavLink>
      </nav>
      
    </aside>
  );
};

export default Sidebar;