import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { X, Smartphone, ArrowRight, ShieldCheck, Check, Sparkles, AlertCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithGoogle, loginWithNumber } = useRestaurant();
  const [authMethod, setAuthMethod] = useState<'google' | 'phone'>('google');

  // Phone auth states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Google customizer
  const [googleEmail, setGoogleEmail] = useState('senabby420@gmail.com');
  const [googleName, setGoogleName] = useState('Abhijit Sen');

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 10) {
      setPhoneError('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setPhoneError(null);
    setOtpSent(true);
    setOtpCode('1234'); // Auto-fill demo OTP for effortless testing
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '1234' && otpCode.length < 4) {
      setPhoneError('Please enter the 4-digit verification code (Demo: 1234)');
      return;
    }
    loginWithNumber(`+91 ${phoneNumber}`, customerName || 'Kolkata Foodie');
    setOtpSent(false);
    setPhoneNumber('');
    setOtpCode('');
  };

  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithGoogle(googleEmail, googleName);
  };

  return (
    <div
      onClick={() => setIsAuthModalOpen(false)}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative overflow-hidden"
      >
        {/* Glow ambient accent behind */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100/70 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center font-black mx-auto shadow-md shadow-orange-500/20">
            <span className="font-bengali text-2xl">র</span>
          </div>
          <h3 className="font-ultra text-2xl text-stone-900 tracking-tight">
            স্বাগতম • Welcome to Roshoi Ghor
          </h3>
          <p className="text-xs text-stone-600 font-medium">
            Sign in to track orders, save Kolkata delivery addresses &amp; earn Shonali loyalty rewards
          </p>
        </div>

        {/* Tab Toggle: Google vs Number */}
        <div className="grid grid-cols-2 p-1 bg-stone-100/80 rounded-2xl mb-6 text-xs font-bold border border-stone-200/50">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('google');
              setPhoneError(null);
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMethod === 'google'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {/* Google SVG Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMethod('phone');
              setPhoneError(null);
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMethod === 'phone'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-orange-600" />
            <span>Mobile OTP</span>
          </button>
        </div>

        {/* METHOD 1: GOOGLE AUTH */}
        {authMethod === 'google' && (
          <form onSubmit={handleGoogleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-black uppercase text-stone-500 mb-1">
                  Google Account Name:
                </label>
                <input
                  type="text"
                  required
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/70 border border-stone-200 text-stone-900 font-semibold text-xs outline-hidden focus:border-orange-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-stone-500 mb-1">
                  Google Email Address:
                </label>
                <input
                  type="email"
                  required
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/70 border border-stone-200 text-stone-900 font-semibold text-xs outline-hidden focus:border-orange-500 shadow-2xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-black text-xs border border-stone-300 shadow-md flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-98"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>
        )}

        {/* METHOD 2: PHONE NUMBER OTP */}
        {authMethod === 'phone' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-black uppercase text-stone-500 mb-1">
                    Your Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abhijit Sen"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/70 border border-stone-200 text-stone-900 font-semibold text-xs outline-hidden focus:border-orange-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-stone-500 mb-1">
                    Mobile Number (India):
                  </label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-600 font-mono font-bold text-xs flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="98301 23456"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      maxLength={10}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/70 border border-stone-200 text-stone-900 font-mono font-bold text-xs outline-hidden focus:border-orange-500 shadow-2xs tracking-wider"
                    />
                  </div>
                </div>

                {phoneError && (
                  <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {phoneError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <span>Send Verification Code (OTP)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                <div className="p-3 rounded-2xl bg-orange-50/70 border border-orange-200 text-xs text-orange-950 flex items-center justify-between">
                  <span>Code sent to: <strong>+91 {phoneNumber}</strong></span>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-orange-700 font-bold underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-stone-500 mb-1">
                    Enter 4-Digit OTP (Demo: 1234):
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="1234"
                    className="w-full text-center tracking-widest text-lg font-mono font-black py-2.5 rounded-xl bg-white/80 border border-stone-200 text-stone-900 outline-hidden focus:border-orange-500 shadow-2xs"
                  />
                </div>

                {phoneError && (
                  <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {phoneError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <Check className="w-4 h-4" />
                  <span>Verify &amp; Sign In</span>
                </button>
              </form>
            )}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-stone-200/60 flex items-center justify-center gap-2 text-[11px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secure session • 25 km Kolkata Food Delivery</span>
        </div>
      </div>
    </div>
  );
};
