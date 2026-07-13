import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductsProvider } from './context/ProductsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ProductsProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-bg">
            <Navbar />
            <CartDrawer />
            <main className="flex-grow">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </Router>
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: 'var(--color-bg)',
              color: 'var(--color-brand)',
              fontFamily: 'var(--font-arabic)',
              border: '1px solid var(--color-blush)'
            }
          }}
        />
      </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
};

export default App;
