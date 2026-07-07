import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import PageTransition from '../components/PageTransition';
import ProductCard from '../components/ProductCard';
import { PlusIcon, MinusIcon, CheckIcon, ShieldIcon, LeafIcon, ArrowRightIcon } from '../assets/icons';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const product = products.find(p => String(p.id) === String(id));
  const relatedProducts = products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 3);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
  }, [id]);

  if (!product) {
    return (
      <div className="pt-32 min-h-screen text-center bg-bg">
        <h2 className="text-2xl font-bold text-brand mb-4">المنتج غير موجود</h2>
        <Link to="/products" className="text-rose-gold mt-4 inline-block font-bold">العودة للمنتجات</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    toast.success('تمت الإضافة للسلة', {
      icon: <CheckIcon className="w-5 h-5 text-green-500" />
    });
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <PageTransition>
      <div className="pt-32 pb-24 bg-bg min-h-screen">
        <div className="container mx-auto px-4 lg:px-8">
          
          <div className="flex items-center gap-2 text-sm text-muted font-medium mb-8">
            <Link to="/" className="hover:text-rose-gold transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-rose-gold transition-colors">المنتجات</Link>
            <span>/</span>
            <Link to={`/category/${product.slug}`} className="hover:text-rose-gold transition-colors">{product.category}</Link>
            <span>/</span>
            <span className="text-brand">{product.name}</span>
          </div>

          <div className="bg-surface rounded-[3rem] p-6 md:p-10 shadow-sm border border-white mb-20 relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              
              {/* Product Image */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative rounded-[2rem] overflow-hidden group bg-white h-[400px] md:h-[600px] shadow-sm"
              >
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>

              {/* Product Info */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col justify-center"
              >
                <Link to={`/category/${product.slug}`}>
                  <div className="inline-block bg-white text-rose-gold px-4 py-1.5 rounded-full text-sm font-bold mb-4 w-max shadow-sm border border-blush">
                    {product.category}
                  </div>
                </Link>
                
                <h1 className="text-3xl md:text-5xl font-display font-bold text-brand mb-4">{product.name}</h1>
                <p className="text-4xl font-display font-bold text-rose-gold mb-6">{product.price} <span className="text-lg font-normal text-muted font-arabic">ريال</span></p>
                
                <p className="text-muted text-lg leading-relaxed mb-8 font-medium">
                  {product.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <div className="flex items-center justify-between bg-white rounded-full px-4 py-3 sm:w-32 border border-blush shadow-sm">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 text-brand hover:text-rose-gold transition-colors">
                      <MinusIcon className="w-5 h-5" />
                    </button>
                    <span className="text-lg font-bold w-8 text-center font-display">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-1 text-brand hover:text-rose-gold transition-colors">
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-full font-bold text-lg transition-all shadow-md ${
                      isAdded ? 'bg-green-500 text-white' : 'bg-rose-gold text-white hover:bg-rose-dark'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <CheckIcon className="w-6 h-6" />
                        تمت الإضافة
                      </>
                    ) : (
                      'أضف للسلة'
                    )}
                  </motion.button>
                </div>

                <div className="border-t border-muted/20 pt-8 mt-4">
                  <h3 className="text-xl font-bold text-brand mb-4">المكونات الرئيسية</h3>
                  <div className="flex flex-col gap-2 mb-8">
                    {product.ingredients.map((ing, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-muted font-medium">
                        <svg className="w-2 h-2 text-rose-gold" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" /></svg>
                        {ing}
                      </div>
                    ))}
                  </div>

                  <h3 className="text-xl font-bold text-brand mb-4">المميزات</h3>
                  <div className="space-y-3">
                    {product.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-muted font-medium">
                        <div className="text-rose-gold">
                          {feat.includes('طبيعي') ? <LeafIcon className="w-5 h-5" /> : <ShieldIcon className="w-5 h-5" />}
                        </div>
                        {feat}
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <div className="flex items-center justify-center mb-10 gap-4">
                <div className="h-[1px] flex-1 bg-surface"></div>
                <h2 className="text-3xl font-display font-bold text-brand">منتجات مشابهة</h2>
                <div className="h-[1px] flex-1 bg-surface"></div>
              </div>
              
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </motion.div>
            </div>
          )}

        </div>
      </div>
    </PageTransition>
  );
};

export default ProductDetail;
