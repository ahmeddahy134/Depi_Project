import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CartIcon, MenuIcon, CloseIcon, SearchIcon, UserIcon } from '../assets/icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/products';
import logoUrl from '../assets/logo.png';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { totalItems, setIsDrawerOpen } = useCart();
  const { user, logout } = useAuth();
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 50) setScrolled(true);
      else setScrolled(false);

      if (currentScrollY > lastScrollY && currentScrollY > 100 && !mobileMenuOpen) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-bg/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
        
        {/* Right side (Visual Left for RTL) */}
        <div className="flex items-center gap-4 z-50">
          <button className="p-2 text-brand hover:text-rose-gold transition-colors">
            <SearchIcon className="w-6 h-6 md:w-7 md:h-7" />
          </button>
          
          <button 
            className="relative p-2 text-brand hover:text-rose-gold transition-colors"
            onClick={() => setIsDrawerOpen(true)}
          >
            <CartIcon className="w-6 h-6 md:w-7 md:h-7" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  key={totalItems}
                  className="absolute top-0 right-0 w-5 h-5 bg-rose-gold text-white text-xs font-display font-bold rounded-full flex items-center justify-center translate-x-1 -translate-y-1"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <div className="hidden md:flex items-center gap-4 mr-4 border-r border-blush pr-4">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-10 h-10 rounded-full bg-rose-gold text-white flex items-center justify-center font-bold font-arabic hover:shadow-md transition-shadow"
                >
                  {user.initial}
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-blush py-2 overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-blush/50 mb-2">
                        <p className="text-sm font-bold text-brand">{user.name}</p>
                      </div>
                      <Link to="/profile" className="block px-4 py-2 text-brand hover:bg-bg transition-colors" onClick={() => setShowUserMenu(false)}>حسابي</Link>
                      <button onClick={handleLogout} className="w-full text-right px-4 py-2 text-rose-dark hover:bg-bg transition-colors">تسجيل الخروج</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-brand hover:text-rose-gold font-bold transition-colors">دخول</Link>
                <Link to="/register" className="bg-rose-gold text-white px-5 py-2 rounded-full font-bold hover:bg-rose-dark transition-colors">تسجيل</Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-brand p-2 mr-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={({ isActive }) => `relative text-lg font-bold transition-colors hover:text-rose-gold ${isActive ? 'text-rose-gold' : 'text-brand'}`}>الرئيسية</NavLink>
          
          <div 
            className="relative py-4"
            onMouseEnter={() => setShowCategories(true)}
            onMouseLeave={() => setShowCategories(false)}
          >
            <NavLink to="/products" className={({ isActive }) => `relative text-lg font-bold transition-colors hover:text-rose-gold ${isActive ? 'text-rose-gold' : 'text-brand'}`}>
              المنتجات
            </NavLink>
            
            <AnimatePresence>
              {showCategories && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-1/2 translate-x-1/2 w-64 bg-white rounded-2xl shadow-xl border border-blush overflow-hidden pt-2 pb-4"
                >
                  <div className="grid grid-cols-1">
                    {categories.map((cat) => (
                      <Link 
                        key={cat.id} 
                        to={`/category/${cat.slug}`}
                        onClick={() => setShowCategories(false)}
                        className="px-6 py-2 text-brand hover:bg-bg hover:text-rose-gold transition-colors font-medium"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <NavLink to="/contact" className={({ isActive }) => `relative text-lg font-bold transition-colors hover:text-rose-gold ${isActive ? 'text-rose-gold' : 'text-brand'}`}>تواصل معنا</NavLink>
        </nav>

        {/* Left side (Visual Right for RTL) - Logo */}
        <Link to="/" className="flex-shrink-0 z-50">
          <img src={logoUrl} alt="GlowCare Logo" className="h-12 w-auto" />
        </Link>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brand/50 z-40 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-bg z-50 shadow-2xl flex flex-col md:hidden overflow-y-auto"
            >
              <div className="flex justify-between items-center p-6 border-b border-surface">
                <img src={logoUrl} alt="GlowCare Logo" className="h-10 w-auto" />
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-brand hover:text-rose-gold bg-surface rounded-full"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="flex flex-col p-6 gap-6 flex-1">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-brand border-b border-surface pb-4">الرئيسية</Link>
                <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-brand border-b border-surface pb-4">كل المنتجات</Link>
                
                <div className="flex flex-col gap-3 pl-4 border-b border-surface pb-4">
                  <p className="text-muted font-bold text-sm mb-2">تسوقي حسب الفئة</p>
                  {categories.map((cat) => (
                    <Link 
                      key={cat.id} 
                      to={`/category/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-brand hover:text-rose-gold transition-colors font-medium"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
                
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-brand border-b border-surface pb-4">تواصل معنا</Link>
              </nav>

              <div className="p-6 border-t border-surface bg-white">
                {user ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-rose-gold text-white flex items-center justify-center font-bold text-xl">
                        {user.initial}
                      </div>
                      <div>
                        <p className="font-bold text-brand">{user.name}</p>
                        <p className="text-sm text-muted">{user.email}</p>
                      </div>
                    </div>
                    <button onClick={handleLogout} className="w-full bg-surface text-brand py-3 rounded-full font-bold hover:bg-rose-gold hover:text-white transition-colors">
                      تسجيل الخروج
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full bg-surface text-brand py-3 rounded-full font-bold text-center hover:bg-rose-gold hover:text-white transition-colors">
                      تسجيل الدخول
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full bg-rose-gold text-white py-3 rounded-full font-bold text-center hover:bg-rose-dark transition-colors">
                      انشاء حساب جديد
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
