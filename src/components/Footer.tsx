import React, { useState } from 'react';
import { ArrowRight, Facebook, Twitter, Instagram, Youtube, Send, LayoutDashboard, Shield } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const Footer: React.FC = () => {
  const { setIsLocationModalOpen, setIsReservationModalOpen, setCurrentView } = useRestaurant();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-white/40 backdrop-blur-2xl text-slate-700 border-t border-orange-200/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Brand Header & Newsletter Row matching reference */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center font-black shadow-xs">
              <span className="font-bengali text-2xl">র</span>
            </div>
            <div>
              <span className="text-2xl font-black text-stone-900">Roshoi Ghor</span>
              <span className="font-bengali text-orange-600 text-xs font-black block -mt-1">
                রসুই ঘর • The Bengal Palette
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Follow Us:</span>
            <div className="flex items-center gap-2">
              <a href="#" className="w-8 h-8 rounded-full bg-white border border-stone-200 hover:border-amber-400 flex items-center justify-center text-slate-700 hover:text-amber-700 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white border border-stone-200 hover:border-amber-400 flex items-center justify-center text-slate-700 hover:text-amber-700 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white border border-stone-200 hover:border-amber-400 flex items-center justify-center text-slate-700 hover:text-amber-700 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white border border-stone-200 hover:border-amber-400 flex items-center justify-center text-slate-700 hover:text-amber-700 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* 5-Column Grid matching reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 text-xs sm:text-sm">
          {/* Subscribe Our Newsletter column matching reference */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm">Subscribe Our Newsletter</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Get weekly updates on seasonal Ilish arrivals, secret winter Nolen Gur desserts, and exclusive Bhoj festival discounts.
            </p>

            <form onSubmit={handleSubscribe} className="relative flex items-center max-w-sm">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                className="w-full pl-3.5 pr-12 py-2.5 rounded-full border border-stone-300 text-xs outline-hidden focus:border-amber-500 bg-white"
              />
              <button
                type="submit"
                className="absolute right-1.5 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            {subscribed && (
              <span className="text-emerald-700 font-bold text-xs block">
                ✓ Thank you for subscribing to Roshoi Ghor updates!
              </span>
            )}
          </div>

          {/* Service */}
          <div className="space-y-2.5">
            <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wider">Service</h5>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li><button onClick={() => setIsLocationModalOpen(true)} className="hover:text-amber-800">Online Order (25km)</button></li>
              <li><button onClick={() => setIsReservationModalOpen(true)} className="hover:text-amber-800">Pre-Reservation</button></li>
              <li><span className="text-slate-400">24/7 Kitchen Services</span></li>
              <li><span className="text-slate-400">Park Street Foodie Place</span></li>
              <li><span className="text-slate-400">Master Super Chefs</span></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wider">Quick Links</h5>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li><a href="#menu-section" className="hover:text-amber-800">Menu (মেনু)</a></li>
              <li><a href="#reviews-section" className="hover:text-amber-800">Reviews</a></li>
              <li><a href="#popular-dishes" className="hover:text-amber-800">Popular Dishes</a></li>
              <li><button onClick={() => setIsReservationModalOpen(true)} className="hover:text-amber-800">Reserve Table</button></li>
            </ul>
          </div>

          {/* About */}
          <div className="space-y-2.5">
            <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wider">About</h5>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li><a href="#about-services" className="hover:text-amber-800">Our Story</a></li>
              <li><span className="text-slate-400">Clay Pot Packaging</span></li>
              <li><span className="text-slate-400">25 km Radius Policy</span></li>
              <li><span className="text-slate-400">Our Master Chefs</span></li>
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-2.5">
            <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wider">Help</h5>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li><span className="text-slate-600 font-semibold">+91 33 2229 8400</span></li>
              <li><span className="text-slate-400">support@roshoighor.com</span></li>
              <li><button onClick={() => setIsLocationModalOpen(true)} className="hover:text-amber-800">Delivery Coverage Map</button></li>
            </ul>
          </div>
        </div>

        {/* Dedicated Admin & Kitchen Operations Portal Banner in Footer */}
        <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 rounded-3xl p-5 sm:p-6 border border-orange-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black shadow-md shadow-orange-500/20 shrink-0">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h4 className="font-extrabold text-sm sm:text-base text-stone-900">
                  Restaurant Staff & Operations Portal
                </h4>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                  Kitchen HQ
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Live Kitchen Dispatch Kanban • 25 km Radius Analytics • Fleet & Table Reservations Manager
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setCurrentView('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 shrink-0"
          >
            <Shield className="w-3.5 h-3.5 text-orange-400" />
            <span>Launch Admin Portal (প্রবেশ করুন)</span>
            <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
          </button>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} Roshoi Ghor • The Bengal Palette. All rights reserved.</p>
          <p className="font-bengali text-orange-700 text-sm font-black">
            বাঙালির খাঁটি রসনা তৃপ্তি • খাঁটি সরিষার তেল ও ঘিয়ে প্রস্তুত
          </p>
        </div>
      </div>
    </footer>
  );
};
