import { BarChart3, Users, Folder ,LogOut} from 'lucide-react';
import './SideBar.scss';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar__nav">
        <div className="sidebar__item sidebar__item--active">
          <BarChart3 size={20} />
        </div>
        <div className="sidebar__item">
          <Folder size={20} />
        </div>
        <div className="sidebar__item">
          <Users size={20} />
        </div>
      </nav>
      
      <div className="sidebar__bottom">
        <div className="sidebar__item">
          <div className="sidebar__avatar"><LogOut size={25}/></div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;