import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { InstagramIcon, TwitterIcon, WhatsappIcon, CheckIcon } from '../assets/icons';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="pt-32 pb-24 bg-bg min-h-screen relative overflow-hidden">
        
        {/* Decorative Blob */}
        <div className="absolute top-20 -right-20 w-96 h-96 bg-blush/30 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-10 -left-20 w-80 h-80 bg-surface rounded-full blur-3xl opacity-70 pointer-events-none"></div>

        <div className="container mx-auto px-4 lg:px-8 max-w-4xl relative z-10">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brand mb-4">تواصل معنا</h1>
            <p className="text-muted text-lg max-w-xl mx-auto font-medium">
              نحن هنا للاستماع إليك. سواء كان لديك استفسار عن منتجاتنا أو تحتاجين لمشورة، لا تترددي في مراسلتنا.
            </p>
          </div>

          <div className="bg-surface rounded-[3rem] p-8 md:p-12 shadow-lg border border-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Form Info Side */}
              <div>
                <h3 className="text-2xl font-bold text-brand mb-6">يسعدنا تواصلك</h3>
                <p className="text-muted leading-relaxed mb-8 font-medium">
                  نحن نسعى دائماً لتقديم أفضل تجربة لعملائنا. يمكنك استخدام النموذج لإرسال رسالتك، وسيقوم فريقنا بالرد عليك في أقرب وقت ممكن.
                </p>
                
                <h4 className="text-xl font-bold text-brand mb-4">تابعنا على الشبكات الاجتماعية</h4>
                <div className="flex gap-4">
                  <a href="#" className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brand hover:bg-rose-gold hover:text-white transition-all shadow-sm border border-blush hover:scale-110">
                    <InstagramIcon className="w-6 h-6" />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brand hover:bg-rose-gold hover:text-white transition-all shadow-sm border border-blush hover:scale-110">
                    <TwitterIcon className="w-6 h-6" />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brand hover:bg-rose-gold hover:text-white transition-all shadow-sm border border-blush hover:scale-110">
                    <WhatsappIcon className="w-6 h-6" />
                  </a>
                </div>
              </div>

              {/* Form Input Side */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                <div>
                  <label className="block text-sm font-bold text-brand mb-2">الاسم</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white border-2 border-blush focus:border-rose-gold text-brand rounded-2xl px-4 py-3 outline-none transition-all duration-300 font-medium"
                    placeholder="الاسم الكريم"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-brand mb-2">البريد الالكتروني</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white border-2 border-blush focus:border-rose-gold text-brand rounded-2xl px-4 py-3 outline-none transition-all duration-300 font-medium dir-ltr text-right"
                    placeholder="example@email.com"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-brand mb-2">الرسالة</label>
                  <textarea 
                    required
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-white border-2 border-blush focus:border-rose-gold text-brand rounded-2xl px-4 py-3 outline-none transition-all duration-300 font-medium resize-none"
                    placeholder="اكتبي رسالتك هنا..."
                  ></textarea>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.96 }}
                  disabled={isSubmitting || isSubmitted}
                  type="submit"
                  className={`w-full rounded-full py-4 font-bold text-lg transition-all flex justify-center items-center h-14 ${
                    isSubmitted ? 'bg-green-500 text-white' : 'bg-rose-gold text-white hover:bg-rose-dark shadow-md'
                  }`}
                >
                  {isSubmitting ? (
                    <svg className="animate-spin w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : isSubmitted ? (
                    <>
                      <CheckIcon className="w-6 h-6 ml-2" />
                      تم الإرسال
                    </>
                  ) : (
                    "إرسال الرسالة"
                  )}
                </motion.button>
              </form>
              
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;
