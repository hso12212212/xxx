import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, PenSquare, User, LogOut, Search, Shield, Globe } from 'lucide-react';

const Navbar: React.FC = () => {
  const { currentUser, userData, logout, isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">هاسنديل</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-gray-400 outline-none text-sm bg-gray-50"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </form>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm"
              >
                <Globe className="w-4 h-4" />
                <span>{language === 'ar' ? 'ع' : language === 'en' ? 'EN' : 'کو'}</span>
              </button>
              {isLangOpen && (
                <div className="absolute left-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-1 border z-50">
                  <button
                    onClick={() => { setLanguage('ar'); setIsLangOpen(false); }}
                    className={`w-full text-right px-4 py-2 text-sm hover:bg-gray-50 ${language === 'ar' ? 'text-gray-900 font-medium' : 'text-gray-600'}`}
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                    className={`w-full text-right px-4 py-2 text-sm hover:bg-gray-50 ${language === 'en' ? 'text-gray-900 font-medium' : 'text-gray-600'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => { setLanguage('ku'); setIsLangOpen(false); }}
                    className={`w-full text-right px-4 py-2 text-sm hover:bg-gray-50 ${language === 'ku' ? 'text-gray-900 font-medium' : 'text-gray-600'}`}
                  >
                    کوردی
                  </button>
                </div>
              )}
            </div>

            {currentUser ? (
              <>
                <Link
                  to="/write"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <PenSquare className="w-5 h-5" />
                  <span>{t('writeArticle')}</span>
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2"
                  >
                    <img
                      src={userData?.avatar || `https://ui-avatars.com/api/?name=${currentUser.email}`}
                      alt="Avatar"
                      className="w-9 h-9 rounded-full object-cover border-2 border-gray-200"
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border">
                      <div className="px-4 py-2 border-b">
                        <p className="font-medium text-gray-900 truncate">{userData?.name}</p>
                        <p className="text-sm text-gray-500 truncate">{currentUser.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>{t('profile')}</span>
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <PenSquare className="w-4 h-4" />
                        <span>{t('myArticles')}</span>
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-amber-600 hover:bg-amber-50"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Shield className="w-4 h-4" />
                          <span>{t('adminPanel')}</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-50 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('logout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm py-2"
                >
                  {t('register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث عن مقالات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-gray-400 outline-none text-sm bg-gray-50"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </form>

            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-2 py-2">
                  <img
                    src={userData?.avatar}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{userData?.name}</p>
                    <p className="text-sm text-gray-500">{currentUser.email}</p>
                  </div>
                </div>
                <Link
                  to="/write"
                  className="block px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  اكتب مقالاً
                </Link>
                <Link
                  to="/profile"
                  className="block px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  الملف الشخصي
                </Link>
                <Link
                  to="/dashboard"
                  className="block px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  مقالاتي
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-right px-2 py-2 text-red-600 hover:bg-gray-50 rounded-lg"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className="block px-2 py-2 text-gray-900 font-medium hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  إنشاء حساب
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
