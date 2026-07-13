import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductsContext';
import { ArrowRightIcon } from '../assets/icons';

const Category = () => {
  const { slug } = useParams();
  const { products, categories } = useProducts();
  const [isLoading, setIsLoading] = useState(true);
  
  const category = categories.find(c => c.slug === slug);
  const categoryProducts = products.filter(p => p.slug === slug);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [slug]);

  if (!category) {
    return (
      <PageTransition>
        <div className="pt-32 pb-24 min-h-screen text-center flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-brand mb-4">الفئة غير موجودة</h2>
          <Link to="/products" className="text-rose-gold font-bold hover:text-rose-dark">العودة للمنتجات</Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="pt-32 pb-24 min-h-screen">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted font-medium mb-8">
            <Link to="/" className="hover:text-rose-gold transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-rose-gold transition-colors">المنتجات</Link>
            <span>/</span>
            <span className="text-brand">{category.name}</span>
          </div>

          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-brand mb-4">{category.name}</h1>
            <p className="text-lg text-muted">{category.description}</p>
            <div className="w-24 h-1 bg-rose-gold rounded-full mt-6"></div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-surface rounded-3xl p-4 shadow-sm border border-blush h-[450px] animate-pulse flex flex-col">
                  <div className="bg-blush/30 rounded-2xl h-64 mb-4"></div>
                  <div className="h-6 bg-blush/30 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-blush/30 rounded w-full mb-2"></div>
                  <div className="mt-auto flex justify-between items-center pt-4">
                    <div className="h-8 bg-blush/30 rounded w-20"></div>
                    <div className="h-10 w-10 bg-blush/30 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {categoryProducts.length > 0 ? (
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {categoryProducts.map(product => (
                    <motion.div key={product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-surface rounded-3xl"
                >
                  <p className="text-xl text-muted font-medium mb-4">لا توجد منتجات حالياً في هذه الفئة.</p>
                  <Link to="/products" className="inline-flex items-center gap-2 text-rose-gold font-bold hover:text-rose-dark transition-colors">
                    <ArrowRightIcon className="w-5 h-5" />
                    تصفح باقي المنتجات
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Category;
