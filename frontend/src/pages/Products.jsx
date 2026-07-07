import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductsContext';
import { SearchIcon } from '../assets/icons';

const sortOptions = ["الاحدث", "السعر: من الاقل", "السعر: من الاعلى"];

const Products = () => {
  const { products, categories, loading: dataLoading } = useProducts();
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("الاحدث");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const showLoading = isLoading || dataLoading;

  let filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === "الكل" || product.slug === activeCategory;
    const matchesSearch = product.name.includes(searchQuery) || product.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (sortOption === "السعر: من الاقل") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "السعر: من الاعلى") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <PageTransition>
      <div className="pt-32 pb-24 bg-bg min-h-screen">
        <div className="container mx-auto px-4 lg:px-8">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brand mb-4">كل المنتجات</h1>
            <p className="text-muted text-lg max-w-2xl mx-auto font-medium">
              اكتشفي مجموعتنا المتكاملة للعناية بالبشرة، المصممة خصيصاً لتلبي جميع احتياجاتك.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Desktop Sidebar / Mobile Top Sheet for Categories */}
            <div className="w-full lg:w-64 flex-shrink-0 bg-surface p-6 rounded-3xl sticky top-32">
              <h3 className="text-xl font-bold text-brand mb-4 border-b border-white pb-4">تسوقي حسب الفئة</h3>
              <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
                <button
                  onClick={() => setActiveCategory("الكل")}
                  className={`relative px-4 py-3 rounded-xl text-right font-bold transition-all whitespace-nowrap z-10 ${
                    activeCategory === "الكل" ? 'text-white' : 'text-muted hover:text-brand bg-white/50 lg:bg-transparent'
                  }`}
                >
                  {activeCategory === "الكل" && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-rose-gold rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  الكل
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`relative px-4 py-3 rounded-xl text-right font-bold transition-all whitespace-nowrap z-10 ${
                      activeCategory === cat.slug ? 'text-white' : 'text-muted hover:text-brand bg-white/50 lg:bg-transparent'
                    }`}
                  >
                    {activeCategory === cat.slug && (
                      <motion.div
                        layoutId="activeFilter"
                        className="absolute inset-0 bg-rose-gold rounded-xl -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full">
              {/* Search and Sort */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-surface p-4 rounded-2xl">
                <div className="relative w-full sm:w-80">
                  <input 
                    type="text" 
                    placeholder="ابحثي عن منتج..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white text-brand px-6 py-3 pr-12 rounded-full outline-none focus:ring-2 focus:ring-rose-gold/50 transition-all font-medium border border-blush"
                  />
                  <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                </div>
                
                <div className="w-full sm:w-auto">
                  <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full sm:w-auto bg-white text-brand border border-blush px-4 py-3 rounded-full outline-none font-bold"
                  >
                    {sortOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              {showLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-surface rounded-[2rem] p-4 shadow-sm border border-blush h-[400px] animate-pulse flex flex-col">
                      <div className="bg-white/50 rounded-2xl h-64 mb-4"></div>
                      <div className="h-6 bg-white/50 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-white/50 rounded w-full mb-2"></div>
                      <div className="mt-auto flex justify-between items-center pt-4">
                        <div className="h-8 bg-white/50 rounded w-20"></div>
                        <div className="h-10 w-10 bg-white/50 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredProducts.length > 0 ? (
                    <motion.div 
                      layout
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {filteredProducts.map(product => (
                        <motion.div
                          key={product.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ProductCard product={product} />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-20 bg-surface rounded-[3rem]"
                    >
                      <SearchIcon className="w-16 h-16 text-muted mx-auto mb-4 opacity-50" />
                      <h3 className="text-2xl font-bold text-brand mb-2">لا توجد نتائج</h3>
                      <p className="text-muted font-medium">لم نتمكن من العثور على منتجات تطابق بحثك.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Products;
