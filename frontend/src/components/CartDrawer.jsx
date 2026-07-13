import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { CloseIcon, TrashIcon, PlusIcon, MinusIcon } from '../assets/icons';

const CartDrawer = () => {
  const { isDrawerOpen, setIsDrawerOpen, cart, removeFromCart, updateQuantity, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-brand/50 backdrop-blur-sm z-50"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-surface shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-blush/50 bg-bg">
              <h2 className="text-2xl font-bold text-brand">سلة المشتريات</h2>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-brand hover:text-rose-gold bg-white rounded-full shadow-sm transition-colors"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 bg-surface">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                  <svg className="w-24 h-24 mb-6 text-rose-gold" viewBox="0 0 24 24" fill="none" strokeWidth={1} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <p className="text-xl font-bold text-brand mb-2">السلة فارغة</p>
                  <p className="text-muted font-medium">ابدئي بإضافة بعض المنتجات الرائعة</p>
                  <Link 
                    to="/products"
                    onClick={() => setIsDrawerOpen(false)}
                    className="mt-6 text-rose-gold font-bold hover:underline"
                  >
                    تصفح المنتجات
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <AnimatePresence>
                    {cart.map(item => (
                      <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0 }}
                        className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-blush/30 relative"
                      >
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-blush/30" />
                        <div className="flex-1 flex flex-col">
                          <h3 className="text-brand font-bold text-sm mb-1">{item.name}</h3>
                          <p className="text-rose-gold font-display font-bold text-lg mb-2">{item.price} ريال</p>
                          
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2 bg-surface rounded-full px-2 py-1 border border-blush/50">
                              <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-brand hover:text-rose-gold">
                                <MinusIcon className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-bold w-4 text-center font-display">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-brand hover:text-rose-gold">
                                <PlusIcon className="w-3 h-3" />
                              </button>
                            </div>
                            
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-muted hover:text-red-500 p-2 bg-bg rounded-full transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-blush/50 p-6 bg-bg">
                <div className="flex justify-between items-center mb-6 text-xl">
                  <span className="font-bold text-brand">المجموع</span>
                  <span className="font-bold text-brand font-display">{subtotal} ريال</span>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Link 
                    to="/cart"
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full bg-white text-rose-gold border-2 border-rose-gold py-4 rounded-full font-bold text-center hover:bg-rose-gold hover:text-white transition-colors"
                  >
                    عرض السلة
                  </Link>
                  <button className="w-full bg-rose-gold text-white py-4 rounded-full font-bold text-center hover:bg-rose-dark transition-colors shadow-md">
                    إتمام الطلب
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
