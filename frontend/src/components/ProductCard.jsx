import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckIcon } from '../assets/icons';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    setIsAdded(true);
    toast.success('تمت الإضافة للسلة', {
      icon: <CheckIcon className="w-5 h-5 text-green-500" />,
      style: { background: 'var(--color-bg)', color: 'var(--color-brand)' }
    });
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
      }}
      className="group bg-surface rounded-[2rem] p-4 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col h-full border border-blush/30"
    >
      <Link to={`/product/${product.id}`} className="relative block overflow-hidden rounded-2xl mb-4 z-10 flex-shrink-0 bg-white aspect-square">
        <motion.img 
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-rose-gold px-3 py-1 rounded-full text-xs font-bold shadow-sm">
          {product.category}
        </div>
      </Link>

      <div className="flex flex-col flex-1 z-10 px-2">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-xl font-bold text-brand mb-2 group-hover:text-rose-gold transition-colors line-clamp-1">{product.name}</h3>
        </Link>
        <p className="text-muted text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-blush border-dashed">
          <span className="text-2xl font-bold text-brand font-display">{product.price} <span className="text-sm text-muted font-normal font-arabic">ريال</span></span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isAdded ? 'bg-green-500 text-white' : 'bg-rose-gold text-white hover:bg-rose-dark shadow-md'
            }`}
          >
            {isAdded ? (
              <CheckIcon className="w-5 h-5" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
