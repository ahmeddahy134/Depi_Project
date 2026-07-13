import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { useProducts } from '../context/ProductsContext';
import { LeafIcon, ShieldIcon, StarIcon } from '../assets/icons';

const features = [
  {
    icon: <LeafIcon className="w-10 h-10" />,
    title: "مكونات طبيعية 100%",
    description: "مستخلصة بعناية من الطبيعة لبشرة صحية ومشرقة بدون أي إضافات كيميائية ضارة."
  },
  {
    icon: <ShieldIcon className="w-10 h-10" />,
    title: "خال من المواد الضارة",
    description: "تركيباتنا نقية وآمنة، لا تحتوي على بارابين أو كبريتات أو عطور صناعية."
  },
  {
    icon: <StarIcon className="w-10 h-10" />,
    title: "مجرب طبيا",
    description: "جميع منتجاتنا مختبرة سريرياً من قبل أطباء الجلدية لضمان سلامتك وفعاليتها."
  }
];

const Home = () => {
  const { products, categories } = useProducts();
  const featuredProducts = products.slice(0, 3);

  return (
    <PageTransition>
      <Hero />
      
      {/* Categories Strip */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-display font-bold text-brand">تسوقي حسب الفئة</h2>
          </div>
          
          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 md:grid md:grid-cols-4 md:overflow-visible md:pb-0 md:px-0 gap-6 snap-x snap-mandatory scrollbar-hide">
            {categories.slice(0, 4).map((cat, idx) => (
              <motion.div 
                key={cat.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="min-w-[280px] md:min-w-0 snap-center"
              >
                <CategoryCard category={cat} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-bg relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-brand mb-4">الاكثر مبيعا</h2>
            <div className="w-20 h-1 bg-rose-gold mx-auto rounded-full"></div>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why GlowCare Section */}
      <section className="py-24 bg-blush/20 relative overflow-hidden">
        {/* Top Wave */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none text-bg" style={{ transform: 'translateY(-1px)' }}>
          <svg className="relative block w-[calc(100%+1.3px)] h-[40px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 mt-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-brand mb-4">لماذا GlowCare؟</h2>
            <div className="w-20 h-1 bg-rose-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", bounce: 0.4, delay: idx * 0.2 }}
                className="bg-white rounded-[2.5rem] p-8 text-center shadow-lg shadow-blush/30 border border-white hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-20 h-20 mx-auto bg-surface rounded-full flex items-center justify-center text-rose-gold mb-6 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-brand mb-4">{feature.title}</h3>
                <p className="text-muted leading-relaxed font-medium">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Home;
