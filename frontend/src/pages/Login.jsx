import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from '../assets/icons';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    try {
      await login(email, password);
      toast.success('تم تسجيل الدخول بنجاح');
      navigate('/');
    } catch (err) {
      setError(true);
      toast.error('بيانات الدخول غير صحيحة');
    } finally {
      setIsLoading(false);
    }
  };

  const shakeAnimation = {
    x: error ? [-10, 10, -10, 10, 0] : 0,
    transition: { duration: 0.4 }
  };

  return (
    <AuthLayout title="مرحبا بعودتك" subtitle="سجلي دخولك للمتابعة">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        <motion.div animate={shakeAnimation}>
          <label className="block text-sm font-bold text-brand mb-2">البريد الالكتروني</label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted">
              <MailIcon className="w-5 h-5" />
            </div>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border-2 border-blush focus:border-rose-gold text-brand rounded-2xl py-3 pr-12 pl-4 outline-none transition-all duration-300 font-medium dir-ltr text-right"
              placeholder="example@email.com"
              dir="ltr"
            />
          </div>
        </motion.div>

        <motion.div animate={shakeAnimation}>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-brand">كلمة المرور</label>
            <Link to="#" className="text-xs font-bold text-muted hover:text-rose-gold transition-colors">نسيت كلمة المرور؟</Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted">
              <LockIcon className="w-5 h-5" />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border-2 border-blush focus:border-rose-gold text-brand rounded-2xl py-3 pr-12 pl-12 outline-none transition-all duration-300 font-medium dir-ltr text-right"
              placeholder="••••••••"
              dir="ltr"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted hover:text-rose-gold transition-colors"
            >
              {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-rose-gold text-white rounded-full py-4 font-bold text-lg hover:bg-rose-dark transition-all duration-300 mt-2 flex justify-center items-center h-14"
        >
          {isLoading ? (
            <svg className="animate-spin w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            "تسجيل الدخول"
          )}
        </button>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-muted/30"></div>
          <span className="flex-shrink-0 mx-4 text-muted text-sm font-medium">او</span>
          <div className="flex-grow border-t border-muted/30"></div>
        </div>

        <Link 
          to="/register" 
          className="w-full bg-white text-brand border-2 border-blush rounded-full py-3 font-bold text-center hover:border-rose-gold hover:text-rose-gold transition-all duration-300"
        >
          انشئي حسابا جديدا
        </Link>
        
      </form>
    </AuthLayout>
  );
};

export default Login;
