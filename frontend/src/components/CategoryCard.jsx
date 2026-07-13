import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DropletIcon, SunIcon, SparkleIcon, LeafIcon } from '../assets/icons';

const CategoryCard = ({ category }) => {
  // Map slugs to specific icons
  const getIcon = (slug) => {
    switch(slug) {
      case 'serums': return <DropletIcon className="w-8 h-8" />;
      case 'sunscreen': return <SunIcon className="w-8 h-8" />;
      case 'masks': return <SparkleIcon className="w-8 h-8" />;
      default: return <LeafIcon className="w-8 h-8" />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <Link 
        to={`/category/${category.slug}`}
        className="block bg-surface rounded-2xl p-6 text-center shadow-sm hover:shadow-md border-2 border-transparent hover:border-rose-gold transition-all duration-300 group"
      >
        <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-rose-gold mb-4 group-hover:bg-rose-gold group-hover:text-white transition-colors duration-300">
          {getIcon(category.slug)}
        </div>
        <h3 className="text-xl font-bold text-brand">{category.name}</h3>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
