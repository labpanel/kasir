import { LogOut, User, Menu } from 'lucide-react';
import useStore from '../store/useStore';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useStore();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0 z-10 transition-colors duration-300">
      <div className="flex items-center">
        <button 
          onClick={onMenuToggle}
          className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none mr-3"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="hidden sm:inline text-sm font-medium text-gray-500">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        <span className="sm:hidden text-sm font-medium text-gray-500">
          {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-medium text-gray-900">{user?.name || user?.email || 'Kasir'}</span>
          <span className="text-xs text-gray-500">{user?.role || 'Admin Area'}</span>
        </div>
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm ring-2 ring-gray-100">
          <User className="w-5 h-5" />
        </div>
        <button
          onClick={logout}
          className="ml-1 w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
