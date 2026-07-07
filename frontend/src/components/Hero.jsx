import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '../assets/icons';
import logoUrl from '../assets/logo.png';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-gradient-to-b from-bg to-surface">
      {/* Animated SVG Blobs in blush */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.svg 
          animate={{ 
            scale: [1, 1.08, 1],
            opacity: [0.6, 0.8, 0.6],
            y: [0, -20, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] text-blush opacity-60" 
          viewBox="0 0 200 200" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,89.1,-0.5C88.1,15.3,83.5,30.6,74.2,42.4C64.9,54.1,50.9,62.3,36.5,69.5C22.1,76.8,7.3,83.1,-7.4,85.1C-22.1,87.1,-36.8,84.7,-50.2,77.5C-63.5,70.2,-75.4,58.1,-82.1,43.6C-88.7,29.2,-90.1,12.4,-88.3,-3.8C-86.4,-20,-81.3,-35.6,-72.1,-48.1C-62.8,-60.7,-49.4,-70.2,-35.5,-77.6C-21.6,-85,-7.2,-90.4,6.7,-93.6C20.6,-96.8,41.2,-97.8,44.7,-76.4Z" transform="translate(100 100)" />
        </motion.svg>
        
        <motion.svg 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
            y: [0, 20, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-20 -left-20 w-[500px] h-[500px] text-blush opacity-50" 
          viewBox="0 0 200 200" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="currentColor" d="M39.9,-65.7C54.1,-60.5,69.7,-53.8,79.6,-41.8C89.4,-29.8,93.5,-12.4,91.8,4.3C90.1,21.1,82.7,37.3,71.2,49.8C59.6,62.3,44.1,71.1,27.7,76.3C11.3,81.6,-6,83.3,-22.4,79.8C-38.8,76.3,-54.3,67.6,-66.1,55.1C-77.9,42.6,-86,26.4,-87.6,9.8C-89.2,-6.9,-84.3,-24,-74.6,-37.2C-64.8,-50.4,-50.1,-59.6,-35.5,-64.5C-20.9,-69.5,-6.3,-70.2,6.8,-79.8C20,-89.4,39.9,-107.9,39.9,-65.7Z" transform="translate(100 100)" />
        </motion.svg>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-right">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-brand leading-tight mb-4"
          >
            توهجي بنضارة طبيعية
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted mb-10 max-w-2xl mx-auto md:mx-0 font-medium"
          >
            منتجات عناية فاخرة لبشرتك، مصنوعة من مكونات طبيعية لتمنحك إشراقة تدوم.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/products" className="inline-flex items-center gap-4 bg-rose-gold text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-rose-dark hover:shadow-lg hover:shadow-rose-gold/30 transition-all duration-300 group">
              <span>تصفحي المنتجات</span>
              <motion.div
                animate={{ x: [-5, 0, -5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex-1 w-full max-w-md md:max-w-none relative"
        >
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-rose-gold/20 aspect-[4/5] border-8 border-white bg-white/60 backdrop-blur-sm p-8 flex items-center justify-center">
            <img 
              src={logoUrl} 
              alt="GlowCare Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none text-surface transform rotate-180">
        <svg className="relative block w-[calc(100%+1.3px)] h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
