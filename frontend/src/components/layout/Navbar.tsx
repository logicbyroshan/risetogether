import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Sparkles,
  User as UserIcon,
  LogOut,
  Settings,
  Shield,
  ChevronDown,
  BookOpen,
  FolderGit2,
  Calendar,
  Layers,
  Rss,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [communityDropdownOpen, setCommunityDropdownOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setCommunityDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Feed', path: '/feed', icon: <Rss className="w-4 h-4" /> },
    { name: 'Resources', path: '/community/resources', icon: <Layers className="w-4 h-4" /> },
  ];

  const communityLinks = [
    { name: 'Blogs', path: '/community/blogs', desc: 'Read insights & tutorials', icon: <BookOpen className="w-4 h-4 text-orange-400" /> },
    { name: 'Projects', path: '/community/projects', desc: 'Explore community builds', icon: <FolderGit2 className="w-4 h-4 text-orange-400" /> },
    { name: 'Activities', path: '/community/activities', desc: 'Workshops & events', icon: <Calendar className="w-4 h-4 text-orange-400" /> },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-950/90 backdrop-blur-md border-b border-orange-500/20 shadow-xl'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-rajdhani font-bold text-2xl tracking-wider text-white group-hover:text-orange-400 transition-colors">
                RISE<span className="text-orange-500">TOGETHER</span>
              </span>
              <span className="text-[10px] text-gray-400 tracking-widest font-mono uppercase -mt-1">
                Developer Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-orange-400 bg-orange-500/10'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              Home
            </Link>

            {/* Community Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCommunityDropdownOpen(!communityDropdownOpen)}
                onBlur={() => setTimeout(() => setCommunityDropdownOpen(false), 200)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/community') && location.pathname !== '/community/resources'
                    ? 'text-orange-400 bg-orange-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <span>Community</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {communityDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 glassmorphism rounded-2xl p-2 shadow-2xl z-50 animate-slide-in">
                  {communityLinks.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-800/80 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-gray-800/90 border border-gray-700/50">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-200">{item.name}</div>
                        <div className="text-xs text-gray-400">{item.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/feed"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                location.pathname.startsWith('/feed')
                  ? 'text-orange-400 bg-orange-500/10'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              Feed
            </Link>

            <Link
              to="/community/resources"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === '/community/resources'
                  ? 'text-orange-400 bg-orange-500/10'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              Resources
            </Link>
          </nav>

          {/* Desktop Right Actions (Auth / User Dropdown) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  onBlur={() => setTimeout(() => setUserDropdownOpen(false), 200)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-gray-800/80 border border-orange-500/30 hover:border-orange-500/60 transition-all cursor-pointer"
                >
                  <img
                    src={user.profile.profile_pic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover border border-orange-500/50"
                  />
                  <span className="text-sm font-semibold text-gray-200">{user.username}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 glassmorphism rounded-2xl p-2 shadow-2xl z-50 animate-slide-in">
                    <div className="px-3 py-2 border-b border-gray-800 mb-1">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-bold text-orange-400 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/70 rounded-xl transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-orange-400" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/70 rounded-xl transition-colors"
                    >
                      <Settings className="w-4 h-4 text-orange-400" />
                      <span>Settings</span>
                    </Link>

                    {user.is_staff && (
                      <a
                        href="/admin/"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-amber-300 hover:text-amber-200 hover:bg-amber-950/40 rounded-xl transition-colors"
                      >
                        <Shield className="w-4 h-4 text-amber-400" />
                        <span>Django Admin</span>
                      </a>
                    )}

                    <div className="border-t border-gray-800 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/join">
                  <Button variant="primary" size="sm">
                    Join Community
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/80 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glassmorphism border-t border-orange-500/20 px-4 pt-4 pb-6 space-y-3">
          <Link
            to="/"
            className="block px-3 py-2 rounded-xl text-base font-medium text-gray-200 hover:bg-gray-800"
          >
            Home
          </Link>
          <div className="border-t border-gray-800 pt-2">
            <p className="px-3 text-xs font-semibold text-orange-400 uppercase tracking-wider mb-1">
              Community
            </p>
            <Link
              to="/community/blogs"
              className="block px-3 py-2 rounded-xl text-sm text-gray-300 hover:bg-gray-800"
            >
              Blogs & Articles
            </Link>
            <Link
              to="/community/projects"
              className="block px-3 py-2 rounded-xl text-sm text-gray-300 hover:bg-gray-800"
            >
              Project Showcase
            </Link>
            <Link
              to="/community/activities"
              className="block px-3 py-2 rounded-xl text-sm text-gray-300 hover:bg-gray-800"
            >
              Events & Activities
            </Link>
          </div>
          <Link
            to="/feed"
            className="block px-3 py-2 rounded-xl text-base font-medium text-gray-200 hover:bg-gray-800"
          >
            Social Feed
          </Link>
          <Link
            to="/community/resources"
            className="block px-3 py-2 rounded-xl text-base font-medium text-gray-200 hover:bg-gray-800"
          >
            Resources Library
          </Link>

          <div className="border-t border-gray-800 pt-3">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-orange-400 bg-orange-500/10"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>My Profile ({user.username})</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-950/40"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link to="/login" className="w-full">
                  <Button variant="secondary" size="md" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link to="/join" className="w-full">
                  <Button variant="primary" size="md" className="w-full">
                    Join
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
