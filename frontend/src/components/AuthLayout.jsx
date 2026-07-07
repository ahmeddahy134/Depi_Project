import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from './PageTransition';
import logoUrl from '../assets/logo.png';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center px-4 bg-bg">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md bg-surface rounded-3xl p-8 md:p-10 shadow-lg border border-white/50"
        >
          <div className="text-center mb-8">
            <img src={logoUrl} alt="GlowCare" className="h-16 w-auto mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-brand mb-2">{title}</h1>
            <p className="text-muted font-medium">{subtitle}</p>
          </div>
          
          {children}
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default AuthLayout;
