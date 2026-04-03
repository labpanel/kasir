import { NavLink } from 'react-router-dom';
import { Users, FileText, LayoutDashboard, ShoppingCart, Package, BarChart2, Settings } from 'lucide-react';
import useStore from '../store/useStore';

const Sidebar = () => {
  const { settings } = useStore();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transaksi', path: '/transaksi', icon: ShoppingCart },
    { name: 'Stok Barang', path: '/stok', icon: Package },
    { name: 'Pelanggan', path: '/pelanggan', icon: Users },
    { name: 'Quotation', path: '/quotation', icon: FileText },
    { name: 'Laporan', path: '/laporan', icon: BarChart2 },
    { name: 'Pengaturan', path: '/pengaturan', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-300">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xl mr-3">
          K
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-tight">
          {settings.storeName}
        </span>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="bg-blue-50 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-blue-900">Bantuan</h4>
          <p className="text-xs text-blue-700 mt-1">Hubungi support jika kendala</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
