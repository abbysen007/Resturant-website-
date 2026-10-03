import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { UtensilsCrossed, MapPin, ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setIsLocationModalOpen, setIsReservationModalOpen } = useRestaurant();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#FAFAF7] pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-stone-200/60">
      {/* Decorative dot sprinkles matching reference (top-left & bottom-right) */}
      <div className="absolute top-6 left-6 w-32 h-32 sprinkles-pattern opacity-40 pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-36 h-36 sprinkles-pattern opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div>
              <span className="font-bengali text-orange-600 text-sm sm:text-base font-extrabold tracking-wide block mb-2">
                বাঙালির খাঁটি রসনা তৃপ্তি • রসুই ঘর
              </span>
              <h1 className="font-ultra text-3xl sm:text-5xl lg:text-[54px] text-stone-900 tracking-tight leading-[1.18]">
                We Serve The Authentic Taste You Love 😍
              </h1>
            </div>

            <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal">
              Heritage Bengali restaurant celebrating authentic slow-cooked culinary traditions from the kitchens of Bengal, served in earthen handis. Piping hot delivery within our strict <strong>25 km radius</strong>.
            </p>

            {/* Action Buttons matching reference */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => scrollToSection('menu-section')}
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm sm:text-base shadow-md shadow-orange-500/25 transition-all cursor-pointer active:scale-95"
              >
                Explore Menu
              </button>

              <button
                onClick={() => setIsReservationModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-orange-50/60 border border-orange-200 text-orange-950 font-bold text-sm sm:text-base shadow-xs transition-all cursor-pointer"
              >
                <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                <span>Book a Table</span>
              </button>
            </div>
          </div>

          {/* Right Plate & Floating Categories Column */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Concentric radial soft rings background */}
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#F3EDE2] opacity-80" />
              <div className="absolute inset-6 rounded-full bg-[#EFE4D2] opacity-70" />
              <div className="absolute inset-12 rounded-full bg-white shadow-lg" />

              {/* Main Circular Food Plate matching reference */}
              <div className="relative w-64 h-64 sm:w-76 sm:h-76 rounded-full overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80"
                  alt="Authentic Bengali Shorshe Ilish & Steamed Fish Feast"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating leaf at top */}
              <div className="absolute -top-4 right-20 w-12 h-12 rotate-45 pointer-events-none drop-shadow-md">
                <span className="text-3xl">🍃</span>
              </div>
            </div>

            {/* Vertical Pill Category List on Right (Exact match from reference mockup!) */}
            <div className="hidden sm:flex flex-col gap-2.5 ml-4 sm:ml-6 shrink-0">
              {[
                { label: 'Dishes', icon: '🍲', category: 'curries' },
                { label: 'Dessert', icon: '🍮', category: 'desserts' },
                { label: 'Drinks', icon: '🍹', category: 'beverages' },
                { label: 'Platter', icon: '🍱', category: 'thalis' },
                { label: 'Snacks', icon: '🥟', category: 'starters' }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection('menu-section')}
                  className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 shadow-xs hover:shadow-md hover:border-amber-300 transition-all text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <span className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center text-sm">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
