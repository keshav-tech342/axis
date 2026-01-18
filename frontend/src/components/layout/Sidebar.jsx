import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Building2, 
  Activity, 
  Zap, 
  BarChart3, 
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen, isMobile }) => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', badge: null },
    { icon: Building2, label: 'Departments', path: '/departments', badge: '6' },
    { icon: Activity, label: 'Activities', path: '/activities', badge: '12' },
    { icon: Zap, label: 'Automations', path: '/automations', badge: 'Pro' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', badge: null },
    { icon: FileText, label: 'Decisions', path: '/decisions', badge: null },
    { icon: Settings, label: 'Settings', path: '/settings', badge: null },
  ];

  const isActive = (path) => location.pathname === path;

  const sidebarVariants = {
    open: { 
      width: isMobile ? '100%' : '280px',
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    closed: { 
      width: isMobile ? '0px' : '80px',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className={`
          fixed lg:relative top-0 left-0 h-screen
          bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900
          backdrop-blur-xl border-r border-white/10
          z-50 overflow-hidden
          ${isMobile ? 'shadow-2xl' : ''}
        `}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <Link to="/dashboard" className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h1 className="text-xl font-bold text-white">AXIS</h1>
                      <p className="text-xs text-gray-400">Intelligence</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>

              {/* Close button for mobile */}
              {isMobile && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="lg:hidden text-gray-400 hover:text-white p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    className={`
                      relative flex items-center gap-3 px-4 py-3 rounded-xl
                      transition-all duration-300 group
                      ${active 
                        ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white shadow-lg' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    {/* Active Indicator */}
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    {/* Icon */}
                    <div className="relative z-10">
                      <Icon className={`w-5 h-5 ${active ? 'text-purple-300' : ''}`} />
                    </div>

                    {/* Label */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="relative z-10 font-medium whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Badge */}
                    {item.badge && isOpen && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`
                          relative z-10 ml-auto px-2 py-0.5 rounded-full text-xs font-semibold
                          ${item.badge === 'Pro' 
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' 
                            : 'bg-purple-500/30 text-purple-300'
                          }
                        `}
                      >
                        {item.badge}
                      </motion.span>
                    )}

                    {/* Hover Glow */}
                    {!active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 rounded-xl transition-all duration-300" />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Toggle Button (Desktop) */}
          {!isMobile && (
            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
              >
                {isOpen ? (
                  <>
                    <ChevronLeft className="w-5 h-5" />
                    <span className="text-sm">Collapse</span>
                  </>
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;