import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Settings } from 'lucide-react';
import { cn } from '../../utils/cn';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'My Tasks', path: '/my-tasks', icon: CheckSquare },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-taskflow-ink text-white shadow-xl h-full flex-shrink-0">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-taskflow-primary flex items-center justify-center">
            <span className="text-taskflow-ink font-bold text-xl">T</span>
          </div>
          <span className="text-xl font-bold tracking-tight">TaskFlow</span>
        </Link>
      </div>
      
      <div className="flex-1 py-4 flex flex-col gap-1 px-3">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-white/10 text-taskflow-primary font-medium" 
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon size={20} className={cn("transition-colors", isActive ? "text-taskflow-primary" : "text-gray-400 group-hover:text-gray-200")} />
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
