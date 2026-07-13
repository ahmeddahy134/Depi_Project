import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import toast from 'react-hot-toast';
import { TrashIcon, PlusIcon, MinusIcon, ArrowRightIcon } from '../assets/icons';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({ address: '', phone: '', payment: 'cash_on_delivery' });

  const handlePlaceOrder = async () => {
    if (!form.address || !form.phone) {
      toast.error('من فضلك أدخلي العنوان ورقم الهاتف');
      return;
    }
    setPlacing(true);
    try {
      await createOrder({
        items: cart,
        shippingAddress: form.address,
        phone: form.phone,
        paymentMethod: form.payment,
      });
      toast.success('تم تأكيد طلبك بنجاح!');
      clearCart();
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'حدث خطأ أثناء تنفيذ الطلب');
    } finally {
      setPlacing(false);
    }
  };


  if (cart.length === 0) {
    return (
      <PageTransition>
        <div className="pt-32 pb-24 min-h-screen bg-bg flex items-center justify-center">
          <div className="text-center px-4">
            <svg className="w-32 h-32 mx-auto text-rose-gold mb-6 opacity-80" viewBox="0 0 24 24" fill="none" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <h2 className="text-3xl font-display font-bold text-brand mb-4">سلة المشتريات فارغة</h2>
            <p className="text-muted mb-8 max-w-md mx-auto font-medium">يبدو أنك لم تقومي بإضافة أي منتجات إلى سلتك حتى الآن. تصفحي منتجاتنا واختاري ما يناسب بشرتك.</p>
            <Link to="/products" className="inline-block bg-rose-gold text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-rose-dark transition-colors shadow-md">
              بدء التسوق
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="pt-32 pb-24 bg-bg min-h-screen">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand mb-12">سلة المشتريات</h1>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Cart Items List */}
            <div className="flex-[2]">
              <div className="bg-surface rounded-[2rem] p-6 md:p-8 shadow-sm border border-white">
                <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-blush mb-6 text-muted font-bold text-sm">
                  <div className="col-span-6">المنتج</div>
                  <div className="col-span-3 text-center">الكمية</div>
                  <div className="col-span-2 text-center">السعر</div>
                  <div className="col-span-1"></div>
                </div>

                <div className="flex flex-col gap-6">
                  {cart.map(item => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      key={item.id} 
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pb-6 border-b border-blush last:border-0 last:pb-0"
                    >
                      <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-2xl bg-white shadow-sm" />
                        <div>
                          <h3 className="text-lg font-bold text-brand mb-1">{item.name}</h3>
                          <p className="text-muted text-sm md:hidden mb-2 font-display">{item.price} ريال</p>
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-3 flex justify-start md:justify-center">
                        <div className="flex items-center gap-3 bg-white border border-blush shadow-sm rounded-full px-3 py-2 w-max">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-brand hover:text-rose-gold transition-colors">
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="text-base font-bold w-6 text-center font-display">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-brand hover:text-rose-gold transition-colors">
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="hidden md:block col-span-2 text-center">
                        <span className="text-xl font-bold text-brand font-display">{item.price * item.quantity} ريال</span>
                      </div>

                      <div className="absolute md:static left-6 mt-4 md:mt-0 md:col-span-1 flex justify-end">
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted hover:text-red-500 transition-colors p-2 bg-bg md:bg-transparent rounded-full shadow-sm md:shadow-none"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="flex-1">
              <div className="bg-surface rounded-[2rem] p-6 md:p-8 shadow-sm border border-white sticky top-32">
                <h3 className="text-2xl font-bold text-brand mb-6 pb-4 border-b border-blush">ملخص الطلب</h3>
                
                <div className="flex justify-between mb-4 text-muted text-lg font-medium">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold text-brand font-display">{subtotal} ريال</span>
                </div>
                
                <div className="flex justify-between mb-6 text-muted text-lg font-medium">
                  <span>التوصيل</span>
                  <span className="font-bold text-rose-gold">مجاني</span>
                </div>
                
                <div className="flex justify-between mb-8 pb-6 border-b border-blush text-2xl font-display font-bold text-brand">
                  <span>الإجمالي</span>
                  <span>{subtotal} ريال</span>
                </div>

                {!showCheckout ? (
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-rose-gold text-white py-4 rounded-full font-bold text-xl hover:bg-rose-dark transition-all shadow-md mb-4 flex justify-center items-center h-16"
                  >
                    إتمام الطلب
                  </button>
                ) : (
                  <div className="flex flex-col gap-3 mb-4">
                    <input
                      type="text"
                      placeholder="عنوان التوصيل"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full bg-white text-brand px-5 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-rose-gold/50 border border-blush font-medium"
                    />
                    <input
                      type="tel"
                      placeholder="رقم الهاتف"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-white text-brand px-5 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-rose-gold/50 border border-blush font-medium"
                    />
                    <select
                      value={form.payment}
                      onChange={(e) => setForm({ ...form, payment: e.target.value })}
                      className="w-full bg-white text-brand px-5 py-3 rounded-2xl outline-none border border-blush font-bold"
                    >
                      <option value="cash_on_delivery">الدفع عند الاستلام</option>
                      <option value="card">بطاقة ائتمان</option>
                    </select>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={placing}
                      className="w-full bg-rose-gold text-white py-4 rounded-full font-bold text-xl hover:bg-rose-dark transition-all shadow-md flex justify-center items-center h-16 disabled:opacity-60"
                    >
                      {placing ? 'جاري تنفيذ الطلب...' : 'تأكيد الطلب'}
                    </button>
                  </div>
                )}
                
                <Link to="/products" className="flex items-center justify-center gap-2 text-muted hover:text-rose-gold font-bold transition-colors mt-4">
                  <ArrowRightIcon className="w-4 h-4" />
                  الاستمرار في التسوق
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default Cart;
