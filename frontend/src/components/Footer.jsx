import React from 'react';
import { Link } from 'react-router-dom';
import { InstagramIcon, TwitterIcon, WhatsappIcon } from '../assets/icons';
import logoUrl from '../assets/logo.png';
import { categories } from '../data/products';

const Footer = () => {
  return (
    <footer className="relative bg-surface pt-20 pb-10 overflow-hidden mt-20">
      {/* SVG Curved Top Border in Blush */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none text-blush" style={{ transform: 'translateY(-1px)' }}>
        <svg className="relative block w-[calc(100%+1.3px)] h-[40px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16">
          
          <div className="flex flex-col items-center md:items-start gap-6 col-span-1 md:col-span-2">
            <img src={logoUrl} alt="GlowCare" className="h-10 w-auto" />
            <p className="text-brand font-display text-xl font-medium mt-2">اشرقي بجمالك الطبيعي</p>
            <p className="text-muted leading-relaxed max-w-sm text-center md:text-right mt-2">
              نحن نؤمن بأن الجمال الحقيقي ينبع من الطبيعة. نقدم لك أفضل منتجات العناية بالبشرة لبشرة نضرة ومشرقة.
            </p>
          </div>

          <div className="flex flex-col gap-4 items-center md:items-start">
            <h3 className="text-xl font-bold text-brand mb-2">روابط سريعة</h3>
            <Link to="/" className="text-muted hover:text-rose-gold transition-colors font-medium">الرئيسية</Link>
            <Link to="/products" className="text-muted hover:text-rose-gold transition-colors font-medium">المنتجات</Link>
            <Link to="/contact" className="text-muted hover:text-rose-gold transition-colors font-medium">تواصل معنا</Link>
            <Link to="#" className="text-muted hover:text-rose-gold transition-colors font-medium">سياسة الخصوصية</Link>
          </div>

          <div className="flex flex-col gap-4 items-center md:items-start">
            <h3 className="text-xl font-bold text-brand mb-2">الفئات</h3>
            {categories.slice(0, 4).map(cat => (
              <Link key={cat.id} to={`/category/${cat.slug}`} className="text-muted hover:text-rose-gold transition-colors font-medium">
                {cat.name}
              </Link>
            ))}
          </div>
          
        </div>

        <div className="mt-16 pt-8 border-t border-muted/20 text-center flex flex-col md:flex-row justify-between items-center gap-6 text-muted font-medium">
          <p>جميع الحقوق محفوظة GlowCare © 2025</p>
          
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand hover:bg-rose-gold hover:text-white transition-all transform hover:scale-110">
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand hover:bg-rose-gold hover:text-white transition-all transform hover:scale-110">
              <TwitterIcon className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand hover:bg-rose-gold hover:text-white transition-all transform hover:scale-110">
              <WhatsappIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
