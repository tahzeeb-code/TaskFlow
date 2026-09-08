import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, Search, LogOut } from 'lucide-react';

const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="h-16 border-b border-taskflow-border bg-white flex items-center justify-between px-4 md:px-8 shrink-0">
      <div className="flex items-center">
        <button className="md:hidden text-taskflow-textSecondary hover:text-taskflow-ink p-2 -ml-2">
          <Menu size={20} />
        </button>
        <div className="hidden md:flex items-center text-sm text-gray-400 bg-taskflow-surface px-3 py-1.5 rounded-full border border-taskflow-border w-64">
          <Search size={16} className="mr-2" />
          <span>Search...</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-taskflow-ink transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-taskflow-danger rounded-full border border-white"></span>
        </button>
        
        <div className="h-6 w-px bg-taskflow-border mx-2"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-taskflow-ink leading-tight">{user?.name}</p>
            <p className="text-xs text-taskflow-textSecondary leading-tight">{user?.email}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-taskflow-primary/30 flex items-center justify-center text-taskflow-ink font-semibold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <button onClick={logout} className="text-gray-400 hover:text-taskflow-danger transition-colors ml-2" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
