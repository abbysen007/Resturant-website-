import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';

export const ReserveTableBanner: React.FC = () => {
  const { setIsReservationModalOpen } = useRestaurant();

  return (
    <section className="py-14 sm:py-20 bg-[#FAFAF7] border-y border-stone-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <span className="font-bengali text-orange-600 font-extrabold text-sm block">
              আজকের ভোজের টেবিল বুক করুন • Park Street Heritage Dining
            </span>
            <h2 className="font-ultra text-3xl sm:text-5xl text-stone-900 tracking-tight leading-tight">
              Do You Have Any Dinner Plan Today? Reserve Your Table
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto lg:mx-0">
              Make online reservations for our vintage courtyard or zamindari verandah dining. Experience our authentic Jamai Shoshthi and Ilish festival spreads fresh at your table.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsReservationModalOpen(true)}
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-500/25 transition-all cursor-pointer active:scale-95"
              >
                Make Reservation
              </button>
            </div>
          </div>

          {/* Right Circular Food Plate with Concentric Terracotta Rings matching reference */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center">
              {/* Concentric rings in warm terracotta/coral matching reference */}
              <div className="absolute inset-0 rounded-full bg-[#F5D8C8] opacity-70" />
              <div className="absolute inset-6 rounded-full bg-[#EBBCA7] opacity-60" />
              <div className="absolute inset-12 rounded-full bg-white shadow-xl" />

              <div className="relative w-56 h-56 sm:w-68 sm:h-68 rounded-full overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=800&q=80"
                  alt="Authentic Slow-Cooked Bengali Kosha Mangsho in Clay Handi"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
