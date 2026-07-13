import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [backendItemIds, setBackendItemIds] = useState({}); // productId -> backend cart_item id

  // Calculate totals
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Load any existing backend cart for this session on first mount.
  useEffect(() => {
    (async () => {
      try {
        const backendCart = await api.getCart();
        const items = backendCart.items || [];
        if (items.length > 0) {
          setCart(items.map((it) => ({
            id: it.product_id,
            name: it.product_name,
            price: it.product_price,
            image: it.product_image,
            quantity: it.quantity,
          })));
          setBackendItemIds(Object.fromEntries(items.map((it) => [it.product_id, it.id])));
        }
      } catch (err) {
        // Backend not reachable yet (e.g. running the UI standalone) —
        // fall back to a purely local, in-memory cart.
        console.warn('Cart backend unavailable, using local-only cart:', err.message);
      }
    })();
  }, []);

  const addToCart = async (product, quantity = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    setIsDrawerOpen(true);

    try {
      const result = await api.addCartItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
      });
      if (result?.id) {
        setBackendItemIds((prev) => ({ ...prev, [product.id]: result.id }));
      }
    } catch (err) {
      console.warn('Failed to sync cart item with backend:', err.message);
    }
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
    const backendId = backendItemIds[id];
    if (backendId) {
      api.removeCartItem(backendId).catch((err) =>
        console.warn('Failed to remove cart item on backend:', err.message)
      );
    }
  };

  const updateQuantity = (id, amount) => {
    let newQuantity = null;
    setCart(prevCart => prevCart.map(item => {
      if (item.id === id) {
        newQuantity = Math.max(1, item.quantity + amount);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));

    const backendId = backendItemIds[id];
    if (backendId && newQuantity !== null) {
      api.updateCartItem(backendId, newQuantity).catch((err) =>
        console.warn('Failed to update cart item on backend:', err.message)
      );
    }
  };

  const clearCart = () => {
    setCart([]);
    setBackendItemIds({});
    api.clearBackendCart().catch((err) =>
      console.warn('Failed to clear backend cart:', err.message)
    );
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isDrawerOpen,
      setIsDrawerOpen,
      totalItems,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
