import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Heart, BookOpen, Library, Phone, Menu, X, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/check-in', icon: Heart, label: 'Check-in' },
    { to: '/reflections', icon: BookOpen, label: 'Reflections' },
    { to: '/vocab', icon: Library, label: 'Vocabulary' },
    { to: '/resources', icon: Phone, label: 'Resources' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-gray-900 flex flex-col md:flex-row text-[#3C3C3C] dark:text-gray-100 transition-colors">
      <Toaster position="top-center" />
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-[#E8E4E1] dark:border-gray-700 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">T</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-teal-800 dark:text-teal-400">Tulia</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className={`
        fixed md:sticky top-0 left-0 h-screen bg-white dark:bg-gray-800 border-r border-[#E8E4E1] dark:border-gray-700 z-40
        w-64 transition-all duration-300 transform flex flex-col overflow-hidden
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-8 hidden md:flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-100 dark:shadow-teal-900/30">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <div>
              <h1 className="font-bold text-2xl tracking-tight text-teal-900 dark:text-teal-400 leading-none">Tulia</h1>
              <p className="text-xs text-teal-600 dark:text-teal-500/60 font-medium">Emotional Literacy</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="px-4 py-8 md:py-4 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-semibold' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'}
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
          </div>
        </div>

        <div className="px-8 pb-8 space-y-4 shrink-0">
          {/* User Info */}
          <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-2xl border border-teal-100 dark:border-teal-800/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-teal-900 dark:text-teal-400 truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-teal-600 dark:text-teal-500/60">Student Account</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                toast.success('Logged out successfully');
                navigate('/login');
              }}
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-teal-700 dark:text-teal-400 rounded-xl text-sm font-semibold hover:bg-teal-100 dark:hover:bg-gray-700 transition-all"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>

          {/* Daily Tip */}
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800/30">
            <p className="text-sm font-semibold text-orange-800 dark:text-orange-400">Daily Tip</p>
            <p className="text-xs text-orange-700/70 dark:text-orange-500/60 mt-1 italic">"Naming an emotion is the first step to navigating it."</p>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};
