import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Heart, BookOpen, Library, Phone, Menu, X, LogOut, User, Settings, ArrowLeft, Trash2, Globe, Lock, Moon, Mail, Eye, EyeOff, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import logo from '../../images/logo.png';

interface UserProfile {
  id: number;
  username: string;
  created_at: string;
  last_login?: string | null;
}

export const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [showAccountModal, setShowAccountModal] = React.useState(false);
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const [showThemeModal, setShowThemeModal] = React.useState(false);
  const [showContactModal, setShowContactModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = React.useState('');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleMyAccountClick = async () => {
    setIsUserMenuOpen(false);
    setShowAccountModal(true);
    
    // Fetch profile data
    if (!profile) {
      setIsLoadingProfile(true);
      try {
        const response = await fetch('http://localhost:8001/api/auth/me', {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoadingProfile(false);
      }
    }
  };

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
          <img src={logo} alt="Tulia Logo" className="w-8 h-8 object-contain" />
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
            <img src={logo} alt="Tulia Logo" className="w-10 h-10 object-contain shadow-lg shadow-teal-100 dark:shadow-teal-900/30 rounded-xl" />
            <div>
              <h1 className="font-bold text-2xl tracking-tight text-teal-900 dark:text-teal-400 leading-none">Tulia</h1>
             
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

        <div className="px-8 pb-8 shrink-0">
          {/* User Info with Dropdown */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full p-4 bg-teal-50 dark:bg-teal-900/20 rounded-2xl border border-teal-100 dark:border-teal-800/30 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-teal-900/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-bold text-teal-900 dark:text-teal-400 truncate">
                    {user?.username}
                  </p>
                 
                </div>
                <Menu size={18} className="text-teal-600 dark:text-teal-500" />
              </div>
            </button>

            {/* Dropdown Menu - Responsive positioning */}
            {isUserMenuOpen && (
              <>
                {/* Mobile and Tablet overlay */}
                <div 
                  className="fixed md:hidden inset-0 z-30"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-40 w-64 md:w-auto max-h-96 overflow-y-auto
                    md:bottom-full
                    bottom-auto md:mb-2
                    top-full md:top-auto
                    md:right-0 md:left-auto
                    mt-2 md:mt-0"
                >
                  {/* Profile Preview */}
                  <div className="p-4 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/30 dark:to-blue-900/30 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {user?.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.username}</p>
                        <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">Free Account</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={handleMyAccountClick}
                      className="w-full px-4 py-2.5 flex items-center gap-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <User size={16} className="text-teal-600 dark:text-teal-400" />
                      My Account
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setShowSettingsModal(true);
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <Settings size={16} className="text-teal-600 dark:text-teal-400" />
                      Settings
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-200 dark:bg-gray-700" />

                  {/* Sign Out */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        logout();
                        toast.success('Logged out successfully');
                        navigate('/login');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
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

      {/* Account Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">My Account</h2>
              <button
                onClick={() => {
                  setShowAccountModal(false);
                  setDeleteConfirmation('');
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {isLoadingProfile ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
                </div>
              ) : (
                <>
                  {/* Account Details */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">Username</label>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">
                        {profile?.username}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">Registration Date</label>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">
                        {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' }) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">Last Login</label>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">
                        {profile?.last_login 
                          ? new Date(profile.last_login).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })
                          : 'Never logged in'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setShowDeleteModal(true);
                      }}
                      className="w-full px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete Account
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        toast.success('Logged out successfully');
                        navigate('/login');
                        setShowAccountModal(false);
                      }}
                      className="w-full px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-2">
                {/* Language */}
                <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors text-left">
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                      <Globe size={16} className="text-teal-600 dark:text-teal-400" />
                      Language
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">English</p>
                  </div>
                  <span className="text-gray-400 text-lg">›</span>
                </button>

                {/* Change Password */}
                <button 
                  onClick={() => {
                    setShowSettingsModal(false);
                    setShowPasswordModal(true);
                    setPasswordError('');
                  }}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors text-left"
                >
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                      <Lock size={16} className="text-teal-600 dark:text-teal-400" />
                      Change Password
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Update your password</p>
                  </div>
                  <span className="text-gray-400 text-lg">›</span>
                </button>

                {/* Theme */}
                <button 
                  onClick={() => setShowThemeModal(true)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors text-left">
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                      <Moon size={16} className="text-teal-600 dark:text-teal-400" />
                      Theme
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'}</p>
                  </div>
                  <span className="text-gray-400 text-lg">›</span>
                </button>

                {/* Contact Us */}
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors text-left">
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                      <Mail size={16} className="text-teal-600 dark:text-teal-400" />
                      Contact Us
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Get help and support</p>
                  </div>
                  <span className="text-gray-400 text-lg">›</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Account</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This action cannot be undone. All your data will be permanently deleted.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type your username to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder={user?.username}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (deleteConfirmation !== user?.username) {
                    toast.error('Username must match to delete account');
                    return;
                  }

                  setIsDeleting(true);
                  try {
                    const response = await fetch('http://localhost:8001/api/auth/account', {
                      method: 'DELETE',
                      credentials: 'include',
                      headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                      }
                    });

                    if (!response.ok) {
                      throw new Error('Failed to delete account');
                    }

                    toast.success('Account deleted successfully');
                    logout();
                    navigate('/login');
                  } catch (error) {
                    console.error('Error deleting account:', error);
                    toast.error('Failed to delete account');
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                disabled={isDeleting || deleteConfirmation !== user?.username}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Change Password</h3>
            
            {passwordError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-400">{passwordError}</p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    disabled={isChangingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    disabled={isChangingPassword}
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    disabled={isChangingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    disabled={isChangingPassword}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    disabled={isChangingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    disabled={isChangingPassword}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setPasswordError('');
                }}
                disabled={isChangingPassword}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setPasswordError('');
                  
                  // Validation
                  if (!currentPassword) {
                    setPasswordError('Current password is required');
                    return;
                  }
                  if (!newPassword) {
                    setPasswordError('New password is required');
                    return;
                  }
                  if (newPassword.length < 6) {
                    setPasswordError('New password must be at least 6 characters');
                    return;
                  }
                  if (newPassword !== confirmPassword) {
                    setPasswordError('New passwords do not match');
                    return;
                  }
                  
                  setIsChangingPassword(true);
                  try {
                    const response = await fetch('http://localhost:8001/api/auth/change-password', {
                      method: 'POST',
                      credentials: 'include',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                      },
                      body: JSON.stringify({
                        current_password: currentPassword,
                        new_password: newPassword
                      })
                    });

                    if (!response.ok) {
                      const errorData = await response.json();
                      throw new Error(errorData.detail || 'Failed to change password');
                    }

                    toast.success('Password changed successfully');
                    setShowPasswordModal(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  } catch (error) {
                    console.error('Error changing password:', error);
                    setPasswordError(error instanceof Error ? error.message : 'Failed to change password');
                  } finally {
                    setIsChangingPassword(false);
                  }
                }}
                disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isChangingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Theme Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Choose Theme</h2>
              <button
                onClick={() => setShowThemeModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3">
              {/* Light Theme */}
              <button
                onClick={() => {
                  setTheme('light');
                  setShowThemeModal(false);
                }}
                className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                  theme === 'light'
                    ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-teal-600 dark:hover:border-teal-400'
                }`}
              >
                <Sun size={20} className={theme === 'light' ? 'text-teal-600' : 'text-gray-600 dark:text-gray-400'} />
                <div className="text-left">
                  <p className={`font-semibold ${theme === 'light' ? 'text-teal-600' : 'text-gray-900 dark:text-white'}`}>
                    Light
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Bright and clean</p>
                </div>
                {theme === 'light' && (
                  <div className="ml-auto w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  </div>
                )}
              </button>

              {/* Dark Theme */}
              <button
                onClick={() => {
                  setTheme('dark');
                  setShowThemeModal(false);
                }}
                className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                  theme === 'dark'
                    ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-teal-600 dark:hover:border-teal-400'
                }`}
              >
                <Moon size={20} className={theme === 'dark' ? 'text-teal-600' : 'text-gray-600 dark:text-gray-400'} />
                <div className="text-left">
                  <p className={`font-semibold ${theme === 'dark' ? 'text-teal-600' : 'text-gray-900 dark:text-white'}`}>
                    Dark
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Easy on the eyes</p>
                </div>
                {theme === 'dark' && (
                  <div className="ml-auto w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  </div>
                )}
              </button>
            </div>

            <button
              onClick={() => setShowThemeModal(false)}
              className="w-full mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}

      {/* Contact Us Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Get in Touch</h2>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3">
              {/* Discord Community */}
              <a
                href="https://discord.gg/feWFvwdJNf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group"
              >
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.3164 3.2C18.8 2.5 17.1328 2 15.3672 2C15.1641 2 14.9609 2.0938 14.8438 2.25C14.6406 2.5625 14.4375 3.0625 14.3203 3.5625C12.3984 3.2188 10.5078 3.2188 8.62109 3.5625C8.50391 3.0625 8.30078 2.5625 8.09766 2.25C7.98047 2.0938 7.77734 2 7.57422 2C5.80859 2 4.14141 2.5 2.62109 3.2C2.50391 3.25 2.40625 3.3438 2.39844 3.4375C0.617188 6.78125 0.0625 10.0469 0.360352 13.2656C0.382813 13.4531 0.492188 13.6094 0.644531 13.6875C2.35938 14.8438 4.01563 15.5625 5.62109 16.0156C5.82422 16.0703 6.04297 15.9766 6.15625 15.8125C6.67969 15.0313 7.14453 14.2031 7.54297 13.3438C5.86328 12.9375 4.24609 12.3594 2.74609 11.5156C2.55859 11.4063 2.42578 11.2188 2.42578 11.0156C2.42578 10.8125 2.55859 10.625 2.74609 10.5156C4.71875 9.25 7.0625 8.4375 9.64453 8.125C9.82031 8.10156 10 8.1875 10.0938 8.34375C10.2969 8.71875 10.5078 9.125 10.7266 9.5C11.6406 9.375 12.5547 9.375 13.4844 9.5C13.7031 9.125 13.9141 8.71875 14.1094 8.34375C14.2031 8.1875 14.3906 8.10156 14.5664 8.125C17.1484 8.4375 19.4922 9.25 21.4648 10.5156C21.6523 10.625 21.7891 10.8125 21.7891 11.0156C21.7891 11.2188 21.6523 11.4063 21.4648 11.5156C19.9648 12.3594 18.3477 12.9375 16.668 13.3438C17.0664 14.2031 17.5312 15.0313 18.0469 15.8125C18.1602 15.9766 18.3789 16.0703 18.582 16.0156C20.1875 15.5625 21.8438 14.8438 23.5586 13.6875C23.7109 13.6094 23.8203 13.4531 23.8438 13.2656C24.1797 9.75781 23.4297 6.55469 20.3164 3.2ZM 8.29297 10.8125C7.35156 10.8125 6.58984 11.6094 6.58984 12.5938C6.58984 13.5781 7.35937 14.375 8.29297 14.375C9.23438 14.375 9.99609 13.5781 9.99609 12.5938C9.99609 11.6094 9.23438 10.8125 8.29297 10.8125ZM 15.7188 10.8125C14.7773 10.8125 14.0156 11.6094 14.0156 12.5938C14.0156 13.5781 14.7773 14.375 15.7188 14.375C16.6602 14.375 17.4219 13.5781 17.4219 12.5938C17.4219 11.6094 16.6602 10.8125 15.7188 10.8125Z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">Discord Community</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Join our server to connect</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M 9 5 l 7 7 l -7 7" />
                </svg>
              </a>

            </div>

            <button
              onClick={() => setShowContactModal(false)}
              className="w-full mt-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
