// Layouts/AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from '../../Components/admin/NavBar/NavBar';
import Sidebar from '../../Components/admin/SideBar/SideBar';
import './AdminLayout.scss';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <main className="admin-main">
          <Outlet /> {/* Ici seront injectées les pages admin */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;