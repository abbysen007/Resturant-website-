import React from 'react';
import {
  Bike,
  UtensilsCrossed,
  Clock,
  Sparkles,
  ChefHat,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const ServicesSection: React.FC = () => {
  const { setIsReservationModalOpen } = useRestaurant();

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about-services" className="py-12 sm:py-20 bg-stone-50/60 border-y border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Collage matching reference */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
              {/* Radial background rings */}
              <div className="absolute inset-0 rounded-full bg-[#EFE8DC] opacity-80" />
              <div className="absolute inset-4 rounded-full bg-white shadow-xl overflow-hidden border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80"
                  alt="Master Bengali Chef"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Floating quadrant circular ingredient photos */}
              <div className="absolute -top-3 -right-3 w-20 h-20 rounded-full overflow-hidden border-3 border-white shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80"
                  alt="Fresh Spices"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute -bottom-3 -left-3 w-20 h-20 rounded-full overflow-hidden border-3 border-white shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=300&q=80"
                  alt="Authentic Sweets"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Text & 6-Items Grid matching reference */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="font-bengali text-orange-600 font-extrabold text-sm block mb-1">
                আমাদের সেবা ও অঙ্গীকার
              </span>
              <h2 className="font-ultra text-3xl sm:text-5xl text-stone-900 tracking-tight leading-tight">
                We Are More Than Multiple Service
              </h2>
            </div>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Roshoi Ghor blends time-honored Bengali royal recipes with a cutting-edge <strong>25 km hyperlocal radius delivery engine</strong>. Every dish is cooked in virgin mustard oil and pure ghee, packaged in thermal earthen handis.
            </p>

            {/* 6 Features Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                  <Bike className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900">Online Order</h4>
                  <p className="text-[11px] text-stone-400">25 km express radius</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900">Pre-Reservation</h4>
                  <p className="text-[11px] text-stone-400">Courtyard &amp; Verandah</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900">Express Kitchen</h4>
                  <p className="text-[11px] text-stone-400">Fast 35-min prep</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900">Organized Foodie Place</h4>
                  <p className="text-[11px] text-stone-400">Heritage Park Street HQ</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900">Clean Kitchen</h4>
                  <p className="text-[11px] text-stone-400">Clay pots &amp; banana leaf</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <ChefHat className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900">Super Chefs</h4>
                  <p className="text-[11px] text-stone-400">Artisanal Bawarchis</p>
                </div>
              </div>
            </div>

            {/* About Us Button matching reference */}
            <div className="pt-2">
              <button
                onClick={scrollToMenu}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all cursor-pointer active:scale-95"
              >
                About Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
