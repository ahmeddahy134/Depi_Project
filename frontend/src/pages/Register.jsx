import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import { UserIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon, CheckIcon, CloseIcon } from '../assets/icons';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = () => {
    let score = 0;
    if (password.length > 5) score += 25;
    if (password.length > 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    return score;
  };

  const strength = getPasswordStrength();
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) {
      toast.error('كلمات المرور غير متطابقة');
      return;
    }
    
    setIsLoading(true);

    try {
      await register({ name, email, password });
      toast.success('تم انشاء الحساب بنجاح');
      navigate('/');
    } catch (err) {
      toast.error('حدث خطأ أثناء التسجيل');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="انشئي حسابك" subtitle="انضمي لعائلة GlowCare">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        <div>
          <label className="block text-sm font-bold text-brand mb-2">الاسم الكامل</label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted">
              <UserIcon className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border-2 border-blush focus:border-rose-gold text-brand rounded-2xl py-3 pr-12 pl-4 outline-none transition-all duration-300 font-medium"
              placeholder="الاسم الكريم"
            />
          </div>
        </div>

        <div>
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
        </div>

        <div>
          <label className="block text-sm font-bold text-brand mb-2">كلمة المرور</label>
          <div className="relative mb-2">
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
          
          {/* Password strength indicator */}
          {password && (
            <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden mt-1">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${strength}%` }}
                transition={{ duration: 0.3 }}
                className={`h-full ${strength < 50 ? 'bg-red-400' : strength < 100 ? 'bg-yellow-400' : 'bg-green-500'}`}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-brand mb-2">تاكيد كلمة المرور</label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted">
              <LockIcon className="w-5 h-5" />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white border-2 border-blush focus:border-rose-gold text-brand rounded-2xl py-3 pr-12 pl-12 outline-none transition-all duration-300 font-medium dir-ltr text-right"
              placeholder="••••••••"
              dir="ltr"
            />
            {confirmPassword && (
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                {passwordsMatch ? (
                  <CheckIcon className="w-5 h-5 text-green-500" />
                ) : (
                  <CloseIcon className="w-5 h-5 text-red-500" />
                )}
              </div>
            )}
          </div>
        </div>

        <button 
          type="submit"
          disabled={isLoading || !passwordsMatch || password.length === 0}
          className="w-full bg-rose-gold text-white rounded-full py-4 font-bold text-lg hover:bg-rose-dark transition-all duration-300 mt-4 flex justify-center items-center h-14 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <svg className="animate-spin w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            "انشاء الحساب"
          )}
        </button>

        <p className="text-center text-xs text-muted mt-2 font-medium">
          بالتسجيل توافقين على <Link to="#" className="text-rose-gold hover:underline">الشروط والاحكام</Link>
        </p>

        <div className="text-center mt-2">
          <span className="text-muted text-sm font-medium">لدي حساب بالفعل؟ </span>
          <Link to="/login" className="text-rose-gold font-bold hover:text-rose-dark transition-colors">
            تسجيل الدخول
          </Link>
        </div>
        
      </form>
    </AuthLayout>
  );
};

export default Register;
