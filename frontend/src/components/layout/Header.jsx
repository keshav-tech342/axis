import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Search, 
  Menu, 
  User, 
  Settings, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar, isMobile }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const notifications = [
    { id: 1, text: 'Cash runway below 6 months', type: 'critical', time: '2m ago' },
    { id: 2, text: 'New activity assigned to you', type: 'info', time: '1h ago' },
    { id: 3, text: 'Budget approval required', type: 'warning', time: '3h ago' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-slate-900/80 via-purple-900/20 to-slate-900/80 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-300" />
            </button>
          )}

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="text"
                placeholder="Search departments, activities..."
                className="w-full pl-12 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/10 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Bell className="w-6 h-6 text-gray-300" />
              {/* Badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                >
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-white font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notif.type === 'critical' ? 'bg-red-500' :
                            notif.type === 'warning' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm text-gray-300">{notif.text}</p>
                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-white/10">
                    <button className="text-sm text-purple-400 hover:text-purple-300">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">Test User</p>
                <p className="text-xs text-gray-400">Free Plan</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </motion.button>

            {/* User Dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                >
                  <div className="p-4 border-b border-white/10">
                    <p className="text-white font-medium">Test User</p>
                    <p className="text-sm text-gray-400">test@example.com</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/5 rounded-lg transition-colors text-left">
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/5 rounded-lg transition-colors text-left">
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </button>
                  </div>
                  <div className="p-2 border-t border-white/10">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;